import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class AppService {
  users: User[] = [];
  findAll() {
    return this.users;
  }

  findOne(id: string) {
    return this.users.find((ea) => ea.id === id);
  }

  create(createUserDto: Omit<User, 'id'>) {
    const newUser = new User({
      ...createUserDto,
    });
    this.users.push(newUser);
    return this.users;
  }
}
