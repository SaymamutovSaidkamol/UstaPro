import { Injectable } from '@nestjs/common';
import *as nodemailer from 'nodemailer';
import { text } from 'stream/consumers';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'saymamutovsaidkamol6@gmail.com',
        pass: 'elhx txxs pdhn ggvs',
      },
    });
  }

  async sendMail(to: any, subject: any, text: any) {
    let message = this.transporter.sendMail({
      to,
      subject,
      text,
    });

    return message;
  }
}
