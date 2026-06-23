import { clerkMiddleware } from '@clerk/hono';
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { createPayments } from './routes/payments/createPayments';
import { getBarChart, getRevenueByProductName, getRevenueByProductType } from './routes/payments/revenue';
import { revenuePieByProduct, revenuePieByType } from './routes/payments/piecharts';
import { studentsPieByProduct } from './routes/students/pieCharts';

const app = new Hono()

app.use('/*', cors());
// app.use('*', clerkMiddleware());


app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post("/payments", createPayments);
app.get("/payments/revenue/pie/type", revenuePieByType);
app.get("/payments/revenue/pie/product", revenuePieByProduct);
app.get("/payments/revenue/bar", getBarChart);
app.get("/payments/revenue/stackedbar/type", getRevenueByProductType);
app.get("/payments/revenue/stackedbar/product", getRevenueByProductName);

app.get("/students/pie/product", studentsPieByProduct);

export default app


//local
//bunx wrangler d1 execute --local analytics --file=migrations\0000_big_mantis.sql