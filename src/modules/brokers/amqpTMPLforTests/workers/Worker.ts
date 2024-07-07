import { RabbitConnect } from '../connection/RabbitConnect';
import { Message, MainMessage, FailMessage } from '../interfaces';
import { ConsumeMessage } from 'amqplib';

export interface WorkerParams {
    maxRetry?: number; // Максимальное количество повторов обработки
    active: string; // Имя активной очереди
    exchange: string; // Имя обменника из которого пришло сообщение
    holdKey?: string; // Ключ маршрутизации для отложенной очереди
}

export abstract class Worker<M extends MainMessage> extends RabbitConnect {
    private _maxRetry: number;
    private _active: string;
    private _holdKey: string | undefined;
    protected exchange: string;
    private _currentMessage!: Message<M>;
    private _currentConsumeMessage!: ConsumeMessage;
    constructor({ active, holdKey, exchange, maxRetry }: WorkerParams) {
        super();
        this._maxRetry = maxRetry || 0;
        this._active = active;
        this._holdKey = holdKey;
        this.exchange = exchange;
    }
    public async subscribe() {
        await this.connect();
        this.chanel.consume(this._active, async () => {
            console.log("consuming");
            this.checkMessage.bind(this)
        });
    }

    // Метод проверки для сообщений у которых превышен лимит повторов
    private async checkMessage(message: ConsumeMessage) {
        this._currentConsumeMessage = message;
        const mainMessage: Message<M> = JSON.parse(message.content.toString());
        if (mainMessage.retry >= this._maxRetry) {
            await this.sendToErrorStorage('Превышен лимит попыток');
        }
        this._currentMessage = mainMessage;
        // Если количество попыток не превышено вызываем метод с бизнес логикой
        await this.handler(mainMessage.msg || mainMessage);
    }
    // Метод отправки сообщения в хранилище ошибок
    protected async sendToErrorStorage(error: string) {
        const message: FailMessage = {
            msg: this._currentMessage.msg,
            errors: [...this._currentMessage.errors, error],
            retry: this._currentMessage.retry + 1,
            exchange: this.exchange,
            routingKey: this._active
        };
        console.log('Отправка в хранилище ошибок', message);
        this.ack();
    }
    // Метод отправки сообщения в отложенную очередь
    protected async hold(error: string) {
        if (!this._holdKey) {
            return;
        }
        const mainMessage = {
            msg: this._currentMessage.msg,
            errors: [...this._currentMessage.errors, error],
            retry: this._currentMessage.retry + 1,
        };
        const msgData = Buffer.from(JSON.stringify(mainMessage));
        return this.chanel.publish(this.exchange, this._holdKey, msgData);
    }
    // Метод подтверждения удачной обработки сообщения
    protected async ack() {
        return this.chanel.ack(this._currentConsumeMessage);
    }
    protected abstract handler(message: M): void;
}