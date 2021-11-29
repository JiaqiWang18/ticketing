import { Listener, OrderCreatedEvent, Subjects } from '@jwmodules/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // find the ticket the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // Throw error if no ticket
    if (!ticket) {
      throw Error('Ticket not found');
    }
    // Mark ticket as reserved by setting its orderId property
    ticket.set({ orderId: data.id });
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
