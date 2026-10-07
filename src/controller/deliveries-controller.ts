import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma"

class DeliveriesController {
    async create(request: Request, response: Response) {

        const bodySchema = z.object({
            user_id: z.string().uuid(),
            description: z.string().trim().min(1, "A descrição é obrigatória"),
        })

        const { user_id, description } = bodySchema.parse(request.body)

        await prisma.delivery.create({ data: { userId: user_id, description } })

        return response.status(201).json({ message: "Delivery created" })
    }

    async index(request: Request, response: Response, ) {

        const deliveries = await prisma.delivery.findMany({
            include: {
                user: {select: { name: true, email: true }}
            }
        })

        return response.json(deliveries)
    }

    async update(request: Request, response: Response) {

        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const bodySchema = z.object({
            status: z.enum(["processing", "shipped", "delivered"])
        })

        const { id } = paramsSchema.parse(request.params)
        const { status } = bodySchema.parse(request.body)
        
        const updateStatus = await prisma.delivery.update({ data: { status }, where: { id } })

        await prisma.deliveryLog.create({ data: { deliveryId: id, description: `Status alterado para ${status}` } })

        return response.json(updateStatus)
    }
}

export { DeliveriesController }