import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'

export default async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, response) => {
    const createNewUserBodySchema = z.object({
      name: z.string(),
    })

    const { name } = createNewUserBodySchema.parse(request.body)

    await knex('users').insert({
      id: randomUUID(),
      name,
    })

    response.status(201).send()
  })
}
