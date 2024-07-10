import generateTableCreationScript from './GenerateTableCreationScript';

export default async function createTable(tableName: string) {
    const query = generateTableCreationScript(tableName);
    try {
        await global.app.modules.dbs._pgpool.query(query!);
        global.app.modules.brokers.sendToValidator(tableName)
        console.log(`Table ${tableName} is successfully created`);
    } catch (err) {
        console.error(`Error when table  ${tableName}  creating: ` + err);
    }
}

