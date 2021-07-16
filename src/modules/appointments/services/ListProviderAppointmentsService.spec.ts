// import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeRedisCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the appointments on a specific day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      user_id: '1231222',
      provider_id: 'user',
      date: new Date(2021, 2, 15, 8, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      user_id: '1231222',
      provider_id: 'user',
      date: new Date(2021, 2, 15, 9, 0, 0),
    });

    const availability = await listProviderAppointments.execute({
      provider_id: 'user',
      day: 15,
      year: 2021,
      month: 3,
    });

    expect(availability).toEqual(
      expect.arrayContaining([appointment1, appointment2]),
    );
  });
});
