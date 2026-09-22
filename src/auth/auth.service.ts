import { ConflictException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { DRIZZLE } from '../drizzle/drizzle.module.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../drizzle/schema.js';
import * as bcrypt from 'bcrypt';
import { eq, or } from 'drizzle-orm';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
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
}
