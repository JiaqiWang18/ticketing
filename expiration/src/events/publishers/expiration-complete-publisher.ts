import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@jwmodules/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
