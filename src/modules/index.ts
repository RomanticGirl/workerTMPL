import parsers from './parsers';
import dbs from './db';
import brokers from './brokers';

import { Modules } from './modules.types';

async function compileModules(modules: Modules) {
    modules.dbs = dbs;
    modules.brokers = brokers;
    modules.parsers = parsers;
}

export default compileModules;