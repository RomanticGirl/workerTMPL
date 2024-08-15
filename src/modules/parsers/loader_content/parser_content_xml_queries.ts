const schema = "public";



export const create_table = async function (table_name: string) {
    await global.app.modules.dbs._pgpool.query(` 
        CREATE TABLE IF NOT EXISTS ${schema}.${table_name} (
            ExportAccrualsPaymentsPackage character varying(300),
            version character varying(300),
            create_date character varying(300),
            file_name character varying(300)
        );
    `);

    await global.app.modules.dbs._pgpool.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.${table_name + "_error"} (
        UNKNOWN_TAG_JSON character varying(300)
    )`
    );
    await global.app.modules.dbs._pgpool.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.${table_name + "$HOUSE"} (
        house character varying(300),
        fias_house_code character varying(300),
        original_fias_house_code character varying(300),
        hm_house_guid character varying(300),
        address_string character varying(300),
        house_type character varying(300),
        house_condition character varying(300),
        house_heating_system_type character varying(300),
        hot_water_supply_system_type character varying(300),
        in_house_engineering_drainage_system character varying(300),
        in_house_engineering_cold_water_supply_system character varying(300),
        in_house_engineering_gas_supply_system character varying(300)
    )`
    );

    await global.app.modules.dbs._pgpool.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.${table_name + "$HOUSE_error"} (
        UNKNOWN_TAG_JSON character varying(300)
    )`
    );

    await global.app.modules.dbs._pgpool.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.${table_name + "$NSI_HOUSE"} (
        jkh_house_code character varying(300),
        link_name character varying(300),
        code character varying(300),
        guid character varying(300),
        value character varying(300)
    )
`)

    await global.app.modules.dbs._pgpool.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.${table_name + "$communal_rate_consumption"} (
        jkh_house_code character varying(300),
        communal_rate_consumption character varying(300),
        root_rate_guid character varying(300),
        rate_guid character varying(300),
        name character varying(300),
        date_begin character varying(300),
        date_end character varying(300),
        nsi_norm_type character varying(300),
        nsi_service_type character varying(300),
        nsi_resource_type character varying(300),
        direction character varying(300),
        components_count character varying(300),
        component_one character varying(300),
        component_two character varying(300),
        tko_consumer_category character varying(300),
        objects_category character varying(300),
        territory_oktmo character varying(300),
        diff_criterion_reference_object character varying(300),
        is_diff_criteria_set character varying(300),
        is_diff_criteria_not_set character varying(300),
        diff_criteria character varying(300)
    )
`);
    await global.app.modules.dbs._pgpool.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.${table_name + "$communal_rate_consumption_error"} (
        UNKNOWN_TAG_JSON character varying(300)
    )
`);

    await global.app.modules.dbs._pgpool.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.${table_name + "$communal_rate_criterion"} (
        root_rate_guid character varying(300),
        rate_guid character varying(300),
        link_name character varying(300),
        diff_criterion_guid character varying(300),
        type character varying(300),
        operator character varying(300),
        source character varying(300),
        criterion_code character varying(300),
        criterion_name character varying(300),
        logical_value character varying(300),
        integer_value_from character varying(300),
        integer_value_to character varying(300),
        real_value_from character varying(300),
        other_diff_criterion character varying(300),
        diff_criterion_reference_object character varying(300),
        reference_code character varying(300),
        nsi_code character varying(300),
        nsi_name character varying(300)
    )
`);

    await global.app.modules.dbs._pgpool.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.${table_name + "$nsi_communal"} (
        jkh_house_code character varying(300),
        link_name character varying(300),
        code character varying(300),
        guid character varying(300),
        value character varying(300)
    )
`);

    await global.app.modules.dbs._pgpool.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.${table_name + "$standard"} (
        jkh_house_code character varying(300),
        standard character varying(300),
        root_standard_guid character varying(300),
        standard_guid character varying(300),
        date_begin character varying(300),
        date_end character varying(300),
        territory_oktmo character varying(300),
        standard_rate character varying(300),
        all_categories character varying(300),
        categories character varying(300)
    )
`);

    await global.app.modules.dbs._pgpool.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.${table_name + "$standard_error"} (
        UNKNOWN_TAG_JSON character varying(300)
    )
`);

    await global.app.modules.dbs._pgpool.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.${table_name + "$standard_rate"} (
        jkh_house_code character varying(300),
        root_standard_guid character varying(300),
        standard_guid character varying(300),
        code character varying(300),
        name character varying(300),
        size character varying(300),
        measure character varying(300),
        is_diff_criteria_not_set character varying(300),
        diff_criteria character varying(300)
    )
