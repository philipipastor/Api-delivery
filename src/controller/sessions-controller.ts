import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma"
import { authConfig } from "@/configs/auth"
import { sign } from "jsonwebtoken"
import { compare } from "bcrypt"
import { AppError } from "@/utils/appError"

class SessionsController {
    async create(request: Request, response: Response) {

        const bodySchema = z.object({
            email: z.string().email(),
            password: z.string().min(4)
        })

        const { email, password } = bodySchema.parse(request.body)

        const user = await prisma.user.findFirst({ where: { email } })

        if (!user) {
            throw new AppError("Email ou senha incorretos", 401)
        }

        const isPasswordCorrect = await compare(password, user.password)

        if (!isPasswordCorrect) {
            throw new AppError("Email ou senha incorretos", 401)
        }

        const { secret, expiresIn } = authConfig.jwt

        const token = sign({ role: user.role ?? "customer" }, secret, { subject: user.id, expiresIn })

        const { password: hashedPassword, ...userWithoutPassword } = user

        return response.json({ user: userWithoutPassword, token })
    }
}

export { SessionsController }