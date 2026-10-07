import { prisma } from "@/database/prisma";
import { Request, Response } from 'express';
import { z } from 'zod';
import { hash } from "bcrypt"
import { AppError } from "@/utils/appError";

class UsersController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().trim().min(1, "O nome é obrigatório"),
            email: z.string().email(),
            password: z.string().min(4),
        });

        const { name, email, password } = bodySchema.parse(request.body)

        const hashedPassword = await hash(password, 8)

        const userSameEmail = await prisma.user.findFirst({ where: { email } })

        if (userSameEmail) {
            throw new AppError("Email já foi utilizado", 400)
        }

        const user = await prisma.user.create({ data: { name, email, password: hashedPassword } })

        const { password: _, ...userWithoutPassword } = user

        response.status(201).json(userWithoutPassword)
    }

    async index(request: Request, response: Response) {

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updateAt: true,
            },
        })

        return response.json(users)
    }

    async remove(request: Request, response: Response) {
        const { id } = request.params

        await prisma.user.delete({ where: { id } })

        response.json({ message: "User deleted" })
    }
}

export { UsersController };