import fastify from 'fastify'
import usersRoutes from './routes/user'
import { recipesRoutes } from './routes/recipes'

export const app = fastify()

app.register(usersRoutes, {
  prefix: '/users',
})

app.register(recipesRoutes, {
  prefix: '/recipes',
})
