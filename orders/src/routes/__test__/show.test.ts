import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({ title: 'title', price: 30 });
  await ticket.save();
  return ticket;
};

it('fetches order of a user', async () => {
  const ticket = await buildTicket();

  const user = signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(200);
  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch order of another user', async () => {
  const ticket = await buildTicket();

  const user = signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', signin())
    .expect(401);
});
