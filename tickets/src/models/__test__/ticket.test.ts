import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  // Create an instance of a ticket
  const ticket = Ticket.build({ title: 'title', price: 5, userId: '124' });
  // Save the ticket to the database
  await ticket.save();
  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  // Make 2 separate changes to the tickets fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 10 });
  // Save the first fetched
  await firstInstance!.save();
  // Save the second fetched ticket and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }
  throw new Error('Should not reach this');
});

it('increments the version number', async () => {
  const ticket = Ticket.build({ title: 'title', price: 5, userId: '124' });
  // Save the ticket to the database
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
