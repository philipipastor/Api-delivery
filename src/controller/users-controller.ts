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

    async update(request: Request, response: Response) {
        const bodySchema = z.object({
            role: z.enum(["customer", "sale"])
        });

        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { role } = bodySchema.parse(request.body)
        const { id } = paramsSchema.parse(request.params)

        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new AppError("Usuário não encontrado", 404);
        }

        if (user.role !== "customer") {
            throw new AppError("O usuário já possui o perfil sale", 409);
        }

        await prisma.user.update({ data: { role }, where: { id } })

        response.json({ message: "ok" })
    }

    async remove(request: Request, response: Response) {
        const { id } = request.params

        await prisma.user.delete({ where: { id } })

        response.json({ message: "User deleted" })
    }
}

export { UsersController };