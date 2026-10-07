import { Router } from "express";
import { DeliveriesController } from "@/controller/deliveries-controller";
import { ensureAuthenticated } from "@/middleware/ensure-authencticated";
import { verifyUserAuthorization } from "@/middleware/verify-user-authorization";

const deliveriesRoutes = Router();
const deliveriesController = new DeliveriesController();

deliveriesRoutes.use(ensureAuthenticated, verifyUserAuthorization(["sale"]));
deliveriesRoutes.post("/", deliveriesController.create);
deliveriesRoutes.get("/", deliveriesController.index);
deliveriesRoutes.patch("/:id/status", deliveriesController.update);

export { deliveriesRoutes };