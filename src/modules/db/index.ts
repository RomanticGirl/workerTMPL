import { DbModules } from "../modules.interfaces";
import { PostgreSQLConnection } from "./pg";

const dbs = {} as DbModules;
const pool = PostgreSQLConnection();

dbs._pgpool = pool;


export default dbs;