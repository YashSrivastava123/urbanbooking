import { 
  Controller, 
  Post, 
  Body, 
  ValidationPipe,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../dto/auth.dto';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid registration data' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    try {
      const result = await this.authService.register(registerDto);
      return {
        message: 'User registered successfully',
        user: result.user,
        token: result.token
      };
    } catch (error) {
      console.error('Registration error:', error);
      if (error.message === 'Email already exists') {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      // Try to extract the most informative error message
      const message =
        error?.response?.message ||
        error?.message ||
        JSON.stringify(error) ||
        'Registration failed';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);
      return {
        message: 'Login successful',
        user: result.user,
        token: result.token
      };
    } catch (error) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }
} 