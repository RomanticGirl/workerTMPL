import fs from 'node:fs';
import dotenv from 'dotenv';
import path from "path";
import xmlMapping from './../../constants/XMLToDataBaseMapping';
import { from as copyFrom } from 'pg-copy-streams';
import { PassThrough } from 'node:stream';
import { pipeline } from 'node:stream/promises';

import xml2js from 'xml2js';







async function parseXMLToDatabase(xmlFile: any, xmlNameWithDate: string) {
    dotenv.config();
    const tagsToHandle = ["OBJECT", "ITEM", "PARAM", "APARTMENT", "CARPLACE", "HOUSE", "NORMDOC", "ROOM", "STEAD", "OBJECTLEVEL",
        "HOUSETYPE", "ADDRESSOBJECTTYPE", "APARTMENTTYPE", "NDOCKIND", "NDOCTYPE", "OPERATIONTYPE", "PARAMTYPE",
        "ROOMTYPE"];

    const batchSize = 300000;
    const expNameWithoutDate = new RegExp(process.env.XML_NAME_WITHOUT_DATE!);

    console.log(`Start parse  xml ${xmlNameWithDate} to database`);
    const xmlPath = path.join("public/resources/gar-zip/extracted", xmlFile.name);
    const xmlFileStream = fs.createReadStream(xmlPath);
    // const xmlStreamParser = new xmlStream(xmlFileStream);


    const tableNameWithoutDate = xmlNameWithDate.replace(expNameWithoutDate, '');
    const passThroughStream = new PassThrough();
    let currentBatch: any[] = [];
    var parser = new xml2js.Parser()
    const xmlReader = fs.readFile(xmlPath, function (err, data) {
        parser.parseString(data, function (err, result) {
            console.dir(result);
            console.log('Done');
        });
    });



    // tagsToHandle.forEach(tag => {
    //     xmlStreamParser.on(`endElement: ${tag}`, async (item) => {
    //         try {
    //             const data = xmlMapping[tableNameWithoutDate](item);
    //             const quotedValues = await Object.values<any>(data).map(value => {

    //                 let cleanedValue = value;
    //                 if (typeof cleanedValue === 'string') {
    //                     cleanedValue = value.replace(/\n/g, '');
    //                     return `"${cleanedValue.replace(/"/g, '""')}"`;
    //                 }
    //                 return cleanedValue;

    //             });
    //             currentBatch.push(Object.values(quotedValues).join(','));
    //         } catch (err) {
    //             console.log(err);
    //         }

    //         if (currentBatch.length === batchSize) {
    //             passThroughStream.write(currentBatch.join('\n') + '\n');
    //             currentBatch = [];
    //         }
    //     });
    // });
    // xmlStreamParser.on('end', () => {
    //     if (currentBatch.length > 0) {
    //         passThroughStream.write(currentBatch.join('\n') + '\n');
    //     }
    //     passThroughStream.end();
    // });
    // const copyStream = await global.app.modules.dbs._pgpool.query(copyFrom(`COPY "${xmlNameWithDate}" FROM STDIN WITH (FORMAT CSV)`));
    const start = Date.now();

    // try {
    //     await pipeline(passThroughStream, copyStream);
    //     console.log(`----- Finished parsing XML ${xmlNameWithDate} -----`);
    // } catch (error) {
    //     console.error('----- Error in copy stream ----- ', error);
    // }
    const end = Date.now();
    console.log(`+++++ Execution time for pipeline: ${end - start} ms +++++`);
}

export default parseXMLToDatabase;