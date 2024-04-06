import { create } from "domain";
import fastify from "fastify";
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';


const app = fastify()

const prisma = new PrismaClient({
    log: ['query'],
})
//Métodos HTTP: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS, ...
//Corpo da requisição
//Parametros de busca
//Parametros de rota
//Cabeçalhos

app.post('/events', async (request, reply) => {
    const createEventSchema = z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttenddes: z.number().int().positive().nullable(),
    })

    const data = createEventSchema.parse(request.body)

    const event = await prisma.event.create({
        data: {
            title: data.title,
            details: data.details,
            maximumAttendees: data.maximumAttenddes,
            slug: new Date().toISOString(),
        }
    })

    return reply.status(201).send({ eventId: event.id })
})

app.listen({ port: 3333 }).then(() => {
    console.log('HTTP server running!')
})