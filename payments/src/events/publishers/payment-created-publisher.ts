import { PaymentCreatedEvent, Publisher, Subjects } from '@jwmodules/common';

class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
