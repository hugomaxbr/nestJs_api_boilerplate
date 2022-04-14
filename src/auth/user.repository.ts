import { ConflictException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async isAleradyRegistred(userEmail: string): Promise<User> {
    const found = await this.findOne({ email: userEmail });

    if (found) {
      throw new ConflictException('Email ja registrado');
    }
    return;
  }
  async signUp(user: User): Promise<User> {
    return this.save(user);
  }
}
