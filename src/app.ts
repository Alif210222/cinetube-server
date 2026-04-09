import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import notFound from './middlewares/notFound';
import globalErrorHandler from './middlewares/globalErrorHandler';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

app.use(cookieParser())

// application routes
// app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Apollo Gears World!');
});


//not found route
app.use(notFound);

// global error handler
 app.use(globalErrorHandler);




export default app;
