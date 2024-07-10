import * as yauzl from 'yauzl';
import fs from 'fs';
import path from "path";


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