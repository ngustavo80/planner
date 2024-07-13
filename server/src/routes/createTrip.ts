import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
import "dayjs/locale/pt-br"
import { getMailClient } from "../lib/mail"
import nodemailer from "nodemailer"

dayjs.locale('pt-br')
dayjs.extend(localizedFormat)

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/trips',{
    schema: {
      body: z.object({
        destination: z.string().min(4),
        starts_at: z.coerce.date(),
        ends_at: z.coerce.date(),
        owner_name: z.string(),
        owner_email: z.string().email(),
        emails_to_invite: z.array(z.string().email())
      })
    }
  }, async (request) => {
    const { destination, ends_at, starts_at, owner_email, owner_name, emails_to_invite } = request.body

    if(dayjs(starts_at).isBefore(new Date())) {
      throw new Error('Invalid start date. Must be after the actual date.')
    }

    if(dayjs(ends_at).isBefore(starts_at)) {
      throw new Error('Invalid date. Must be after the start date.')
    }

    const trip = await prisma.trip.create({
      data: {
        starts_at,
        destination,
        ends_at,
        participants: {
          createMany: {
            data: [
              {
                email: owner_email,
                name: owner_name,
                is_owner: true,
                is_confirmed: true
              },
              ...emails_to_invite.map(email => {
                return { email }
              }) 
            ]
          } 
        }
      }
    })

    const formattedStartDate = dayjs(starts_at).format('LL')
    const formattedEndDate = dayjs(ends_at).format('LL')

    const confirmationLink = `http://localhost:3333/trips/${trip.id}/confirmation`

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
      subject: `Confirme sua viagem para ${destination} em ${formattedStartDate}`,
      html: `
        <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
          <p>Você solicitou a criação de uma viagem para <strong>${destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong></p>
          <p></p>
          <p>Para confirmar sua viagem, clique no link abaixo:</p>
          <p></p>
          <p><a href=${confirmationLink}>Confirmar viagem</a></p>
          <p></p>
          <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
        </div>
      `.trim()
    })

    console.log(nodemailer.getTestMessageUrl(message))

    return { tripId: trip.id }
  })
}