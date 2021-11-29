import { Listener, OrderCancelledEvent, Subjects } from '@jwmodules/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // find the ticket the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // Throw error if no ticket
    if (!ticket) {
      throw Error('Ticket not found');
    }
    // Onset orderId to mark the order as cancelled
    ticket.set({ orderId: undefined });
    // Save the ticket
    await ticket.save();
    // Publish a ticket updated event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });
    // Ack the message
    msg.ack();
  }
}
