import { pool } from "../connection.js";
const Clientinsert = async (req, res) => {
  // Validate mandatory fields
  if (!req.body || !req.body.Name || !req.body.ContactNo || !req.body.Email) {
    return res.status(400).json({
      Valid: false,
      message: "Please enter the mandatory fields",
    });
  }

  // Extract fields from request body
  const { Name, Address, ContactNo, Email } = req.body;

  try {
    // Insert client data into database
    const [result] = await pool.query(
      `INSERT INTO client_master (Name, Address, ContactNo, Email, UserId, Entry_Date, recordstatus) 
       VALUES (?, ?, ?, ?, 1, NOW(), 1)`,
      [Name, Address, ContactNo, Email]
    );
    if (result.affectedRows > 0) {
      console.log("Client insertion successful");
      return res.json({
        Valid: true,
        message: "Client insertion successful",
      });
    } else {
      console.log("Client insertion failed");
      return res.status(400).json({
        Valid: false,
        message: "Client insertion failed",
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      Valid: false,
      message: "Internal Server Error",
    });
  }
};
const getCustomer = async (req, res) => {
  try {
    // Fetch all clients from the database
    const [rows] = await pool.query(
      "SELECT * FROM client_master WHERE recordstatus = 1"
    );

    if (rows.length > 0) {
      console.log("Clients fetched successfully");
      return res.json({
        Valid: true,
        data: rows,
      });
    } else {
      console.log("No clients found");
      return res.status(404).json({
        Valid: false,
        message: "No clients found",
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      Valid: false,
      message: "Internal Server Error",
    });
  }
};

export default { Clientinsert, getCustomer };
