import tableCreationScripts from '../../constants/tableCreationScripts';

export default function generateTableCreationScript(tableName: string) {
    let script;
    const tableNameWithoutDate = tableName.replace(/_[0-9]+/g, '');
    try {
        script = `CREATE TABLE "${tableName}" ${tableCreationScripts[tableNameWithoutDate]}`
    } catch (err) {
        console.error(`No script found for table: ${tableName}`);
    }
    return script;
}