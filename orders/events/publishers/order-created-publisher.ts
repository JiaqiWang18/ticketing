import { OrderCreatedEvent, Publisher, Subjects } from '@jwmodules/common';

class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
