import fastify from "fastify"
import cors from "@fastify/cors"
import { createTrip } from "./routes/createTrip"
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"
import { confirmTrip } from "./routes/confirmTrip"
import { confirmParticipants } from "./routes/confirmParticipants"
import { createActivity } from "./routes/createActivity"
import { createLink } from "./routes/createLink"
import { getActivities } from "./routes/getActivities"
import { getLinks } from "./routes/getLinks"
import { getParticipants } from "./routes/getParticipants"
import { createInvite } from "./routes/createInvite"
import { updateTrip } from "./routes/updateTrip"
import { getTripDetails } from "./routes/getTripDetails"
import { getParticipant } from "./routes/getParticipant"
import { errorHandler } from "./errorHandler"
import { env } from "./env"

const app = fastify()

app.register(cors, {
  origin: env.FRONTEND_BASE_URL,
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler(errorHandler)

app.register(createTrip)
app.register(createActivity)
app.register(createLink)
app.register(createInvite)
app.register(confirmTrip)
app.register(confirmParticipants)
app.register(getActivities)
app.register(getTripDetails)
app.register(getLinks)
app.register(getParticipants)
app.register(getParticipant)
app.register(updateTrip)

app.listen({ port: env.PORT }).then(() => {
  console.log("Server running")
})