import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod"
import { prisma } from "../lib/prisma";

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/trips',{
    schema: {
      body: z.object({
        destination: z.string().min(4),
        start_at: z.coerce.date(),
        ends_at: z.coerce.date()
      })
    }
  }, async (request) => {
    const { destination, ends_at, start_at } = request.body

    const trip = await prisma.trip.create({
      data: {
        start_at,
        destination,
        ends_at
      }
    })

    return { tripId: trip.id }
  })
}