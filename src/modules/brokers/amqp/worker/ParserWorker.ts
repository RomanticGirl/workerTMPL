import { MainMessage, Message } from '../amqp.interfaces';
import { Worker } from './Worker';

export class ParserWorker extends Worker<MainMessage> {
  constructor() {
    super({
      active: "PARSER_QUEUE" // process.env.PARSER_QUEUE || 'errWorker',
    });
  }
  protected async handler(message: Message<MainMessage>) {
    try {
      console.log('Получение сообщения с параметрами для парсеров');

      console.log(" [x] Received %s", JSON.stringify(message));

      global.app.messages.push({ ...message, executed: false });
      this.ack();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        await this.hold(error.message);
      }
    }
  }

  // передача названия файла для парсинга в очередь 
  public async funcCheckWorker(mesg: string) {
    await this.connect();
    const queue = "PARSER_QUEUE"// process.env.PARSER_QUEUE || 'errWorker';

    this.chanel.assertQueue(queue, {
      durable: true
    })
    this.chanel.sendToQueue(
      queue,
      Buffer.from(mesg)
    )
    console.log(" [x] Отправлено сообщение %s в очередь:%s", mesg, queue);
  }

  public async sendToValidator(mesg: string) {
    await this.connect();
    const queue = "VALIDATOR_QUEUE" // process.env.VALIDATOR_QUEUE || 'errValidator';

    this.chanel.assertQueue(queue, {
      durable: true
    })

    this.chanel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify({ table_name: mesg.toLowerCase() }))
    )
    console.log(" [x] Отправлено сообщение %s в очередь:%s", mesg, queue);
  }
}