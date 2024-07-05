import db from "@/pages/api/db.config/db";
import path from "path";
import fs from "fs";
import { IncomingForm } from "formidable";
const { unlink } = require("fs").promises;


export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {

  // Handler to get data by ID
  if (req.method === "GET") {
    try {
      const id = req.query.id;
      if (id) {
        const [rows] = await db.query("SELECT * FROM tecnology WHERE id = ?", [id]);
        if (rows.length === 0) {
          return res.status(404).json({ error: 'Technology not found' });
        }
        return res.status(200).json(rows[0]);
      }
      // const [rows] = await db.query("SELECT * FROM tecnology");
      // return res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  // Save edit
  else if (req.method === "PUT") {
    const id = req.query.id;
    try {
      const form = new IncomingForm();
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("Error parsing the form", err);
          return res.status(500).json({ success: false, error: "Form parsing error" });
        }
        const { tecno_name } = fields;
        const image = files.tecno_image ? files.tecno_image[0] : null;
        const newPath = files.tecno_image ? `${Date.now()}_${files.tecno_image[0].originalFilename}` : null;

        // Get the old image
        const [oldImageRows] = await db.query("SELECT tecno_image FROM tecnology WHERE id = ?", [id]);

        if (oldImageRows.length === 0) {
          return res.status(404).json({ success: false, message: "Service not found" });
        }

        // Handle case where no image is uploaded
        if (!newPath) {
          const sql = "UPDATE tecnology SET tecno_name = ? WHERE id = ?";
          const params = [tecno_name, id];
          await db.query(sql, params);
          return res.status(200).json({ success: true, message: "Service updated successfully without changing the image" });
        }

        const newImageName = `${Date.now()}_${image.originalFilename.replace(/\s/g, "")}`;
        const projectDirectory = path.resolve(process.cwd(), "public/assets/Upload");
        const newImagePath = path.join(projectDirectory, newImageName);

        // Ensure the destination directory exists
        await fs.promises.mkdir(projectDirectory, { recursive: true });

        fs.promises.copyFile(image.filepath, newImagePath)
          .then(async () => {
            const sql = "UPDATE tecnology SET tecno_name = ?, tecno_image = ? WHERE id = ?";
            const params = [tecno_name, newImageName, id];
            await db.query(sql, params);

            // Delete old image file if it exists
            const oldImage = oldImageRows[0].tecno_image;
            if (oldImage) {
              const oldImagePath = path.join(projectDirectory, oldImage);
              if (fs.existsSync(oldImagePath)) {
                try {
                  await fs.promises.unlink(oldImagePath);
                  console.log(`Deleted old file: ${oldImagePath}`);
                } catch (error) {
                  console.error(`Error deleting old image: ${error.message}`);
                }
              } else {
                console.log(`File does not exist: ${oldImagePath}`);
              }
            }

            res.status(200).json({ success: true, message: "Service updated successfully" });
          })
          .catch(moveErr => {
            console.error("File move failed", moveErr);
            res.status(500).json({ success: false, message: "File move failed." });
          });
      });
    } catch (error) {
      console.error("Error updating data", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }


  // Handler to delete data by ID
  else if (req.method === "DELETE") {
    const id = req.query.id;
    try {
      const [tecno_image] = await db.query("SELECT tecno_image FROM tecnology WHERE id = ?", [id]);
      if (tecno_image.length !== 0) {
        const image = tecno_image[0].tecno_image;
        if (image) {
          const imagePath = path.join(
            process.cwd(),
            "public/assets/Upload",
            image
          );

          // Check if the file exists before unlinking
          if (fs.existsSync(imagePath)) {
            try {
              await unlink(imagePath);
              console.log(`Deleted file: ${imagePath}`);
            } catch (error) {
              console.error(`Error deleting thumbnail: ${error.message}`);
            }
          }
        }
      }

      const [result] = await db.query("DELETE FROM tecnology WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Technology not found" });
      }
      return res.status(200).json({ success: true, message: "Technology deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}   