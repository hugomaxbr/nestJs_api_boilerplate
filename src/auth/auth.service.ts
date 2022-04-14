import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './DTOs/createUserDTo';
import { AuthCredentialsDto } from './DTOs/authCredentialsDto';
import { User } from './user.entity';
import { genSaltSync, hashSync } from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  private async hashPassword(password: string, salt: string): Promise<string> {
    return hashSync(password, salt);
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { email, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ email });

    if (user && (await user.validatePassword(password))) {
      return user.email;
    } else {
      return null;
    }
  }

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    await this.userRepository.isAleradyRegistred(createUserDto.email);
    const { password } = createUserDto;
    const salt = genSaltSync(10);
    const user = Object.assign(new User(), {
      ...createUserDto,
      salt,
      password: await this.hashPassword(password, salt),
    });
    console.log(user);
    /* user.name = name;
    user.email = email;
    user.salt = await genSalt();
    user.password = await this.hashPassword(password, user.salt) */
    return this.userRepository.signUp(user);
  }
}
