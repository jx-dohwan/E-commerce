import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repository/users.repository';
import { User } from 'src/entities/users/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async create(partial: Partial<User> | CreateUserDto): Promise<User[]> {
    return await this.usersRepo.create(partial as any);
  }

  async findByEmail(email: User['email']):Promise<User | null> {
    return await this.usersRepo.findByEmail(email);
  }

  async findOne(id: User['id']): Promise<User | null> {
    return await this.usersRepo.findOne(id);
  }

  async update(id: User['id'], patch: Partial<User> | UpdateUserDto): Promise<User> {
    const updated = await this.usersRepo.update(id, patch as any);
    if (!updated) throw new NotFoundException('user not found');
    return updated
  }
  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
