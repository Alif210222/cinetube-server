import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import notFound from './middlewares/notFound';
import globalErrorHandler from './middlewares/globalErrorHandler';

import routes from './routes';
import { stripeWebhook } from './webhooks/stripe.webhook';

const app: Application = express();

app.use(cookieParser())
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));



app.post(
  "/webhooks/stripe",
  express.raw({
    type: "application/json",
  }), 

  stripeWebhook
);


// parsers
app.use(express.json());


// application routes
app.use('/', routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Cinetube World!');
});


//not found route
app.use(notFound);

// global error handler
//  app.use(globalErrorHandler);




export default app;
