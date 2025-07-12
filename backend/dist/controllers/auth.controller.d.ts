import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("../entities/user.entity").UserRole;
            created_at: Date;
            updated_at: Date;
            slots: import("../entities/slot.entity").Slot[];
            bookings: import("../entities/booking.entity").Booking[];
        };
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("../entities/user.entity").UserRole;
            created_at: Date;
            updated_at: Date;
            slots: import("../entities/slot.entity").Slot[];
            bookings: import("../entities/booking.entity").Booking[];
        };
        token: string;
    }>;
}
