import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/appError"

class DeliveryLogsController {
    async create(request: Request, response: Response) {

        const bodySchema = z.object({
            delivery_id: z.string().uuid(),
            description: z.string()
        })

        const { delivery_id, description } = bodySchema.parse(request.body)

        const delivery = await prisma.delivery.findUnique({
            where: { id: delivery_id }
        })

        if (!delivery) {
            throw new AppError("delivery não existe", 404)
        }

        if (delivery.status === "processing") {
            throw new AppError("Altere o status para enviado")
        }

        if(delivery.status === "delivered") {
            throw new AppError("Entrega já foi finalizada")
        }

        await prisma.deliveryLog.create({
            data: { deliveryId: delivery_id, description }
        })

        return response.status(201).json({ message: "ok" })
    }

    async show(request: Request, response: Response) {

        const paramsSchema = z.object({
            delivery_id: z.string().uuid()
        })

        const { delivery_id } = paramsSchema.parse(request.params)

        const delivery = await prisma.delivery.findUnique({
            where: { id: delivery_id },
            include: {
                user: { select: { id: true, name: true, email: true } },
                logs: { select: { id: true, description: true } }
            }
        })

        if (!delivery) {
            throw new AppError("Pedido não encontrado", 404)
        }

        if (request.user?.role === "customer" && request.user.id !== delivery.userId) {
            throw new AppError("Você não tem permissão para acessar este recurso", 401)
        }

        return response.status(200).json(delivery)
    }
}

export { DeliveryLogsController }