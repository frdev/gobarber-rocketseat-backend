// import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailabilityService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      user_id: '1231222',
      provider_id: 'user',
      date: new Date(2021, 2, 15, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      user_id: '1231222',
      provider_id: 'user',
      date: new Date(2021, 2, 15, 9, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      user_id: '1231222',
      provider_id: 'user',
      date: new Date(2021, 2, 15, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      user_id: '1231222',
      provider_id: 'user',
      date: new Date(2021, 2, 15, 11, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      user_id: '1231222',
      provider_id: 'user',
      date: new Date(2021, 2, 15, 12, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      user_id: '1231222',
      provider_id: 'user',
      date: new Date(2021, 2, 15, 13, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      user_id: '1231222',
      provider_id: 'user',
      date: new Date(2021, 2, 15, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      user_id: '1231222',
      provider_id: 'user',
      date: new Date(2021, 2, 15, 15, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      user_id: '1231222',
      provider_id: 'user',
      date: new Date(2021, 2, 15, 16, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      user_id: '1231222',
      provider_id: 'user',
      date: new Date(2021, 2, 15, 17, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      user_id: '1231222',
      provider_id: 'user',
      date: new Date(2021, 2, 16, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'user',
      year: 2021,
      month: 3,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        {
          day: 14,
          available: true,
        },
        {
          day: 15,
          available: false,
        },
        {
          day: 16,
          available: true,
        },
        {
          day: 17,
          available: true,
        },
      ]),
    );
  });
});
