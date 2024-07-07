import { pipelineConfig } from "./config";
import { Pipeline } from "./connection/Pipeline";
import { ParserWorker } from "./worker/ParserWorker";

export async function MainRabbitWorker(): Promise<void> {
    try {
        console.log("Starting Rabbit Worker");

        const pipeline = new Pipeline(pipelineConfig);
        console.log(pipelineConfig)
        const parserWorker = new ParserWorker();
        await pipeline.create();

        await Promise.all([parserWorker.testFuncCheckWorker(), parserWorker.subscribe()]);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};