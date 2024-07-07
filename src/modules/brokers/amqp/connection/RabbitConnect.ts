import { connect, Connection, Channel } from 'amqplib';

export class RabbitConnect {
    private _uri: string;
    private _connection!: Connection;
    private _chanel!: Channel;
    constructor() {
        this._uri = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}` || 'amqp://localhost';
    }
    protected async connect() {
        this._connection = await connect(this._uri);
        this._chanel = await this._connection.createChannel();
    }
    protected async disconnect() {
        await this._chanel.close();
        return this._connection.close();
    }
    protected get chanel() {
        return this._chanel;
    }
}

