import db from "@/pages/api/db.config/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { id } = req.query;
    try {
      // Fetch service details and associated technologies
      const [serviceRows] = await db.query(
        `SELECT sr.service_name, tg.tecno_name, tg.id as tecno_id FROM service AS sr 
        LEFT JOIN service_tecnology as st ON st.service_id = sr.id 
        LEFT JOIN tecnology as tg ON tg.id = st.tecnology_id
        WHERE sr.id = ?`, [id]
      );

      // Fetch all technologies
      const [allTechnologies] = await db.query(`SELECT id, tecno_name FROM tecnology`);

      res.status(200).json({ service: serviceRows, allTechnologies });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
   else if (req.method === "DELETE") {
    const { id } = req.query;
    try {
      // Delete from service_tecnology table
      const deleteServiceTecnologyQuery = "DELETE FROM service_tecnology WHERE service_id = ?";
      await db.query(deleteServiceTecnologyQuery, [id]);

      // Delete from service table
      const deleteServiceQuery = "DELETE FROM service WHERE id = ?";
      await db.query(deleteServiceQuery, [id]);
      res.status(200).json({ success: true, message: "Service deleted successfully" });
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  } 
    else if (req.method === "PUT") {
    const { id } = req.query;
    const { service_name,tecno_id } = req.body;
  
    try {
      // Delete existing technology associations
      await db.query("DELETE FROM service_tecnology WHERE service_id = ?", [id]);
      // Insert new technology associations
      const insertPromises = tecno_id.map(async (techId) => {
        await db.query("INSERT INTO service_tecnology (service_id, tecnology_id) VALUES (?, ?)", [id, techId]);
      });
      await Promise.all(insertPromises);
  
  
      // Update the service name if provided
      if (service_name) {
        await db.query("UPDATE service SET service_name = ? WHERE id = ?", [service_name, id]);
      }
  
      res.status(200).json({ success: true, message: "Service updated successfully" });
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
  
}
