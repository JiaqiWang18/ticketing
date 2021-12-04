import { PaymentCreatedEvent, Publisher, Subjects } from '@jwmodules/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
