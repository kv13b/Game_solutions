import express from "express";
import { checkconnection } from "./connection.js";
import cors from "cors";
const app = express();
import routes from "./routes/routes.js";
import masterroute from "./routes/masterRoutes.js";
app.use(express.json()); //middleware

app.use(cors());
app.use("/auth", routes);
app.use("/client", masterroute);
const PORT = 3003;
app.listen(PORT, async () => {
  console.log(`server started at ${PORT}`);
  try {
    await checkconnection();
  } catch (error) {
    console.log(error);
  }
});
