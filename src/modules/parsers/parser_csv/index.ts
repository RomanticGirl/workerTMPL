import fs from "fs";
import csv from "csv-parser";
import {
    createCSVTable,
    insertBulkData,
} from "./parser_cvs_queries";
import { transliterate } from "../utils/utils";
import { bulkInsertStep } from "../utils/parser_config";

const parseCsv = async function (file_path: string) {
    let file_name = file_path.split("/").pop()!
    console.log(`Обработка файла ${file_name}`);

    let table_name: string = transliterate(file_name.split(".")[0]);

    global.app.modules.brokers.rabbitParserWorker.sendToValidator(table_name);

    await createCSVTable(table_name);
    let counter = 0;
    let buffer: any[] = [];
    fs.createReadStream(file_path)
        .pipe(csv({ separator: '|' }))
        .on("data", async function (data) {
            buffer.push(Object.values(data));
            counter++;
            if (counter % bulkInsertStep == 0) {
                await insertBulkData(table_name, buffer)
                buffer = [];
                console.log(`Обработка файла ${file_name}. Сохранено ${counter} записей`);
            }
        })
        .on("end", async () => {
            if (buffer.length) {
                await insertBulkData(table_name, buffer)
            }
            console.log(`Обработка файла ${file_name} завершена. Сохранено ${counter} записей`);
        });
};
export default async function parser_csv(directory_path: string = "files") {
    const normalizedPath = require("path").join(__dirname, directory_path);
    const fileNames = await fs.promises.readdir(normalizedPath);
    for (let file of fileNames) {
        await parseCsv(`${normalizedPath}/${file}`)

    }
}