`);

    await global.app.modules.dbs._pgpool.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.${table_name + "$unified_account"} (
        jkh_house_code character varying(300),
        unified_account character varying(300),
        unified_account_number character varying(300),
        object character varying(300),
        premise character varying(300),
        premise_guid character varying(300),
        category character varying(300),
        whole_house character varying(300),
        room character varying(300),
        room_guid character varying(300),
        number character varying(300),
        accrual character varying(300),
        payment_document character varying(300),
        service_provider character varying(300),
        service character varying(300)
    )
`);

    await global.app.modules.dbs._pgpool.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.${table_name + "$unified_account_error"} (
        UNKNOWN_TAG_JSON character varying(300)
    )
`);

    await global.app.modules.dbs._pgpool.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.${table_name + "$nsi_unified_account"} (
        jkh_house_code character varying(300),
        link_name character varying(300),
        code character varying(300),
        guid character varying(300),
        value character varying(300),
        service_guid character varying(300)
    )
`);

    await global.app.modules.dbs._pgpool.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.${table_name + "$payment_unified_account"} (
        jkh_house_code character varying(300),
        payment_document_guid character varying(300),
        payment_document_id character varying(300),
        payment_document_type character varying(300),
        payment_document_number character varying(300),
        service_id character varying(300),
        account_number character varying(300),
        account_status character varying(300),
        period character varying(300),
        invoice_date character varying(300),
        total_amount character varying(300),
        use_total_amount_with_debt_and_advance character varying(300),
        total_amount_with_debt_and_advance character varying(300)
    )
`);

    await global.app.modules.dbs._pgpool.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.${table_name + "$payment_service"} (
        jkh_house_code character varying(300),
        payment_document_guid character varying(300),
        guid character varying(300),
        main_municipal_service character varying(300),
        municipal_resource character varying(300),
        resource_type character varying(300),
        service_type character varying(300),
        charge_type character varying(300),
        total_amount character varying(300),
        amount_by_service character varying(300),
        tariff character varying(300),
        amount character varying(300),
        individual_consumption_norm character varying(300),
        okei character varying(300),
        code character varying(300),
        name character varying(300),
        volume character varying(300),
        type character varying(300),
        consumption_measure_type character varying(300),
        consumption character varying(300)
    )
`);

    await global.app.modules.dbs._pgpool.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.${table_name + "$provider_service"} (
        jkh_house_code character varying(300),
        payment_document_guid character varying(300),
        receiver_guid character varying(300),
        provider_name character varying(300),
        provider_inn character varying(300),
        provider_kpp character varying(300),
        amount_by_provider character varying(300),
        total_amount_debt_advance character varying(300),
        total_amount_with_debt_and_advance character varying(300),
        total_amount_with_debt_advance character varying(300)
    )
`);
}

export const bulk_insert = async function (table_name: string, isBox: boolean, buffer_save: any, chunk: any) {
    if (buffer_save.length > 1) {
        global.app.modules.dbs._pgpool // POOL
        var insert_field = ""
        var insert_value = ""
        var insert_query = `INSERT INTO ${table_name} (`
        for (const key of buffer_save[0]) {
            insert_field += key + ","
        }
        insert_field = insert_field.replaceAll("-", "_").slice(0, -1)
        insert_query += insert_field
        insert_query += ") VALUES ("
        var repeat = chunk
        var repeat_query = insert_query
        for (let j = 1; j < buffer_save.length; j++) {
            for (const key of buffer_save[0]) {
                if (isBox && key == "code") {
                    break;
                }
                var value = buffer_save[j][0][key] !== null ? buffer_save[j][0][key].replaceAll("'", "").replaceAll("\\", "\\\\") : null
                insert_value += (
                    (value === null ? "" : "'")
                    + value
                    + (value === null ? "" : "'")
                    + ","
                )
            }
            insert_value = insert_value.slice(0, -1)
            insert_value += "),("
            if (j == repeat) {
                insert_query += insert_value.slice(0, -3)
                insert_query += ");"
                await global.app.modules.dbs._pgpool.query(insert_query)
                repeat += chunk
                insert_query = repeat_query
                insert_value = ""
            }
        }
        insert_value = insert_value.slice(0, -3)
        insert_query = `INSERT INTO ${table_name} (`
        insert_query += insert_field
        insert_query += ") VALUES ("
        insert_query += insert_value
        insert_query += ");"
        await global.app.modules.dbs._pgpool.query(insert_query)
        // if (isBox && buffer_save[0].length) {
        //     insert_query = `INSERT INTO ${table_name + "_error"} (`
        //     insert_query += "unknown_tag_json"
        //     insert_query += ") VALUES ('"
        //     insert_query += JSON.stringify(buffer_save[0])
        //     insert_query += "');"
        //     await global.app.modules.dbs._pgpool.query(insert_query)
        // }
    }
}