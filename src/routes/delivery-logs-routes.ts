import { Router } from "express";

import { DeliveryLogsController } from "@/controller/delivery-logs-controller";

import { ensureAuthenticated } from "@/middleware/ensure-authencticated";
import { verifyUserAuthorization } from "@/middleware/verify-user-authorization";

const deliveryLogsRouter = Router()
const deliveryLogsController = new DeliveryLogsController()

deliveryLogsRouter.post("/", ensureAuthenticated, verifyUserAuthorization(["sale"]), deliveryLogsController.create)
deliveryLogsRouter.get("/:delivery_id/show", ensureAuthenticated, verifyUserAuthorization(["sale", "customer"]), deliveryLogsController.show)

export { deliveryLogsRouter }