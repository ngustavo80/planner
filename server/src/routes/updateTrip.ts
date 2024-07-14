import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { getMailClient } from "../lib/mail"
import nodemailer from "nodemailer"
import { dayjs } from "../lib/dayjs"
import { ClientError } from "../errors/clientError"

export async function updateTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put('/trips/:tripId',{
    schema: {
      body: z.object({
        destination: z.string().min(4),
        starts_at: z.coerce.date(),
        ends_at: z.coerce.date(),
      }),
      params: z.object({
        tripId: z.string().uuid(),
      })
    }
  }, async (request) => {
    const { tripId } = request.params
    const { destination, ends_at, starts_at } = request.body

    const trip = await prisma.trip.findUnique({
      where: { id: tripId }
    })

    if(!trip) {
      throw new ClientError('Trip not found')
    }

    if(dayjs(starts_at).isBefore(new Date())) {
      throw new ClientError('Invalid start date. Must be after the actual date.')
    }

    if(dayjs(ends_at).isBefore(starts_at)) {
      throw new ClientError('Invalid date. Must be after the start date.')
    }

    await prisma.trip.update({
      where: { id: tripId },
      data: {
        destination,
        starts_at,
        ends_at
      }
    })

    // const formattedStartDate = dayjs(starts_at).format('LL')
    // const formattedEndDate = dayjs(ends_at).format('LL')

    // const confirmationLink = `http://localhost:3333/trips/${trip.id}/confirmation`

    // const mail = await getMailClient()

    // const message = await mail.sendMail({
    //   from: {
    //     name: "Equipe plann.er",
    //     address: "gustavo@planner.com",
    //   },
    //   to: {
    //     name: owner_name,
    //     address: owner_email,
    //   },
    //   subject: `Confirme sua viagem para ${destination} em ${formattedStartDate}`,
    //   html: `
    //     <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
    //       <p>Você solicitou a criação de uma viagem para <strong>${destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong></p>
    //       <p></p>
    //       <p>Para confirmar sua viagem, clique no link abaixo:</p>
    //       <p></p>
    //       <p><a href=${confirmationLink}>Confirmar viagem</a></p>
    //       <p></p>
    //       <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
    //     </div>
    //   `.trim()
    // })

    // console.log(nodemailer.getTestMessageUrl(message))

    return { tripId: trip.id }
  })
}