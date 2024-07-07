import { MainMessage } from '../amqp.interfaces';
import { Worker } from './Worker';

export class ParserWorker extends Worker<MainMessage> {
  private parser!: string;
  constructor() {
    super({
      active: process.env.VALIDATOR_QUEUE || 'errWorker',
    });
  }
  protected async handler(message: MainMessage) {
    try {
      console.log('Получение сообщения с параметрами для парсеров');

      console.log(" [x] Received %s", JSON.stringify(message));

      this.ack();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        await this.hold(error.message);
      }
    }
  }

  public async testFuncCheckWorker() {
    await this.connect();
    const queue = process.env.PARSER_QUEUE || 'errWorker';
    const mesg = '{ "parsers" : "parser_csv" }';

    this.chanel.assertQueue(queue, {
      durable: true
    })
    this.chanel.sendToQueue(
      queue,
      Buffer.from(mesg)
    )
    console.log(" [x] Отправлено сообщение %s на парсеры в очередь:%s", mesg, queue);
  }
}