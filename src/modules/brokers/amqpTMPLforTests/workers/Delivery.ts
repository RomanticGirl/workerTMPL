import { MainMessage } from '../interfaces';
import { Worker } from './Worker';

export class Delivery extends Worker<MainMessage> {
  constructor() {
    super({
      active: 'validator',
      exchange: 'interates',
      holdKey: 'validatorHold',
      maxRetry: process.env.MAX_RETRY ? parseInt(process.env.MAX_RETRY) : 5,
    });
  }
  protected async handler(message: MainMessage) {
    try {
      console.log('Отправка сообщения на валидатор');
      this.ack();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        await this.hold(error.message);
        throw new Error(error.message); // TODO: throw 
      }
    }
  }
}