import { TicketUpdatedEvent } from '@jwmodules/common';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
  // create an instance of listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // create an save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'title',
    price: 1,
  });
  await ticket.save();
  // create fake event data
  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    price: 10,
    title: 'new title',
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(), // mock ack function
  };
  return { listener, ticket, data, msg };
};

it('updates a ticket', async () => {
  const { listener, ticket, data, msg } = await setup();
  // call the onmessage function with the data object and message object
  await listener.onMessage(data, msg);
  // Write assertions to make sure a ticket was created
  const fecthedTicket = await Ticket.findById(ticket.id);
  expect(fecthedTicket).toBeDefined();
  expect(fecthedTicket!.title).toEqual(data.title);
  expect(fecthedTicket!.version).toEqual(data.version);
});

it('acks a message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if event has a future version', async () => {
  const { listener, data, msg } = await setup();
  // change data version
  data.version = 999;
  // call the onmessage function with the data object and message object
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}
  // Write assertions to make sure message was not acked
  expect(msg.ack).not.toHaveBeenCalled();
});
