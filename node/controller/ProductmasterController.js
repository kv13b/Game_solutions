import { pool } from "../connection.js";
const Productinsert = async (req, res) => {
  // Validate mandatory fields
  if (!req.body || !req.body.Name) {
    return res.status(400).json({
      Valid: false,
      message: "Please enter the mandatory fields",
    });
  }

  // Extract fields from request body
  const { Name, Rate, CategoryId } = req.body;

  try {
    // Insert Product data into database
    const [result] = await pool.query(
      `INSERT INTO product_master (Name,Rate,CategoryId, UserId, Entry_Date, recordstatus) 
       VALUES (?,?,?, 1, NOW(), 1)`,
      [Name, Rate, CategoryId]
    );
    if (result.affectedRows > 0) {
      console.log("Product insertion successful");
      return res.json({
        Valid: true,
        message: "Product insertion successful",
      });
    } else {
      console.log("Product insertion failed");
      return res.status(400).json({
        Valid: false,
        message: "Product insertion failed",
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
const getProduct = async (req, res) => {
  try {
    // Fetch all Products from the database
    const [rows] = await pool.query(
      "SELECT * FROM Product_master WHERE recordstatus = 1"
    );

    if (rows.length > 0) {
      console.log("Products fetched successfully");
      return res.json({
        Valid: true,
        data: rows,
      });
    } else {
      console.log("No Products found");
      return res.status(404).json({
        Valid: false,
        message: "No Products found",
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

const ProductUpdate = async (req, res) => {
  // Validate mandatory fields
  if (
    !req.body.Item_Id ||
    !req.body.Name ||
    !req.body.Rate ||
    !req.body.CategoryId
  ) {
    return res.status(400).json({
      Valid: false,
      message: "Please enter the mandatory fields",
    });
  }

  // Extract fields from request body
  const { Item_Id, Name, Rate, CategoryId } = req.body;

  try {
    // Insert Product data into database
    const [result] = await pool.query(
      `UPDATE Product_master 
   SET Name = ? ,Rate = ? ,CategoryId = ? 
   WHERE Item_Id = ?`,
      [Name, Rate, CategoryId, Item_Id]
    );
    if (result.affectedRows > 0) {
      console.log("Product Updation successful");
      return res.json({
        Valid: true,
        message: "Product Updation successful",
      });
    } else {
      console.log("Product Updation failed");
      return res.status(400).json({
        Valid: false,
        message: "Product Updation failed",
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
export default { Productinsert, getProduct, ProductUpdate };
