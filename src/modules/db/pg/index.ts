import { PoolConfig } from "pg";
import { PoolPipeline } from "./connection/Pipeline";
import { IPoolPipeline } from "./pg.interface";
import dotenv from "dotenv"

export function PostgreSQLConnection(): IPoolPipeline {
    dotenv.config();
    const poolConfig: PoolConfig = {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    };
    try {
        console.log("Connecting to PostgreSQL");
        // return new Pool(poolConfig);
        return new PoolPipeline(poolConfig);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};