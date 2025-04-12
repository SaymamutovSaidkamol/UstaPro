import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EskizService {
  private url = 'https://notify.eskiz.uz/api';
  private token;
  private secret = 'Xcay7JELGGPagWDeV5nNOeE5JPPYx8ouXHkvjwxl';
  private email = 'kalanovaferuza1981@gmail.com';

  constructor() {
    this.auth();
  }

  async auth() {
    try {
      let { data: response } = await axios.post(`${this.url}/auth/login`, {
        email: this.email,
        password: this.secret,
      });

      this.token = response?.data?.token;
    //   console.log(this.token);
    } catch (error) {
      console.log(error);
    }
  }

  async sendSMS(message: any, phone: string) {
    try {
      let { data: response } = await axios.post(
        `${this.url}/message/sms/send`,
        {
          mobile_phone: phone,
          message: "Bu Eskiz dan test",
        //   message: message,
          from: '4546',
        },
        {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        }
      );

    //   console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
}
