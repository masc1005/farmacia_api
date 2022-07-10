import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import router from "./routes";

const server = express();

dotenv.config();

server.use(cors());
server.use(express.json());
// server.use(express.urlencoded({ extended: true }));
server.use(router);

server.listen(process.env.PORT, () => {
  console.log("Server is running on port 3000");
});
