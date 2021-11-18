import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { NotFoundError } from '@jwmodules/common';
import { errorHandler } from '@jwmodules/common';
import { currentUserRouter } from './routes/current-user';
import { signinRoouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

const app = express();
app.set('trust proxy', true); // trust ingress nginx proxy
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUserRouter);
app.use(signinRoouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
