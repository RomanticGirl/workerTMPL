import { Worker } from './Worker';
import {
    MainMessage,
    Message,
} from '../interfaces';

export class GenerateRoutingKey extends Worker<MainMessage> {
    constructor() {
        super({
            active: 'generateRoutingKey',
            exchange: 'postprocessing',
        });
    }
    protected async handler(msg: MainMessage) {
        try {
            const routingKey: string[] = [];

            const message: Message<MainMessage> = {
                retry: 0,
                errors: [],
                msg,
            };
            await this.chanel.publish(
                this.exchange,
                routingKey.join('.'),
                Buffer.from(JSON.stringify(message)),
            );
            await this.ack();
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                await this.sendToErrorStorage(error.message);
            }
        }
    }
}