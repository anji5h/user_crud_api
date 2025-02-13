import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { verificationTemplate } from 'src/common/templates/verification.template';
import { IConfig } from 'src/common/types/config.type';

@Injectable()
export class MailerService {
  private readonly transport: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  constructor(private readonly configService: ConfigService<IConfig>) {
    this.transport = createTransport({
      host: this.configService.get('MAILER_HOST'),
      port: this.configService.get('MAILER_PORT'),
      auth: {
        user: this.configService.get('MAILER_USER'),
        pass: this.configService.get('MAILER_PASS'),
      },
    });
  }

  async sendVerificationMailAsync(name: string, email: string, otp: number) {
    this.transport.sendMail({
      from: this.configService.get('MAILER_FROM'),
      to: email,
      subject: 'Email Verification',
      html: verificationTemplate(name, otp),
    });
  }
}
