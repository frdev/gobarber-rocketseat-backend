// import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailabilityService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the day availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      user_id: 'user1',
      provider_id: 'user2',
      date: new Date(2021, 2, 1, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      user_id: 'user1',
      provider_id: 'user2',
      date: new Date(2021, 2, 1, 15, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 2, 1, 11).getTime();
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id: 'user2',
      day: 1,
      month: 3,
      year: 2021,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        {
          hour: 10,
          available: false,
        },
        {
          hour: 11,
          available: false,
        },
        {
          hour: 12,
          available: true,
        },
        {
          hour: 13,
          available: true,
        },
        {
          hour: 14,
          available: false,
        },
        {
          hour: 15,
          available: false,
        },
      ]),
    );
  });
});
