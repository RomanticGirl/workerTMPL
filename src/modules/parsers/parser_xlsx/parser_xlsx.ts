import ExcelJS from "exceljs";
import fs from "fs";
import { bulkInsertXlsxData } from "./parser_xlsx_queries";

const parseXlsx = async function (file_path: string) {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(file_path);
    let first = true;
    wb.eachSheet(function (worksheet, sheetId) {
        if (first) {
            first = false;
            return;
        }
        let data_to_insert: any[] = [];
        let table_name = file_path.split("/").pop()!.slice(0, -5) + "_" + worksheet.name.replace("-", "_");

        worksheet.eachRow(function (row, rowNumber) {
            if (rowNumber < 5) return;
            let temp = [];
            for (let i = 1; i <= row.cellCount; i++) {
                let value: any = row.getCell(i).value;
                if (typeof value == "object" && value !== null) {
                    temp.push(value.result);
                    continue;
                }
                temp.push(value || 0);
            }
            data_to_insert.push(temp);
        });

        bulkInsertXlsxData(table_name, data_to_insert);
    });
};

export default async function parseXlsxDirectory(directory_path: string = "files") {
    const normalizedPath = require("path").join(__dirname, directory_path);
    const fileNames = await fs.promises.readdir(normalizedPath);
    for (let file of fileNames) {
        await parseXlsx(`${normalizedPath}/${file}`);
    }
};
