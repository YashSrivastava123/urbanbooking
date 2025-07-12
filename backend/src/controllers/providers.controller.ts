import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('providers')
@Controller('api/providers')
export class ProvidersController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'List of all service providers' })
  async getProviders() {
    return await this.userRepository.find({ where: { role: UserRole.PROVIDER } });
  }
} 