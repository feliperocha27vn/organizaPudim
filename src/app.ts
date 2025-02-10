import fastify from 'fastify'
import usersRoutes from './routes/user'

export const app = fastify()

app.register(usersRoutes, {
  prefix: '/users',
})
