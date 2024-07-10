import { Module, Modules } from './src/modules/modules.types';
import compileModules from './src/modules';
import dotenv from 'dotenv';


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
        global.app.messages
        
        await this.app.modules.parsers.parseGarZIP!("files");

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