import { connect, Connection, Channel } from 'amqplib';
import dotenv from 'dotenv';
export class RabbitConnect {
    private _uri: string;
    private _connection!: Connection;
    private _chanel!: Channel;
    constructor() {
        this._uri = 'amqp://admin:gkhadmin@192.168.43.192:5672' // 'amqp://localhost'; //
    }
    protected async connect() {
        dotenv.config();
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

