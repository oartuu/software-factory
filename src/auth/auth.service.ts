import { ConflictException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { DRIZZLE } from '../drizzle/drizzle.module.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../drizzle/schema.js';
import * as bcrypt from 'bcrypt';
import { eq, or } from 'drizzle-orm';
import { LoginDto } from './dto/login.dto.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
    private jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    if (
      dto.name === '' ||
      dto.email === '' ||
      dto.password === '' ||
      dto.passwordConfirmation === '' ||
      dto.phone === ''
    ) {
      throw new HttpException('All fields are required', HttpStatus.FORBIDDEN);
    }

    const existingUser = await this.db.select().from(schema.user).where(or(eq(schema.user.email, dto.email), eq(schema.user.phone, dto.phone))).execute();

    if (existingUser.length > 0) {
      const match = existingUser[0];

      if (match.email === dto.email) {
        throw new ConflictException('Email already in use.');
      }

      if (match.phone === dto.phone) {
        throw new ConflictException('Phone number already in use.');
      }
    }

    if (dto.password !== dto.passwordConfirmation) {
      throw new HttpException('Passwords do not match', HttpStatus.FORBIDDEN);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.db
      .insert(schema.user)
      .values({
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        phone: dto.phone,
      })
      .returning();

    return newUser[0];
  }

 async login(dto: LoginDto) {

  const validUser = await this.db.select().from(schema.user).where(eq(schema.user.email, dto.email)).execute();
  
  if (validUser.length === 0) {
    throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
  }

  const passwordMatch = await bcrypt.compare(dto.password, validUser[0].password);

  if (!passwordMatch) {
    throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
  }

  const payload = { sub: validUser[0].id, email: validUser[0].email, name: validUser[0].name };

  const token = await this.jwtService.signAsync(payload);
   return {
     access_token: token,
   };
 }
}
