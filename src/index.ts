
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { createPayments } from './routes/payments/createPayments';
import { 
  getBarChart, 
  getRevenueByProductName, 
  getRevenueByProductType, 
  getRevenueByTier
} from './routes/payments/revenue';
import { 
  revenueByPaymentType, 
  revenueByTiers, 
  revenuePieByProduct, 
  revenuePieByType 
} from './routes/payments/piecharts';
import { 
  communitiesTierPie, 
  getStudentsPieProductType, 
  studentsPieByProduct 
} from './routes/students/pieCharts';
import { studentsBarGraphByProduct, studentsBarGraphByProductType } from './routes/students/barGraph';
import { getLeadsOverview } from './routes/leads/overview';
import { leadsGrowth } from './routes/leads/growth';
import { leadSources } from './routes/leads/sources';
import { leadStatus } from './routes/leads/status';
import { ingestVideoEvents } from './routes/video/ingest';
import { getViews } from './routes/video/views';
import { clerkMiddleware } from "@clerk/hono";
import { middleware } from './middleware';


const app = new Hono()

app.use('/*', clerkMiddleware())
app.use('/*', middleware)
app.use('/*', cors());


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

app.get("/leads/overview",getLeadsOverview);
app.get("/leads/growth",leadsGrowth);
app.get("/leads/sources",leadSources);
app.get("/leads/status",leadStatus);

app.post("/video/events",ingestVideoEvents);
app.get("/video/views/:videoId",getViews);

export default app


//local
//bunx wrangler d1 execute --local analytics --file=migrations\0000_big_mantis.sql
//bunx wrangler d1 execute --local analytics --file=migrations\0001_sour_mandrill.sql
//bunx wrangler d1 execute --local analytics --file=migrations\0002_funny_blockbuster.sql
//bunx wrangler d1 execute --local analytics --file=migrations\0003_next_stone_men.sql
//bunx wrangler d1 execute --local analytics --file=migrations\0004_curvy_silver_surfer.sql