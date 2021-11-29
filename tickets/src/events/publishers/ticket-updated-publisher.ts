import { Publisher, Subjects, TicketUpdatedEvent } from '@jwmodules/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
