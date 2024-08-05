import * as yauzl from 'yauzl';
import fs from 'fs';
import path from "path";

export async function extractFilesFromZipContent(zipFilePath: string, outputDir: string) {
    let promises = [];
    const xmlFiles = await fs.promises.readdir(zipFilePath, { recursive: true, withFileTypes: true });
    for (let i = 1700; i < 2000; i++) {
        // if (promises.length > 200) {
        //     await Promise.all(promises);
        //     promises = [];
        // }
        promises.push(new Promise<void>((resolve, reject) => {
            console.log("Content unziping stared");
            yauzl.open(path.join(zipFilePath, xmlFiles[i].name), { lazyEntries: true }, (err, zipfile) => {
                if (err) console.log(err);
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
                    console.log(`Unzip of ${xmlFiles[i].name} is finished`);
                    resolve();
                });
            });
        }));
    }
    console.log("done")
    return await Promise.all(promises);
}

function extractFilesFromZip(zipFilePath: string, targetFolderName: string, outputDir: string) {
    return new Promise<void>((resolve, reject) => {
        console.log("Gar unziping stared");
        yauzl.open(zipFilePath, { lazyEntries: true }, (err, zipfile) => {
            if (err) return reject(err);
            zipfile.readEntry();
            zipfile.on("entry", (entry) => {
                const entryPath = entry.fileName;

                console.log(`Extracting ${entryPath}`);

                const isRootFile = entryPath.indexOf('/') === -1;
                const isTargetFolderFile = entryPath.startsWith(`${targetFolderName}/`);
                if (isRootFile || isTargetFolderFile) {
                    const outputPath = path.join(outputDir, entryPath);
                    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
                    const writeStream = fs.createWriteStream(path.join(outputDir, entryPath));
                    zipfile.openReadStream(entry, (err, readStream) => {
                        if (err) return reject(err);
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
                console.log("Unzip of gar_xml.zip is finished");
                resolve();
            });
        });
    });
}

export default extractFilesFromZip;