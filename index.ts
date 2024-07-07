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
    }
    async run() {
        dotenv.config();
        // run server
        console.log("running server")
        // add modules
        await this.readModules();
    }



    async readModules() {
        console.log("reading modules")

        compileModules(this.app.modules);

        // const pool = (await this.app.modules.dbs.PostgreSQLConnection()).db_bulk_insert("testWorkerTMPL", [""], [[""]]);
        this.app.modules.brokers.MainRabbitWorker();
    }
}


new MicroService(app).run();