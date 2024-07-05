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
      const [rows] = await db.query("SELECT * FROM portfolio WHERE id = ?", [
        id,
      ]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "Portfolio not found" });
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  } 
  // else if (req.method === "DELETE") {
  //   try {
  //     const [portfolio] = await db.query(
  //       "SELECT thumbnail FROM portfolio WHERE id = ?",
  //       [id]
  //     );

  //     if (portfolio.length !== 0) {
  //       const thumbnail = portfolio[0].thumbnail;
  //       if (thumbnail) {
  //         const imagePath = path.join(
  //           process.cwd(),
  //           "public/assets/Upload",
  //           thumbnail
  //         );

  //         // Check if the file exists before unlinking
  //         if (fs.existsSync(imagePath)) {
  //           try {
  //             await unlink(imagePath);
  //             console.log(`Deleted file: ${imagePath}`);
  //           } catch (error) {
  //             console.error(`Error deleting thumbnail: ${error.message}`);
  //           }
  //         }
  //       }
  //     }

  //     const q = "DELETE FROM portfolio WHERE id = ?";
  //     const [rows] = await db.query(q, [id]);

  //     console.log(rows);
  //     res.status(200).json({ message: "success" });
  //   } catch (error) {
  //     console.error("Error deleting portfolio:", error);
  //     res.status(500).json({ message: "Cannot delete portfolio" });
  //   }
  // } 

  else if (req.method === "DELETE") {
    try {
      // Fetch the portfolio_img entry to get portfolio_id
      const [portfolioImg] = await db.query(
        "SELECT portfolio_id FROM portfolio_img WHERE id = ?",
        [id]
      );

      if (portfolioImg.length === 0) {
        return res.status(404).json({ error: "Portfolio image not found" });
      }

      const portfolioId = portfolioImg[0].portfolio_id;

      // Delete related entries in the junction table
      const deleteImgQuery = "DELETE FROM portfolio_img WHERE portfolio_id = ?";
      await db.query(deleteImgQuery, [portfolioId]);

      // Fetch the portfolio entry to get the thumbnail
      const [portfolio] = await db.query(
        "SELECT thumbnail FROM portfolio WHERE id = ?",
        [portfolioId]
      );

      if (portfolio.length !== 0) {
        const thumbnail = portfolio[0].thumbnail;
        if (thumbnail) {
          const imagePath = path.join(
            process.cwd(),
            "public/assets/Upload",
            thumbnail
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

      // Delete the portfolio entry
      const deletePortfolioQuery = "DELETE FROM portfolio WHERE id = ?";
      const [rows] = await db.query(deletePortfolioQuery, [portfolioId]);

      console.log(rows);

      res.status(200).json({ message: "Portfolio and related data deleted successfully" });
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      res.status(500).json({ message: "Cannot delete portfolio" });
    }
  } 
  
  else if (req.method === "PUT") {
    try {
        const form = new IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const { title, description, service_id } = fields;

            const oldPath = files.thumbnail ? files.thumbnail[0].filepath : null;
            const thumbnail = files.thumbnail ? `${Date.now()}_${files.thumbnail[0].originalFilename}` : null;

            const [productRows] = await db.query(
                "SELECT thumbnail FROM portfolio WHERE id = ?",
                [id]
            );

            if (productRows.length === 0) {
                return res.status(404).json({ message: "Product not found" });
            }

            // Handle case where no thumbnail is uploaded
            if (!thumbnail) {
                const sql = "UPDATE portfolio SET title = ?, description = ?, service_id = ? WHERE id = ?";
                const params = [title, description, service_id, id];
                await db.query(sql, params);
                return res.status(200).json({ message: "Product updated successfully without changing the thumbnail" });
            }

            const newFileName = thumbnail.replace(/\s/g, "");
            const projectDirectory = path.resolve(process.cwd(), "public/assets/Upload");
            const newPath = path.join(projectDirectory, newFileName);

            // Ensure the destination directory exists
            await fs.promises.mkdir(projectDirectory, { recursive: true });

            fs.copyFile(oldPath, newPath, async (moveErr) => {
                if (moveErr) {
                    return res.status(500).json({ message: "File move failed." });
                }

                const sql = "UPDATE portfolio SET title = ?, description = ?, thumbnail = ?, service_id = ? WHERE id = ?";
                const params = [title, description, newFileName, service_id, id];
                await db.query(sql, params);

                // Delete old thumbnail file if it exists
                if (productRows.length !== 0) {
                    const oldThumbnail = productRows[0].thumbnail;
                    if (oldThumbnail) {
                        const oldImagePath = path.join(projectDirectory, oldThumbnail);
                        if (fs.existsSync(oldImagePath)) {
                            await fs.promises.unlink(oldImagePath);
                        } else {
                            console.log(`File does not exist: ${oldImagePath}`);
                        }
                    }
                }

                res.status(200).json({ message: "Product updated successfully" });
            });
        });
    } catch (err) {
        res.status(500).json({ message: "Product update failed", error: err.message });
    }
} else {
    res.status(405).json({ message: "Method not allowed" });
}

}
