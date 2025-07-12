import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { RegisterDto, LoginDto } from '../dto/auth.dto';
export declare class AuthService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            role: UserRole;
            created_at: Date;
            updated_at: Date;
            slots: import("../entities/slot.entity").Slot[];
            bookings: import("../entities/booking.entity").Booking[];
        };
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            role: UserRole;
            created_at: Date;
            updated_at: Date;
            slots: import("../entities/slot.entity").Slot[];
            bookings: import("../entities/booking.entity").Booking[];
        };
        token: string;
    }>;
    private generateToken;
}
