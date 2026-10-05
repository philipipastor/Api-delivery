import { Request, Response, NextFunction } from 'express';

class UsersController {
    async create(request: Request, response: Response, next: NextFunction) {
        response.json({ message: "ok" })
    }
}

export { UsersController };