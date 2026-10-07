import { Router } from 'express';

import { usersRouter } from './users-routes';
import { sessionsRouter } from './sessions-routes';
import { deliveriesRoutes } from './delivery-routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/deliveries", deliveriesRoutes);

export { routes };