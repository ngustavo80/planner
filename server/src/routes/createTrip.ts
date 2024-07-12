import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import dayjs from "dayjs"
import { getMailClient } from "../lib/mail"
import nodemailer from "nodemailer"

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/trips',{
    schema: {
      body: z.object({
        destination: z.string().min(4),
        start_at: z.coerce.date(),
        ends_at: z.coerce.date(),
        owner_name: z.string(),
        owner_email: z.string().email()
      })
    }
  }, async (request) => {
    const { destination, ends_at, start_at, owner_email, owner_name } = request.body

    if(dayjs(start_at).isBefore(new Date())) {
      throw new Error('Invalid start date. Must be after the actual date.')
    }

    if(dayjs(ends_at).isBefore(start_at)) {
      throw new Error('Invalid date. Must be after the start date.')
    }

    const trip = await prisma.trip.create({
      data: {
        start_at,
        destination,
        ends_at,
      }
    })

    const mail = await getMailClient()

    const message = await mail.sendMail({
      from: {
        name: "Equipe plann.er",
        address: "gustavo@planner.com",
      },
      to: {
        name: owner_name,
        address: owner_email,
      },
      subject: "Testando envio de emails",
      html: `<h1>Apenas testando envio de um email :)</h1>`
    })

    console.log(nodemailer.getTestMessageUrl(message))

    return { tripId: trip.id }
  })
}