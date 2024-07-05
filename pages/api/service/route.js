import db from "@/pages/api/db.config/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [rows] = await db.query(
        `SELECT sr.*, st.*, tg.* FROM service AS sr 
        INNER JOIN service_tecnology as st ON st.service_id = sr.id 
        INNER JOIN tecnology as tg ON tg.id = st.tecnology_id`
      );
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } 
  
  else if (req.method === "POST") {
    const { service_name, tecno_id } = req.body;

    if (!service_name || !tecno_id || tecno_id.length === 0) {
      res
        .status(400)
        .json({ error: "Service name and technology ID are required" });
      return;
    }

    try {
      // Insert data into the 'service' table
      const [serviceResult] = await db.query(
        "INSERT INTO service (service_name) VALUES (?)",
        [service_name]
      );

      // Get the inserted service ID
      const service_id = serviceResult.insertId;

      // Insert data into the 'service_tecnology' table
      const serviceTechnologyPromises = tecno_id.map((id) => {
        return db.query(
          "INSERT INTO service_tecnology (service_id, tecnology_id) VALUES (?, ?)",
          [service_id, id]
        );
      });

      await Promise.all(serviceTechnologyPromises);

      res.status(201).json({ message: "Service added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
