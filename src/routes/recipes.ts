import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function recipesRoutes(app: FastifyInstance) {
  app.post('/', async (request, response) => {
    const createNewRecipeBodySchema = z.object({
      nameRecipe: z.string(),
      priceOfSale: z.number(),
    })

    const { nameRecipe, priceOfSale } = createNewRecipeBodySchema.parse(
      request.body,
    )

    await knex('recipes').insert({
      id: randomUUID(),
      nameRecipe,
      priceOfSale,
    })

    response.status(201).send()
  })
}
