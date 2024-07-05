import db from "@/pages/api/db.config/db";

import path from "path";
import fs from "fs";
import { IncomingForm } from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};


export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await db.query('SELECT * from tecnology');
      return res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  else if (req.method === 'POST') {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Formidable error:', err);
        return res.status(400).json({ error: 'Failed to parse form data' });
      }
      const { tecno_name } = fields;
      const imageFile = files.tecno_image ? files.tecno_image[0] : null;

      if (!imageFile) {
        return res.status(400).json({ error: 'No image file uploaded' });
      }
      const oldPath = imageFile.filepath;
      const newFileName = Date.now() + '-' + imageFile.originalFilename;
      const uploadDirectory = path.resolve(process.cwd(), 'public/assets/Upload');
      const newPath = path.join(uploadDirectory, newFileName);

      console.log(newPath);

      fs.copyFile(oldPath, newPath, async (moveErr) => {
        if (moveErr) {
          console.error('File move error:', moveErr);
          return res.status(500).json({ message: 'File upload failed.' });
        }

        try {
          const q = 'INSERT INTO tecnology (`tecno_name`, `tecno_image`) VALUES (?, ?)';
          const [row] = await db.query(q, [tecno_name, newFileName]);
          return res.status(200).json({
            success: true,
            message: 'Technology added successfully',
            row,
          });
        } catch (dbErr) {
          console.error('Database error:', dbErr);
          return res.status(500).json({ success: false, error: 'Failed to add technology' });
        }
      });
    });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
