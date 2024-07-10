
const schema = "public";

const createGUTables = async function (table_name) {
    table_name = `${table_name}`;

    await pool.query(`
        CREATE TABLE IF NOT EXISTS ${schema}.${table_name} (
            GU_PERIOD character varying(300),
            GU_VERSION character varying(300) 
        );
    `);

    await pool.query(`TRUNCATE  ${schema}.${table_name} CASCADE`);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS ${schema}.${table_name}_error (
            UNKNOWN_TAG_JSON character varying(300)
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS ${schema}.${table_name}$PIN_REC (
            id integer NOT NULL,
            PIN_REC_RES_CODE character varying(300),
            PIN_REC_PIN integer,
            PIN_REC_PIN_PR integer,
            PIN_REC_L_NAME character varying(300),
            PIN_REC_F_NAME character varying(300),
            PIN_REC_S_NAME character varying(300),
            PIN_REC_BNF_CAT character varying(300),
            PIN_REC_INFO_DATE character varying(300),
            PIN_REC_BEGIN_DATE character varying(300),
            PIN_REC_END_DATE character varying(300),
            PIN_REC_N integer,
            PIN_REC_OBJECT_ADDRESS character varying(300),
            PIN_REC_OBJECT_GUID character varying(300),
            PIN_REC_FLAT character varying(300),
            PIN_REC_PREMISE_GUID character varying(300),
            PIN_REC_LS_TYPE integer,
            PIN_REC_OWNER boolean,
            PIN_REC_N_ALL bigint,
            PIN_REC_SQ_ALL decimal,
            PIN_REC_SQ decimal,
            PIN_REC_DISTR_ID character varying(300),
            PIN_REC_DISTR_NAME character varying(300),
            PIN_REC_D1_SQ integer,
            PIN_REC_D2_SQ integer,
            PIN_REC_CHARGE_SUM decimal,
            CONSTRAINT ${table_name}$PIN_REC_pkey PRIMARY KEY (id)
        );
    `);

    await pool.query(`TRUNCATE ${schema}.${table_name}$PIN_REC CASCADE`);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS ${schema}.${table_name}$PIN_REC_error (
          UNKNOWN_TAG_JSON character varying(300)
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS ${schema}.${table_name}$MC (
            id integer NOT NULL,
            MC_MC_ACC character varying(300),
            MC_MC_CODE character varying(300),
            MC_MC_NAME character varying(300),
            MC_MC_INN character varying(300),
            MC_N_MC bigint,
            MC_SQ_PAY decimal,
            MC_OWN_TYPE integer,
            CONSTRAINT fk_mc FOREIGN KEY (id)
            REFERENCES ${schema}.${table_name}$PIN_REC (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS ${schema}.${table_name}$MC_error (
          UNKNOWN_TAG_JSON character varying(300)
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS ${schema}.${table_name}$RSO (
            id integer NOT NULL,
            RSO_RSO_ACC character varying(300),
            RSO_RSO_CODE character varying(300),
            RSO_RSO_NAME character varying(300),
            RSO_INN character varying(300),
            RSO_N_RSO bigint,
            RSO_SQ_RSO decimal,
            CONSTRAINT fk_rso FOREIGN KEY (id)
            REFERENCES ${schema}.${table_name}$PIN_REC (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS ${schema}.${table_name}$RSO_error (
            UNKNOWN_TAG_JSON character varying(300)
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS ${schema}.${table_name}$RENT (
            id integer NOT NULL,
            RENT_RENT_ACC character varying(300),
            RENT_RENT_CODE character varying(300),
            RENT_RENT_NAME character varying(300),
            RENT_RENT_INN character varying(300),
            RENT_N_RENT bigint,
            RENT_SQ_RENT decimal,
            RENT_OWNER_TYPE integer,
            CONSTRAINT fk_rent FOREIGN KEY (id)
            REFERENCES ${schema}.${table_name}$PIN_REC (id) MATCH SIMPLE
            ON UPDATE NO ACTION 
            ON DELETE NO ACTION
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS ${schema}.${table_name}$RENT_error (
            UNKNOWN_TAG_JSON character varying(300)
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS ${schema}.${table_name}$REP (
        id integer NOT NULL,
        REP_REP_ACC character varying(300),
        REP_REP_CODE character varying(300),
        REP_REP_NAME character varying(300),
        REP_REP_INN character varying(300),
        REP_N_REP bigint,
        REP_SQ_REP decimal,
        UNKNOWN_TAG_JSON character varying(300),
        CONSTRAINT fk_rep FOREIGN KEY (id)
        REFERENCES ${schema}.${table_name}$PIN_REC (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS ${schema}.${table_name}$REP_error (
            UNKNOWN_TAG_JSON character varying(300)
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS ${schema}.${table_name}$RES_CODE (
            id integer NOT NULL,
            RES_CODE_CODE character varying(300),
            DATA_CODE_CODE integer,
            CONSTRAINT fk_res_code FOREIGN KEY (id)
            REFERENCES ${schema}.${table_name}$PIN_REC (id) MATCH SIMPLE
            ON UPDATE NO ACTION 
            ON DELETE NO ACTION
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS ${schema}.${table_name}$RES_CODE_error (
            UNKNOWN_TAG_JSON character varying(300)
        );
    `);
};

/**
 * @param {String} table_name
 * @param {Object[]} data
 * @param {String} column_prefix
 */
const bulkInsert = async function (table_name, data, column_prefix) {
    let fields = Object.keys(data[0])
        .map((elem) => {
            // console.log(column_prefix);
            if (elem == "id" || elem == "UNKNOWN_TAG_JSON" || column_prefix == "RES_CODE_")
                return elem;
            return column_prefix + elem;
        })
        .join(" , ");
    let values = "";
    data.forEach((item) => {
        let items = Object.values(item);
        items = items.map((item) => {
            if (typeof item == "string") {
                return item.replaceAll("'", '"');
            }
            return item;
        });
        values += "('" + items.join("','") + "'),";
    });
    values = values.slice(0, -1) + ";";
    values = values.replaceAll("''", "null");
    await pool.query(`INSERT INTO ${schema}.${table_name} (${fields}) VALUES ${values}`);
};

const insertGUFileData = async function (table_name, data) {
    await db_insert(table_name, data, schema);
};

module.exports = {
    createGUTables,
    bulkInsert,
    insertGUFileData,
};