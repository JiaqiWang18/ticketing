import { OrderCreatedEvent, Publisher, Subjects } from '@jwmodules/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
