import { clerkMiddleware } from '@clerk/hono';
import { Hono } from 'hono'
import { cors } from 'hono/cors';

const app = new Hono()

app.use('/*', cors());
app.use('*', clerkMiddleware());


app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app


//local
//bunx wrangler d1 execute --local analytics --file=migrations\0000_big_mantis.sql