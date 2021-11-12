import express from 'express';

const router = express.Router();

router.post('/api/users/sigin', (req, res) => {
  res.send('Hello There');
});

export { router as signinRoouter };
