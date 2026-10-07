import { Router } from 'express';

import { usersRouter } from './users-routes';
import { sessionsRouter } from './sessions-routes';
import { deliveriesRoutes } from './delivery-routes';
import { deliveryLogsRouter } from './delivery-logs-routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/deliveries", deliveriesRoutes);
routes.use("/delivery-logs", deliveryLogsRouter)

export { routes };