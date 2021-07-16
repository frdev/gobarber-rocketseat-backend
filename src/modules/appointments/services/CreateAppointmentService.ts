import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  user_id;
  provider_id: string;
  date: Date;
}

/**
 * Dependency Inversion (SOLID)
 */
@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    user_id,
    provider_id,
    date,
  }: IRequest): Promise<Appointment> {
    if (user_id === provider_id)
      throw new AppError(
        "You can't create an apointment where user_id as provider_id",
      );

    const parsedDate = startOfHour(date);

    if (getHours(parsedDate) < 8 || getHours(parsedDate) > 17)
      throw new AppError(
        "You can't only create appointments between 8am and 5pm",
      );

    if (isBefore(parsedDate, Date.now()))
      throw new AppError("You can't create an appointment on a past date.");

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      parsedDate,
      provider_id,
    );

    if (findAppointmentInSameDate)
      throw new AppError('This appointment is already booked', 400);

    const appointment = this.appointmentsRepository.create({
      user_id,
      provider_id,
      date: parsedDate,
    });

    const dateFormatted = format(parsedDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormatted}`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(parsedDate, 'yyyy-M-d')}`,
    );

    return appointment;
  }
}

export default CreateAppointmentService;
