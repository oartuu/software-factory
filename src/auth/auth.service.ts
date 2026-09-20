import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {

    async register(dto: RegisterDto) {
        return{message: 'rodou'}
    }
}

