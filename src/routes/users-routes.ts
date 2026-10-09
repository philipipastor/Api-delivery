import { Router } from 'express';
import { UsersController } from '@/controller/users-controller';
import { ensureAuthenticated } from "@/middleware/ensure-authencticated";
import { verifyUserAuthorization } from "@/middleware/verify-user-authorization";

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post('/', usersController.create);
usersRouter.get("/", usersController.index);
usersRouter.patch("/:id", ensureAuthenticated, verifyUserAuthorization(["sale"]), usersController.update);
usersRouter.delete("/:id", usersController.remove);

export { usersRouter };