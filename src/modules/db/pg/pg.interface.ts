import { Pool } from "pg";

export interface IPoolPipeline extends Pool {
    db_insert(table_name: string, data: any, schema?: string): Promise<void>;
    db_bulk_insert(table_name: string, fields: string[], data: Buffer[]): Promise<void>;
}
