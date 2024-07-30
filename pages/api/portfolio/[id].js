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
  const { id } = req.query; 

  if (req.method === "GET") {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id AS portfolio_id,
        p.title,
        p.description,
        p.thumbnail,
        GROUP_CONCAT(DISTINCT s.service_name) AS service_name,
        GROUP_CONCAT(DISTINCT t.tecno_name) AS tecnology_names,
        GROUP_CONCAT(DISTINCT t.tecno_image) AS tecnology_images
      FROM 
        portfolio p
      JOIN 
        portfolio_img pi ON p.id = pi.portfolio_id
      JOIN 
        service s ON pi.service_id = s.id
      JOIN 
        tecnology t ON pi.tecnology_id = t.id
      WHERE 
        p.id = ?
      GROUP BY 
        p.id, p.title, p.description, p.thumbnail;
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  }
  
   if (req.method === "DELETE") {
    try {
      await db.query("DELETE FROM portfolio_img WHERE portfolio_id = ?", [id]);

      const [portfolio] = await db.query(
        "SELECT thumbnail FROM portfolio WHERE id = ?",
        [id]
      );

      if (portfolio.length > 0) {
        const thumbnail = portfolio[0].thumbnail;
        if (thumbnail) {
          const imagePath = path.join(
            process.cwd(),
            "public/assets/Upload",
            thumbnail
          );

          // Check if the file exists before unlinking
          if (fs.existsSync(imagePath)) {
            await unlink(imagePath);
            console.log(`Deleted file: ${imagePath}`);
          }
        }
      }

      // Delete the portfolio entry
      await db.query("DELETE FROM portfolio WHERE id = ?", [id]);

      res.status(200).json({ message: "Portfolio and related data deleted successfully" });
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      res.status(500).json({ message: "Cannot delete portfolio" });
    }
  } 
  
   if (req.method === "PUT") {
    try {
      const form = new IncomingForm();
      form.parse(req, async (err, fields, files) => {
      
        if (err) {
          return res.status(400).json({ message: "Invalid data submitted", error: err.message });
        }
        const { title, description, service_id, tecnology_id } = fields;
        let thumbnail = null;
        if (files.thumbnail) {
          const oldPath = files.thumbnail.filepath;
          const newFileName = `${Date.now()}_${files.thumbnail.originalFilename.replace(/\s/g, "")}`;
          const projectDirectory = path.resolve(process.cwd(), "public/assets/Upload");
          const newPath = path.join(projectDirectory, newFileName);

          await fs.promises.mkdir(projectDirectory, { recursive: true });
          await fs.promises.copyFile(oldPath, newPath);
          thumbnail = newFileName;

          const [oldThumbnailResult] = await db.query("SELECT thumbnail FROM portfolio WHERE id = ?", [id]);
          const oldThumbnail = oldThumbnailResult.length > 0 ? oldThumbnailResult[0].thumbnail : null;

          if (oldThumbnail) {
            const oldImagePath = path.join(projectDirectory, oldThumbnail);
            if (fs.existsSync(oldImagePath)) {
              await fs.promises.unlink(oldImagePath);
            } else {
              console.log(`File does not exist: ${oldImagePath}`);
            }
          }

          await fs.promises.unlink(oldPath);
        }

        // Update portfolio entry in the database
        const updateParams = [title, description];
        let updateQuery = "UPDATE portfolio SET title = ?, description = ?";
        if (service_id) {
          updateQuery += ", service_id = ?";
          updateParams.push(service_id);
        }
        if (thumbnail) {
          updateQuery += ", thumbnail = ?";
          updateParams.push(thumbnail);
        }
        updateQuery += " WHERE id = ?";
        updateParams.push(id);

        await db.query(updateQuery, updateParams);

        // Update portfolio_img table for technology entries
        // if (tecnology_id) {
        //   const tecnology_ids = JSON.parse(tecnology_id);

        //   await db.query("DELETE FROM portfolio_img WHERE portfolio_id = ?", [id]);

        //   const insertPromises = tecnology_ids.map((tecnoId) => {
        //     return db.query("INSERT INTO portfolio_img (portfolio_id, tecnology_id) VALUES (?, ?)", [id, tecnoId]);
        //   });

        //   await Promise.all(insertPromises);
        // }

        res.status(200).json({ message: "Portfolio updated successfully" });
      });
    } catch (error) {
      console.error("Error updating portfolio:", error);
      res.status(500).json({ message: "Portfolio update failed", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
