import { Pool } from "pg";
import { IPoolPipeline } from "./db/pg/pg.interface";
import { ParserWorker } from "./brokers/amqp/worker/ParserWorker";
import { MainMessage, Message } from "./brokers/amqp/amqp.interfaces";

export interface WorkerModules extends ParserWorker {
    rabbitParserWorker: ParserWorker;
}

export interface ParserModules {
    parser_csv?: (key?: string) => Promise<void>;
    parseXlsxDirectory?: (key?: string) => Promise<void>;
    parseGUXmlDirectory?: (key?: string) => Promise<void>;
    parseGarZIP?: (key?: string) => Promise<void>;
    parseContentLoaderDirectory?: (key?: string) => Promise<void>;
}

export interface DbModules extends Pool {
    _pgpool: IPoolPipeline;
}

export interface RecievedMessage extends Message<MainMessage> {
    executed: boolean;
}