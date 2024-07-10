
const schema = "public"

async function createXlsxTable(table_name: string) {
    // Для проверок
    console.log(`Drop table ${schema}.${table_name}`);
    await global.app.modules.dbs._pgpool.query(`DROP TABLE IF EXISTS ${schema}.${table_name}`);

    console.log(`Create table ${schema}.${table_name}`);

    // global.app.modules.brokers.rabbitParserWorker.sendToValidator(table_name);
    
    await global.app.modules.dbs._pgpool.query(`
        CREATE TABLE ${schema}.${table_name} (
            period_1 character varying(300),
            LS_ID_2 character varying(300),
            LS_3 character varying(300),
            address_4 character varying(300),
            id_FIAS_5 character varying(300),
            number_premises_6 character varying(300),
            id_premises_6_1 character varying(300),
            number_room_7 character varying(300),
            id_room_7_1 character varying(300),
            id_GIS_JKH_8 character varying(300),
            square_9 character varying(300),
            type_premises_10 character varying(300),
            form_owner_11 character varying(300),
            number_people_12 character varying(300),
            all_charge_13 character varying(300),
            charge_live_space_14 character varying(300),
            charge_general_cold_water_15 character varying(300),
            charge_general_hot_water_16 character varying(300),
            charge_general_energy_17 character varying(300),
            charge_general_drainage_18 character varying(300),
            charge_all_utility_services_19 character varying(300),
            cold_water_charge_20 character varying(300),
            cold_water_norma_21 character varying(300),
            cold_water_tariff_22 character varying(300),
            hot_water_charge_23 character varying(300),
            hot_water_norma_24 character varying(300),
            hot_water_tariff_25 character varying(300),
            heating_charge_26 character varying(300),
            heating_norma_27 character varying(300),
            heating_tariff_28 character varying(300),
            energy_charge_29 character varying(300),
            energy_norma_30 character varying(300),
            energy_tariff_31 character varying(300),
            drainage_charge_32 character varying(300),
            drainage_norma_33 character varying(300),
            drainage_tariff_34 character varying(300),
            garbage_charge_35 character varying(300),
            garbage_norma_36 character varying(300),
            garbage_tariff_37 character varying(300),
            pay_for_hire_38 character varying(300),
            is_special_account_39 character varying(300),
            fee_for_general_overhaul_40 character varying(300),
            minimal_fee_for_general_overhaul_41 character varying(300),
            ls_VKR_42 character varying(300),
            is_need_control_info_43 character varying(300),
            number_people_for_msp_44 character varying(300),
            reg_number_recipient_45 character varying(300),
            full_charge_tariff_46 character varying(300),
            value_msp_47 character varying(300),
            result_48 character varying(300)
        );
    `);

    await global.app.modules.dbs._pgpool.query(`ALTER TABLE ${schema}.${table_name} SET UNLOGGED;`);
}

export async function bulkInsertXlsxData(table_name: string, data: any[]) {
    await createXlsxTable(table_name);

    console.log(`Insert into table ${schema}.${table_name}`);
    let query = `INSERT INTO ${schema}.${table_name} (
        period_1, LS_ID_2, LS_3, address_4, id_FIAS_5, number_premises_6, id_premises_6_1, number_room_7, id_room_7_1,
        id_GIS_JKH_8, square_9, type_premises_10, form_owner_11, number_people_12, all_charge_13, charge_live_space_14,
        charge_general_cold_water_15, charge_general_hot_water_16, charge_general_energy_17, charge_general_drainage_18,
        charge_all_utility_services_19, cold_water_charge_20, cold_water_norma_21, cold_water_tariff_22,
        hot_water_charge_23, hot_water_norma_24, hot_water_tariff_25, heating_charge_26, heating_norma_27,
        heating_tariff_28, energy_charge_29, energy_norma_30, energy_tariff_31, drainage_charge_32, drainage_norma_33,
        drainage_tariff_34, garbage_charge_35, garbage_norma_36, garbage_tariff_37, pay_for_hire_38, is_special_account_39,
        fee_for_general_overhaul_40, minimal_fee_for_general_overhaul_41, ls_VKR_42, is_need_control_info_43, number_people_for_msp_44,
        reg_number_recipient_45, full_charge_tariff_46, value_msp_47, result_48
    ) VALUES `;

    data.forEach((item) => {
        query += "('" + item.join("','") + "'),";
    });

    query = query.slice(0, -1) + ";";

    try {
        await global.app.modules.dbs._pgpool.query(query);
    } catch (error) {
        console.log(
            `Error in function bulkInsertXlsxData with table ${table_name}`
        );
    }
}