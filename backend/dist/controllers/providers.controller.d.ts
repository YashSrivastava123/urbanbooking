import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class ProvidersController {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    getProviders(): Promise<User[]>;
}
