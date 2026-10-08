import { afterAll, describe, expect, it } from "@jest/globals";
import { prisma } from "@/database/prisma"
import request from "supertest"
import { app } from "@/app";

describe("SessionsController", () => {
    let user_id: string

    afterAll(async () => {
        await prisma.user.delete({
            where:{id: user_id}
        })
    })

    it("teste oara autenticar e obter um token de acesso", async () => {
        const userResponse = await request(app).post("/users").send({
            name: "Auth Test User",
            email: "authtest@example.com",
            password: "password123"
        })

        user_id = userResponse.body.id

        const sessionResponse = await request(app).post("/sessions").send({
            email: "authtest@example.com",
            password: "password123" 
        })

        expect(sessionResponse.status).toBe(200)
        expect(sessionResponse.body.token).toEqual(expect.any(String))
    })
})
