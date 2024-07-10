import { Pool, PoolConfig } from "pg";

export class PoolPipeline<P extends PoolConfig> extends Pool {

    public async db_insert(table_name: string, data: any, schema = "public") {
        await this.connect();
        let values = [];
        for (var i = 1; i <= Object.keys(data).length; i++) {
            values.push(`$` + i);
        }

        await this.query({
            text: `INSERT INTO ${schema}.${table_name} (${Object.keys(data).join(",")})
            VALUES (${values.join(" , ")})`,
            values: Object.values(data),
        });
    }

    public async db_bulk_insert(table_name: string, fields: string[], data: Buffer[]) {
        await this.connect();
        const fullFields = fields.join(" , ");
        let values = '';

        for (const element of data) {
            values += "('" + element.join("','") + "'),";
        }

        values = values.slice(0, -1) + ";";
        values = values.replaceAll("''", "null");
        await this.query(`INSERT INTO ${table_name} (${fullFields}) VALUES ${values}`);
    }
}
