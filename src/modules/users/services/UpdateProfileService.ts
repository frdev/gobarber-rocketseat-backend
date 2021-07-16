import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('User not found');

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id)
      throw new AppError('E-mail already in use.');

    const updatedUser = { ...user, name, email };

    if (password) {
      if (!old_password)
        throw new AppError('Old password is required to change password.');

      const validOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!validOldPassword) throw new AppError('Invalid Credentials');

      updatedUser.password = await this.hashProvider.generateHash(password);
    }

    await this.usersRepository.save(updatedUser as User);

    return this.usersRepository.findById(user_id);
  }
}

export default UpdateProfileService;
