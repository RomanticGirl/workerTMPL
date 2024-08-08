import { Module, Modules } from './src/modules/modules.types';
import compileModules from './src/modules';
import dotenv from 'dotenv';
import { extractFilesFromZipContent } from './src/modules/additional/arichivator'
declare global {
    var app: Module;
}
globalThis.app = {} as Module;

class MicroService {
    private app: Module;
    constructor(app: Module) {
        this.app = app;
        app.modules = {} as Modules;
        app.messages = [];
    }

    async run() {
        dotenv.config();
        // run server
        console.log("running server")
        // add modules
        await this.readModules();
        await this.app.modules.dbs._pgpool.connect();
        // Получение данных о парсере и файле из сообщений
        // await extractFilesFromZipContent()
        // await this.app.modules.parsers.parseGUXmlDirectory!("files");
        await this.app.modules.parsers.parseContentLoaderDirectory!("files")
    }

    async readModules() {
        console.log("reading modules")
        compileModules(this.app.modules);
    }
}

(async () => {
    const service = new MicroService(app)
    await service.run();
})();