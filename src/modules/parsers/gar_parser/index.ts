import fs from 'fs/promises';
import dotenv from 'dotenv';
import parseXMLToDatabase from "./service/database/ParseXMLToDatabase";
import createTable from './service/database/CreateTable';
import extractFilesFromZip from "./utils/unzipper/Unzip";

export default async function parseGarZIP() {

    dotenv.config();
    const directoryPath = process.env.GAR_OUTPUTPATH;
    const zipFilePath = process.env.ZIP_PATH!;
    const targetFolderName = process.env.TARGET_FOLDER!;
    const outputDir = process.env.OUTPUT_DIR!;
    const expNameWithDate = new RegExp(process.env.XML_NAME_WITH_DATE!);
    
    await extractFilesFromZip(zipFilePath, targetFolderName, outputDir);
    try {
        const xmlFiles = await fs.readdir(directoryPath!, { recursive: true, withFileTypes: true });
        const xmlFilePromises = xmlFiles
            .filter(xmlFile => xmlFile.isFile() && xmlFile.name.endsWith('.XML'))
            .map(async xmlFile => {
                const xmlNameWithDate: string = xmlFile.name.replace(expNameWithDate, '');
                await createTable(xmlNameWithDate);
                await parseXMLToDatabase(xmlFile, xmlNameWithDate);
            });
        await Promise.all(xmlFilePromises);
        console.log("+++++ All xml files parsed in database +++++");
    } catch (error) {
        throw error;
    }
};
