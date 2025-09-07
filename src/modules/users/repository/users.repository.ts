import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/repositories/base.repository";
import { User } from "src/entities/users/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersRepository extends BaseRepository<User> {
    constructor (
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {
        super(userRepo)
    }

    async findByEmail(email: User['email']): Promise<User|null> {
        return await this.userRepo.findOne({where: {email}});
    }
}