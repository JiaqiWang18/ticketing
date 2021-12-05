import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { NotFoundError, currentUser, errorHandler } from '@jwmodules/common';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true); // trust ingress nginx proxy
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(currentUser);
app.use(createChargeRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
