import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { IConfig } from 'src/common/types/config.type';
import { DatabaseService } from '../../database/database.service';
import { HashService } from '../../hash/hash.service';
import { MailerService } from '../../mailer/mailer.service';
import { RoleService } from '../role/role.service';
import { UserCreateRequestDto } from './dto/user-create.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly hashService: HashService,
    private readonly dbService: DatabaseService,
    private readonly roleService: RoleService,
    private readonly configService: ConfigService<IConfig>,
    private readonly mailerService: MailerService,
  ) {}

  async createUserAsync(userCreateDto: UserCreateRequestDto) {
    const hashedPassword = await this.hashService.createHash(
      userCreateDto.password,
    );

    const userRole = await this.roleService.getRoleAsync('user');

    if (!userRole) throw new BadRequestException('USER_CREATION_FAILED');

    try {
      await this.dbService.user.create({
        data: {
          name: userCreateDto.name,
          password: hashedPassword,
          email: userCreateDto.email,
          roleId: userRole.id,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new ConflictException(
            'USER_CREATION_FAILED: EMAIL ALREADY EXISTS',
          );
        }
      }

      throw error;
    }
  }

  async verifyCredentialsAsync(email: string, password: string) {
    const user = await this.dbService.user.findUnique({
      where: {
        email,
      },
      include: {
        role: true,
      },
    });

    if (!user) return null;

    const isPasswordCorrect = this.hashService.verifyHash(
      password,
      user.password,
    );

    if (!isPasswordCorrect) return null;

    return user;
  }

  async getUserAsync(id: number) {
    const user = await this.dbService.user.findUnique({
      where: {
        id,
      },
      include: {
        role: true,
      },
    });

    return user;
  }

  async getUsersAsync() {
    const users = await this.dbService.user.findMany({
      include: {
        role: true,
      },
    });

    return users;
  }

  async sendVerificationMailAsync(id: number) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpireAt = new Date(
      Date.now() + this.configService.get('OTP_EXPIRE') * 1000,
    );

    try {
      const user = await this.dbService.user.update({
        where: {
          id,
        },
        data: {
          otp,
          otpExpireAt,
        },
      });

      await this.mailerService.sendVerificationMailAsync(
        user.name,
        user.email,
        user.otp,
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2001') {
          throw new NotFoundException('VERIFICATION FAILED: USER NOT FOUND');
        }
      }
      throw error;
    }
  }

  async verifyUserAsync(id: number, otp: number) {
    const user = await this.dbService.user.findUnique({
      where: {
        id,
      },
      select: {
        otp: true,
        otpExpireAt: true,
      },
    });

    if (!user)
      throw new NotFoundException('USER_VERIFICATION_FAILED: USER NOT FOUND');

    if (otp !== user.otp)
      throw new ForbiddenException(
        'USER_VERIFICATION_FAILED: OTP DID NOT MATCH',
      );

    const currentDate = new Date();

    if (currentDate > user.otpExpireAt)
      throw new ForbiddenException('USER_VERIFICATION_FAILED: OTP EXPIRED');

    await this.dbService.user.update({
      where: {
        id,
      },
      data: {
        verifiedAt: currentDate,
        otpExpireAt: currentDate,
      },
    });
  }
}
