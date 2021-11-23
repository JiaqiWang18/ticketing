import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

it('returns 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signin())
    .send({
      title: 'fwef',
      price: 20,
    })
    .expect(404);
});

it('returns 401 if user is not authed', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'fwef',
      price: 20,
    })
    .expect(401);
});

it('returns 404 if user does not own ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title: '1234', price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', signin())
    .send({
      title: 'new title',
      price: 10,
    })
    .expect(401);
});

it('returns 400 if the user provides an invalid title or price', async () => {
  const cookie = signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: '1234', price: 20 })
    .expect(201);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'title',
      price: -10,
    })
    .expect(400);
});

it('updates the ticket provided', async () => {
  const cookie = signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: '1234', price: 20 })
    .expect(201);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(200);
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();
  expect(ticketResponse.body.title).toEqual('new title');
  expect(ticketResponse.body.price).toEqual(100);
});