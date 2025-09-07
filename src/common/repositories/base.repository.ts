import {Repository, FindOptionsWhere, FindManyOptions} from "typeorm";
import {BaseEntity, UuidEntity} from "../../core/database/base.entity";

// abstract는 상속된 곳에서만 사용될 수 있는 부분인가?
// T extends BaseEntity는 삭속 받을 수있는 타입은 baseEntity만 가능 하다는 뜻인가?
export abstract class BaseRepository<T extends UuidEntity> { 
    protected repository: Repository<T>;

    constructor(repository: Repository<T>) {
        this.repository = repository;
    }

    async create(entityData: Partial<T>): Promise<T[]> {
        const entity = this.repository.create(entityData as any);
        return await this.repository.save(entity);
    }

    async findAll(options?: FindManyOptions<T>): Promise<T[]> {
        return await this.repository.find({
            order: {createdAt:'DESC'},
            ...options
        } as FindManyOptions<T>);
    }

    async findOne(id: T['id']): Promise<T | null> {
        return await this.repository.findOne({where:{id}} as any);
    }

    // 조건만 넣는 건가? 어디에 필요한 부분이지?
    async findBy(where: FindOptionsWhere<T>): Promise<T[]> {
        return await this.repository.find({where} as any);
    }

    async update(id: T['id'], updateData: Partial<T>): Promise<T | null> {
        await this.repository.update(id, updateData as any);
        return await this.findOne(id);
    }

    async remove(id: T['id']): Promise<void> {
        await this.repository.delete(id);
    }

    // 주로 어디에 사용하기에 count를 base에 두는 건가?
    async count(where?: FindOptionsWhere<T>):Promise<number> {
        return await this.repository.count({where} as any);
    }

    // 주로 어디에 사용하기에 exists를 base에 두는 건가?
    async exists(where: FindOptionsWhere<T>): Promise<boolean> {
        const count = await this.repository.count({where} as any);
        return count > 0;
    }

}