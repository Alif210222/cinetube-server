import express from "express";
import * as SubController from "./sub.controller";
import { auth } from "../../middlewares/auth.middleware";

const subRoutes = express.Router();

subRoutes.get(
  "/me",
  auth("USER", "ADMIN"),
  SubController.getMySubscription
);

subRoutes.post(
  "/cancel",
  auth("USER", "ADMIN"),
  SubController.cancelSubscription
);

export default subRoutes;