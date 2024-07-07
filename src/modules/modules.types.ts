import { IPoolPipeline } from "./db/pg/pg.interface";

interface AddedModules {
    [key: string]: (key?: string) => Promise<void>;
}

interface DbModules {
    [key: string]: (key?: string) => Promise<IPoolPipeline>;
}



// export type Modules = {
//     [key: string]: AddedModules;
// }

export type Modules = {
    dbs: DbModules;
    brokers: AddedModules;
    parsers: AddedModules | Promise<void>;
}

export type Module = {
    modules: Modules;
}