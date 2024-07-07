const { pool, db_bulk_insert } = require("../../database/db");
let schema = "public";

let cvs_fields = [
    "address",
    "id_GIS_JKH",
    "id_FIAS",
    "oktmo",
    "management",
    "ogrn_management",
    "kpp_management",
    "name_management",
    "house_type",
    "state",
    "total_square",
    "loving_square",
    "dormitory_subject_RF",
    "dormitory_municipality",
    "dormitory_type",
    "premises_type",
    "driftage_date",
    "premises_number",
    "room_number",
    "cadastr_number",
    "id_global_house",
    "id_global_premises",
    "id_global_room",
];

async function createCSVTable(table_name) {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS ${schema}.${table_name} (
            address character varying(300),
            id_GIS_JKH character varying(300),
            id_FIAS character varying(300),
            oktmo character varying(300),
            management character varying(300),
            ogrn_management character varying(300),
            kpp_management character varying(300),
            name_management character varying(300),
            house_type character varying(300),
            state character varying(300),
            total_square character varying(300),
            loving_square character varying(300),
            dormitory_subject_RF character varying(300),
            dormitory_municipality character varying(300),
            dormitory_type character varying(300),
            premises_type character varying(300),
            driftage_date character varying(300),
            premises_number character varying(300),
            room_number character varying(300),
            cadastr_number character varying(300),
            id_global_house character varying(300),
            id_global_premises character varying(300),
            id_global_room character varying(300)
        );
    `);
    await pool.query(`ALTER TABLE ${schema}.${table_name} SET UNLOGGED;`);
}

const insertBulkData = async function (table_name, data) {
    await db_bulk_insert(`${schema}.${table_name}`, cvs_fields, data);
};

module.exports = { createCSVTable, insertBulkData };