const express = require("express");
const { checkconnection } = require("./connection");
const cors = require("cors");
const routes = require("./routes/routes");
const masterroute = require("./routes/masterRoutes");
const productmasterroute = require("./routes/ProductmasterRoutes");

const app = express();

app.use(express.json()); //middleware
app.use(cors());
app.use("/auth", routes);
app.use("/client", masterroute);
app.use("/product", productmasterroute);

const PORT = 3003;

app.listen(PORT, async () => {
  console.log(`server started at ${PORT}`);
  try {
    await checkconnection();
  } catch (error) {
    console.log(error);
  }
});
