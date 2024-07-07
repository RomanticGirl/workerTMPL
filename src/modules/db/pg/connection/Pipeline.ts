import { Pool, PoolConfig } from "pg";

export class PoolPipeline<P extends PoolConfig> extends Pool {
    private _poolConfig: P;
    private _pool: Pool;
    constructor(poolConfig: P) {
        super();
        this._poolConfig = poolConfig;
        this._pool = new Pool(this._poolConfig);
    }
    
    public async db_insert(table_name: string, data: any, schema = "public") {
        let values = [];
        for (var i = 1; i <= Object.keys(data).length; i++) {
            values.push(`$` + i);
        }

        await this._pool.query({
            text: `INSERT INTO ${schema}.${table_name} (${Object.keys(data).join(",")})
            VALUES (${values.join(" , ")})`,
            values: Object.values(data),
        });
    }

    public async db_bulk_insert(table_name: string, fields: string[], data: string[][]) {
        const fullFields = fields.join(" , ");
        let values = '';

        for (const element of data) {
            values += "('" + element.join("','") + "'),";
        }

        values = values.slice(0, -1) + ";";
        values = values.replaceAll("''", "null");
        await this._pool.query(`INSERT INTO ${table_name} (${fullFields}) VALUES ${values}`);
    }
}
