export interface IPoolPipeline {
    db_insert(table_name: string, data: any, schema?: string): Promise<void>;
    db_bulk_insert(table_name: string, fields: string[], data: string[][]): Promise<void>;
}
