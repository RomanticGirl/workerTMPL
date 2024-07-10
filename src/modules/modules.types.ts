import { MainMessage, Message } from "./brokers/amqp/amqp.interfaces";
import { ParserModules, WorkerModules, DbModules, RecievedMessage } from "./modules.interfaces";

export type Modules = {
    dbs: DbModules;
    brokers: WorkerModules;
    parsers: ParserModules;
}

export type Module = {
    modules: Modules;
    messages: RecievedMessage[];
}