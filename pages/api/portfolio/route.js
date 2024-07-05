import db from "@/pages/api/db.config/db";
import path from "path";
import { IncomingForm } from "formidable";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {

  //  else if (req.method === "GET") {
  //   try {
  //     const [rows] = await db.query(
  //       "SELECT portfolio.*, service.service_name FROM portfolio INNER JOIN service ON portfolio.service_id = service.id"
  //     );
  //     res.status(200).json(rows);
  //   } catch (error) {
  //     console.error("Database error:", error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // } 

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
        GROUP BY 
          p.id, p.title, p.description, p.thumbnail;
      `);
      res.status(200).json(rows);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }



  if (req.method === "POST") {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Formidable error:", err);
        return res.status(400).json({ error: "Failed to parse form data" });
      }

      const { title, description, service_id, tecnology_id } = fields;
      console.log("Fields received:", fields);
      console.log("Raw tecnology_id:", tecnology_id);

      try {
        // Parse the tecnology_id field back into an array
        const tecnology_ids = JSON.parse(tecnology_id);
        console.log("Parsed tecnology_ids:", tecnology_ids);

        const oldPath = files.image[0].filepath;
        const newFileName = files.image[0].originalFilename;
        const projectDirectory = path.resolve(process.cwd(), "public/assets/Upload");
        const newPath = path.join(projectDirectory, newFileName);

        fs.copyFile(oldPath, newPath, async (moveErr) => {
          if (moveErr) {
            console.error("File move error:", moveErr);
            return res.status(500).json({ message: "File upload failed." });
          }

          try {
            const portfolioQuery = "INSERT INTO portfolio (`title`, `description`, `thumbnail`) VALUES (?, ?, ?)";
            const [portfolioResult] = await db.query(portfolioQuery, [title, description, newFileName]);
            const portfolio_id = portfolioResult.insertId;

            const portfolioImgQuery = "INSERT INTO portfolio_img (`service_id`, `tecnology_id`, `portfolio_id`) VALUES (?, ?, ?)";
            for (const id of tecnology_ids) {
              await db.query(portfolioImgQuery, [service_id, id, portfolio_id]);
            }

            return res.status(200).json({
              success: true,
              message: "Portfolio item added successfully",
            });
          } catch (dbErr) {
            console.error("Database error:", dbErr);
            return res.status(500).json({ success: false, error: "Failed to add portfolio item" });
          }
        });
      } catch (jsonErr) {
        console.error("JSON parse error:", jsonErr);
        return res.status(400).json({ error: "Invalid tecnology_id format" });
      }
    });
  }



  else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ error: "Method not allowed" });
  }
}
