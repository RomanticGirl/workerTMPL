import fs from "fs";
import {
    createGUTables,
    bulkInsert,
    insertGUFileData,
} from "./parser_gu_xml_queries";
import { XMLParser } from "fast-xml-parser";
import {
    PIN_REC_default,
    PIN_REC_fields_default,
    PIN_REC_buffer_default,
    PIN_REC_error_buffer_default,
    bulkInsertStep,
} from "../utils/parser_config";

const parseGUXml = async function (file_path: string) {
    let { PIN_REC_buffer, PIN_REC_error_buffer } = resetBuffers();

    let file_name = file_path.split("/").pop();
    let table_name = file_name!.split(".")[0];

    console.log(`Обработка файла ${file_name}`);

    // Посылаем сообщение на валидатор с названием созданной таблицы

    await createGUTables(table_name);

    var xml = fs.readFileSync(file_path);
    const options = {
        ignoreAttributes: false,
    };

    const parser = new XMLParser(options);
    let jsonObj = parser.parse(xml);
    let id = 0;

    // У разных типов gu разный начальный тег, потому мы получаем для каждого отдельно
    let gu_type = Object.keys(jsonObj).pop()!;

    // Сохранение данных о корневом элементе xml
    await insertGUFileData(table_name, {
        GU_PERIOD: jsonObj[gu_type]["@_PERIOD"],
        GU_VERSION: jsonObj[gu_type]["@_xmlns:ns0"].split("/").pop(),
    });
    // Проходим по элементам PIN_REC
    for (const PIN_REC_ITEM of jsonObj[gu_type]["PIN_REC"]) {
        id++;
        // Корирование чистого элемента PIN_REC
        let PIN_REC: any = { ...PIN_REC_default, id: id };
        // Проходим по атрибутам PIN_REC
        for (const [PIN_REC_key, PIN_REC_value] of Object.entries<any>(PIN_REC_ITEM)) {
            // Если начинается с "@_", то это атрибуты PIN_REC, иначе другие элементы внутри PIN_REC
            if (PIN_REC_key.startsWith("@_")) {
                // Убираем префикс атрибута
                let field = PIN_REC_key.slice(2);
                // Проверка на наличие атрибута в базовом наборе атрибутов. Если его нету, то сохраняем в таблицу с ошибками
                if (PIN_REC.hasOwnProperty(field)) {
                    PIN_REC[field] = PIN_REC_value;
                } else {
                    let temp = JSON.stringify({ PIN_REC_key: PIN_REC_value });
                    PIN_REC_error_buffer["PIN_REC"].push({
                        UNKNOWN_TAG_JSON: temp,
                    });
                }
            } else {
                // Элемент RES_CODE имеет отдельный обработчик
                if (PIN_REC_key == "RES_CODE") {
                    let RES_CODE_CODE = PIN_REC_value["@_code"];
                    if (PIN_REC_value["DATA_CODE"]) {
                        for (const [RES_CODE_key, RES_CODE_value] of Object.entries<any>(
                            PIN_REC_value["DATA_CODE"]
                        )) {
                            PIN_REC_buffer["RES_CODE"].push({
                                id: id,
                                RES_CODE_CODE: RES_CODE_CODE,
                                DATA_CODE_CODE: RES_CODE_value["@_code"],
                            });
                        }
                    } else {
                        PIN_REC_buffer["RES_CODE"].push({
                            id: id,
                            RES_CODE_CODE: RES_CODE_CODE,
                            DATA_CODE_CODE: null,
                        });
                    }
                    // Если несколько одинаковых элементов, то они добавляются в массив, потому обрабатываем каждый по отдельности
                } else if (Array.isArray(PIN_REC_value)) {
                    PIN_REC_value.forEach((PIN_REC_value_item) => {
                        processNode(
                            id,
                            PIN_REC_key,
                            PIN_REC_value_item,
                            PIN_REC_buffer,
                            PIN_REC_error_buffer
                        );
                    });
                } else {
                    processNode(
                        id,
                        PIN_REC_key,
                        PIN_REC_value,
                        PIN_REC_buffer,
                        PIN_REC_error_buffer
                    );
                }
            }
        }
        PIN_REC_buffer["PIN_REC"].push(PIN_REC);
        // console.log(PIN_REC_buffer["PIN_REC"].length);
        if (id % bulkInsertStep == 0) {

            await insert(table_name, PIN_REC_buffer, PIN_REC_error_buffer);
            ({ PIN_REC_buffer, PIN_REC_error_buffer } = resetBuffers());
            console.log(`Обработка файла ${file_name}. Сохранено ${id} записей`);
        }
    }
    await insert(table_name, PIN_REC_buffer, PIN_REC_error_buffer);
    console.log(
        `Обработка файла ${file_name} завершена. Сохранено ${id} записей`
    );
};

// Обработка конечных нодов PIN_REC
const processNode = (
    id: any,
    PIN_REC_key: any,
    PIN_REC_value: any,
    PIN_REC_buffer: any,
    PIN_REC_error_buffer: any
) => {
    let base = { ...PIN_REC_fields_default[PIN_REC_key] };
    for (const [PIN_REC_value_key, PIN_REC_value_value] of Object.entries(PIN_REC_value)) {
        let field = PIN_REC_value_key.slice(2);

        if (base.hasOwnProperty(field)) {
            base[field] = PIN_REC_value_value;
        } else {
            let temp = {} as any;
            temp[PIN_REC_value_key] = PIN_REC_value_value;
            temp = JSON.stringify(temp);
            PIN_REC_error_buffer[PIN_REC_key].push({
                UNKNOWN_TAG_JSON: temp,
            });
        }
    }
    base.id = id;
    PIN_REC_buffer[PIN_REC_key].push(base);
};

const insert = async function (
    table_name: string,
    PIN_REC_buffer: any,
    PIN_REC_error_buffer: any
) {
    for (const key of Object.keys(PIN_REC_buffer)) {
        if (!PIN_REC_buffer[key].length) continue;
        await bulkInsert(`${table_name}$${key}`, PIN_REC_buffer[key], key + "_");
        global.app.modules.brokers.rabbitParserWorker.sendToValidator(`${table_name}$${key}`);

    }
    for (const key of Object.keys(PIN_REC_error_buffer)) {
        if (!PIN_REC_error_buffer[key].length) continue;

        await bulkInsert(
            `${table_name}$${key}_error`,
            PIN_REC_error_buffer[key],
            key + "_"
        );
        global.app.modules.brokers.rabbitParserWorker.sendToValidator(`${table_name}$${key}_error`);
    }
};

// Ресет бафферов к дефолтным значениям
const resetBuffers = function () {
    const PIN_REC_buffer = JSON.parse(JSON.stringify(PIN_REC_buffer_default));
    const PIN_REC_error_buffer = JSON.parse(JSON.stringify(PIN_REC_error_buffer_default));
    return { PIN_REC_buffer, PIN_REC_error_buffer };
};

export default async function parseGUXmlDirectory(directory_path?: string) {
    const normalizedPath = require("path").join(__dirname, directory_path);
    const fileNames = await fs.promises.readdir(normalizedPath);
    for (let file of fileNames) {
        await parseGUXml(`${normalizedPath}/${file}`);
    }
};
