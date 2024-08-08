import * as yauzl from 'yauzl';
import fs from 'fs';
import path from "path";
import dotenv from 'dotenv'

export async function extractFilesFromZipContent(/*zipFilePath: string, outputDir: string*/) {
    dotenv.config();
    const zipFilePath = process.env.ZIP_PATH!;
    const outputDir = process.env.OUTPUT_DIR!;

    // let promises: any = [];
    const xmlFiles = await fs.promises.readdir(zipFilePath, { recursive: true, withFileTypes: true });
    for (let i = 0; i < xmlFiles.length; i++) {
        // if (promises.length > 25) {
        //     await Promise.all(promises);
        //     promises = [];
        // }
        let broken = false;
        await (new Promise<void>((resolve, reject) => {
            console.log("Content unziping started");
            yauzl.open(path.join(zipFilePath, xmlFiles[i].name), { lazyEntries: true }, (err, zipfile) => {
                if (err) {
                    broken = true;
                    console.log(err + xmlFiles[i].name)
                } else {
                    zipfile.readEntry();
                    zipfile.on("entry", (entry) => {
                        const entryPath = xmlFiles[i].name.slice(0, -3) + "xml";

                        console.log(`Extracting ${entryPath}`);

                        const isRootFile = entryPath.indexOf('/') === -1;
                        if (isRootFile) {
                            const outputPath = path.join(outputDir, entryPath);
                            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
                            const writeStream = fs.createWriteStream(path.join(outputDir, entryPath));
                            zipfile.openReadStream(entry, (err, readStream) => {
                                if (err) console.log(err);
                                readStream.pipe(writeStream);
                                readStream.on("end", () => {
                                    zipfile.readEntry();
                                });
                            });
                        } else {
                            zipfile.readEntry();
                        }
                    });
                    zipfile.on("end", () => {
                        console.log(`Unzip of ${xmlFiles[i].name} is finished ${i}/${xmlFiles.length}`);

                        // отправка на парсер названий файлов
                        // global.app.modules.brokers.rabbitParserWorker.funcCheckWorker(JSON.stringify({ outputDir: xmlFiles[i].name.slice(0, -3) + "xml" }));
                        resolve();
                    });
                }
            });
        })).then(() => {
            // Отправка в очередь

            console.log("done")
            return true
        }).catch((e) => {
            console.log(e)
            return true
        })
        // if (!broken) {
        //     promises.push(unzipFile);
        // }
    }
    console.log("DONE ALL")
    return true;
}