function amqpConnection() {
    console.log("amqp connected")
}

export default amqpConnection;


import { Pipeline } from './connection/Pipeline';
import { pipelineConfig } from './config';
import { Delivery } from './workers/Delivery';
// import { GenerateRoutingKey } from './workers/GenerateRoutingKey';

export async function workerAMQP() {
    try {

        const pipeline = new Pipeline(pipelineConfig);
        // const delivery = new Delivery();
        await pipeline.create();
        // await Promise.all([delivery.subscribe()]);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};