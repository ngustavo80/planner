import fastify from "fastify"
import { prisma } from "./lib/prisma"
const app = fastify()

app.listen({ port: 3333 }).then(() => {
  console.log("Server running")
})

app.get('/teste', () => {
  return "Hello world!"
})

app.get('/cadastrar', async () => {
  await prisma.trip.create({
    data: {
      destination: "Argentina",
      ends_at: new Date(),
      start_at: new Date(),
    }
  })

  return "Registro cadastrado com sucesso!"
})

app.get('/listar', async () => {
  const trips = await prisma.trip.findMany()

  return trips
})