import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeRedisCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '../../notifications/repositories/fakes/FakeNotificationsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointmentService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const date = new Date();

      return date.setHours(date.getHours() - 1);
    });

    const appointment = await createAppointment.execute({
      date: new Date(),
      user_id: '1231222',
      provider_id: '12312313',
    });

    expect(appointment).toHaveProperty('id');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2021, 10, 2, 14);

    await createAppointment.execute({
      date: new Date(appointmentDate),
      user_id: '1231222',
      provider_id: '12312313',
    });

    await expect(
      createAppointment.execute({
        date: new Date(appointmentDate),
        user_id: '1231222',
        provider_id: '12312313',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointments on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const date = new Date();

      return date.setHours(date.getHours() + 1);
    });

    await expect(
      createAppointment.execute({
        date: new Date(),
        user_id: '1231222',
        provider_id: '12312313',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const date = new Date();

      return date.setHours(date.getHours() - 1);
    });

    await expect(
      createAppointment.execute({
        date: new Date(),
        user_id: '1231222',
        provider_id: '1231222',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment outside range available hours', async () => {
    await expect(
      createAppointment.execute({
        date: new Date(2021, 10, 2, 7),
        user_id: 'user-id',
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2021, 10, 2, 18),
        user_id: 'user-id',
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
