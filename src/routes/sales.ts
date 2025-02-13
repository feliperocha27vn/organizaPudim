import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function salesRoutes(app: FastifyInstance) {
  // cria uma nova venda
  app.post('/', async (request, response) => {
    const createANewSaleBodySchema = z.object({
      quantity: z.number().int(),
      idRecipe: z.string().uuid(),
      idUser: z.string().uuid(),
      dateOfSale: z.string(),
      typeOfPayment: z.enum(['pix', 'money']),
      isPaidOrNot: z.boolean(),
      IsPeding: z.boolean(),
    })

    const {
      quantity,
      idRecipe,
      idUser,
      dateOfSale,
      typeOfPayment,
      isPaidOrNot,
      IsPeding,
    } = createANewSaleBodySchema.parse(request.body)

    const recipePrice = await knex('recipes')
      .where('id', idRecipe)
      .select('priceOfSale')
      .first()

    const totalOfSale = quantity * recipePrice.priceOfSale

    await knex('sales').insert({
      id: randomUUID(),
      quantity,
      idUser,
      idRecipe,
      dateOfSale,
      totalOfSale,
      typeOfPayment,
      isPaidOrNot,
      IsPeding,
    })

    response.status(201).send()
  })

  // traz todas as vendas do banco de dados
  app.get('/', async (request, response) => {
    const allSales = await knex('sales')

    response.send({ allSales })
  })

  // deleta uma venda
  app.delete('/:idSale', async (request, response) => {
    const paramsSchema = z.object({ idSale: z.string().uuid() })

    const { idSale } = paramsSchema.parse(request.params)

    await knex('sales').where({ id: idSale }).del()

    response.status(204).send()
  })

  // edita uma venda
  app.put('/:idSale', async (request, response) => {
    const paramsSchema = z.object({ idSale: z.string().uuid() })

    const { idSale } = paramsSchema.parse(request.params)

    const updateSaleBodySchema = z.object({
      quantity: z.number().int(),
      idRecipe: z.string().uuid(),
      idUser: z.string().uuid(),
      dateOfSale: z.string(),
      typeOfPayment: z.enum(['pix', 'money']),
      isPaidOrNot: z.boolean(),
      IsPeding: z.boolean(),
    })

    const {
      quantity,
      idRecipe,
      idUser,
      dateOfSale,
      typeOfPayment,
      isPaidOrNot,
      IsPeding,
    } = updateSaleBodySchema.parse(request.body)

    const recipePrice = await knex('recipes')
      .where('id', idRecipe)
      .select('priceOfSale')
      .first()

    const totalOfSale = quantity * recipePrice.priceOfSale

    await knex('sales').where({ id: idSale }).update({
      quantity,
      idRecipe,
      idUser,
      dateOfSale,
      typeOfPayment,
      isPaidOrNot,
      IsPeding,
      totalOfSale,
    })

    response.status(204).send()
  })

  // busca valor total de pedidos
  app.get('/totalOfSales', async (request, response) => {
    const paidSales = await knex('sales')
      .where('isPaidOrNot', true)
      .sum('totalOfSale as totalOfSales')

    response.send({ paidSales })
  })

  // busca vendas a pagar
  app.get('/salesPayable', async (request, response) => {
    const salesPayable = await knex('sales as s')
      .join('users as u', 's.idUser', 'u.id')
      .where('s.isPaidOrNot', false)
      .select('u.name')
      .sum('s.totalOfSale as total')
      .groupBy('u.id')

    response.send({ salesPayable })
  })
}
