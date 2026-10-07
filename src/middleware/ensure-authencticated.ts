import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/appError";
import { verify } from "jsonwebtoken";
import { authConfig } from "@/configs/auth";

interface TokenPlayload {
    role: string,
    sub: string
}

function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {

    try {
        const authHeader = request.headers.authorization

        if (!authHeader) {
            throw new AppError("JWT token não existe", 401)
        }

        const [, token] = authHeader.split(" ")

        const { role, sub: user_id } = verify(token, authConfig.jwt.secret) as TokenPlayload

        request.user = { id: user_id, role }

        return next()
    } catch (error) {
        throw new AppError("JWT token inválido", 401)
    }
}

export { ensureAuthenticated }