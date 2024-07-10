import fs from 'fs/promises';

async function getGarXMLNameList(directoryPath: string) {
    let counter = 0;
    let garXmlNamesList: string[] = [];
    try {
        const files = await fs.readdir(directoryPath, { recursive: true, withFileTypes: true });
        files.forEach(file => {
            if (file.isFile() && file.name.endsWith('.XML')) {
                counter = counter + 1;
                const modifiedName = file.name.replace(/(_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.XML$/, '');
                garXmlNamesList.push(modifiedName);
            }
        });
        console.log(`----- ${counter} XMLs read`);
    } catch (err) {
        console.error("Error reading directory:", err);
    }
    return garXmlNamesList
}

export default getGarXMLNameList;