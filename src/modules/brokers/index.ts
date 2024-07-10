import { WorkerModules } from "../modules.interfaces";
import { MainRabbitWorker, pipeline } from "./amqp";


const brokers = {} as WorkerModules;

(async () => {
    const worker = MainRabbitWorker();
    brokers.rabbitParserWorker = worker;
    await pipeline();
    await Promise.all([worker.testFuncCheckWorker(), worker.subscribe()])
})();

export default brokers;