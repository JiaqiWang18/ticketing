import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from '@jwmodules/common';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import mongoose from 'mongoose';
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: 'not used',
    version: 0,
  });
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1, // we have OCC
    ticket: {
      id: 'not used',
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('marks the status as cancelled', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);
  expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
