import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import nodemailer from "nodemailer"
import { prisma } from "../lib/prisma"
import { dayjs } from "../lib/dayjs"
import { getMailClient } from "../lib/mail"

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/invite',{
    schema: {
      body: z.object({
        email: z.string().email(),
      }),
      params: z.object({
        tripId: z.string().uuid(),
      })
    }
  }, async (request, reply) => {
    const { tripId } = request.params
    const { email } = request.body

    const trip = await prisma.trip.findUnique({
      where: { id: tripId }
    })

    if(!trip) {
      throw new Error('Trip not found')
    }

    const participant = await prisma.participant.create({
      data: {
        email,
        trip_id: tripId
      }
    })

    const formattedStartDate = dayjs(trip.starts_at).format('LL')
    const formattedEndDate = dayjs(trip.ends_at).format('LL')

    const mail = await getMailClient()

    const confirmationLink = `http://localhost:3333/participant/${participant.id}/confirmation`

    const message = await mail.sendMail({
      from: {
        name: "Equipe plann.er",
        address: "gustavo@planner.com",
      },
      to: participant.email,
      subject: `Confirme sua presença na viagem para ${trip.destination} em ${formattedStartDate}`,
      html: `
        <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
          <p>Você foi convidado para participar de uma viagem para ${trip.destination} nas datas <strong>${formattedStartDate}</strong> a <strong>${formattedEndDate}</strong></p>
          <p></p>
          <p>Para confirmar sua presença na viagem clique no link abaixo:</p>
          <p></p>
          <p><a href=${confirmationLink}>Confirmar presença</a></p>
          <p></p>
          <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
        </div>
      `.trim()
    })

    console.log(nodemailer.getTestMessageUrl(message))

    return { participantId: participant.id }
  })
}