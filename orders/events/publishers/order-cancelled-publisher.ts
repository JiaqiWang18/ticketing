import { OrderCancelledEvent, Publisher, Subjects } from '@jwmodules/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
