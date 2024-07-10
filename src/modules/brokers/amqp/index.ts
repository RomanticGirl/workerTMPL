import { pipelineConfig } from "./config";
import { Pipeline } from "./connection/Pipeline";
import { ParserWorker } from "./worker/ParserWorker";


export async function pipeline() {
    const pipeline = new Pipeline(pipelineConfig);
    console.log(pipelineConfig)
    await pipeline.create();
}


export function MainRabbitWorker() {
    try {
        console.log("Starting Rabbit Worker");
        return new ParserWorker();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};