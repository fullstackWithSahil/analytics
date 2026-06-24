import { clerkMiddleware } from '@clerk/hono';
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { createPayments } from './routes/payments/createPayments';
import { getBarChart, getRevenueByProductName, getRevenueByProductType, getRevenueByTier } from './routes/payments/revenue';
import { revenueByPaymentType, revenueByTiers, revenuePieByProduct, revenuePieByType } from './routes/payments/piecharts';
import { communitiesTierPie, getStudentsPieProductType, studentsPieByProduct } from './routes/students/pieCharts';
import { studentsBarGraphByProduct, studentsBarGraphByProductType } from './routes/students/barGraph';

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
app.get("/revenue/pie/tier",revenueByTiers);
app.get("/revenue/pie/paymentType",revenueByPaymentType);
app.get("/payments/revenue/stackedbar/tier", getRevenueByTier);

app.get("/students/pie/product", studentsPieByProduct);
app.get("/students/pie/tier",communitiesTierPie);
app.get("/students/pie/type", getStudentsPieProductType);
app.get("/students/stackedbar/product", studentsBarGraphByProduct);
app.get("/students/stackedbar/type", studentsBarGraphByProductType);

export default app


//local
//bunx wrangler d1 execute --local analytics --file=migrations\0000_big_mantis.sql
//bunx wrangler d1 execute --local analytics --file=migrations\0001_sour_mandrill.sql