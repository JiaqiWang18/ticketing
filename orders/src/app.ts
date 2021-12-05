import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { NotFoundError, currentUser, errorHandler } from '@jwmodules/common';
import { indexOrderRouter } from './routes';
import { deleteOrderRouter } from './routes/delete';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';

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
app.use(indexOrderRouter);
app.use(deleteOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
