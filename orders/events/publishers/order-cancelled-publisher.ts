import { OrderCancelledEvent, Publisher, Subjects } from '@jwmodules/common';

class OrderCreatedPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
