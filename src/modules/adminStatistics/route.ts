import express from "express";
import * as controller from "./controller";
import { auth } from "../../middlewares/auth.middleware";

const adminStateRoutes = express.Router();

adminStateRoutes.get(
  "/statistics",
  auth("ADMIN"),
  controller.getStatistics
);



export default adminStateRoutes;