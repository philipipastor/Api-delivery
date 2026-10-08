import { afterAll, describe, expect, it } from "@jest/globals";
import { prisma } from "@/database/prisma";
import request from "supertest";
import { app } from "@/app";

describe("DeliveriesController", () => {
    let user_id: string;
    let token: string;

    afterAll(async () => {
        if (user_id) {
            await prisma.delivery.deleteMany({
                where: { userId: user_id }
            });

            await prisma.user.delete({
                where: { id: user_id }
            });
        }
    });

    it("testa criação de entrega", async () => {
        const userResponse = await request(app)
            .post("/users")
            .send({
                name: "Test User",
                email: "deliverytest@example.com",
                password: "password123"
            });

        expect(userResponse.status).toBe(201);

        user_id = userResponse.body.id;

        await prisma.user.update({
            where: { id: user_id },
            data: { role: "sale" }
        });

        const sessionResponse = await request(app)
            .post("/sessions")
            .send({
                email: "deliverytest@example.com",
                password: "password123"
            });

        expect(sessionResponse.status).toBe(200);

        token = sessionResponse.body.token;

        const delivery = await request(app)
            .post("/deliveries")
            .set("Authorization", `Bearer ${token}`)
            .send({
                user_id,
                description: "Test delivery"
            });

        expect(delivery.status).toBe(201);
        expect(delivery.body.message).toBe("Delivery created");
    });
});