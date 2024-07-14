import fastify from "fastify"
import cors from "@fastify/cors"
import { createTrip } from "./routes/createTrip"
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"
import { confirmTrip } from "./routes/confirmTrip"
import { confirmParticipants } from "./routes/confirmParticipants"

const app = fastify()

app.register(cors, {
  origin: 'http://localhost:3000',
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip)
app.register(confirmTrip)
app.register(confirmParticipants)

app.listen({ port: 3333 }).then(() => {
  console.log("Server running")
})

app.get('/', () => {
  return "hello world"
})