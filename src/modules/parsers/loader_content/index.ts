import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import { bulk_insert, create_table } from "./parser_content_xml_queries";


const parseContentLoader = async function (file_path: string) {

    var buffer_PaymentsPackage: any = [
        {},
        ["ExportAccrualsPaymentsPackage", "version", "create-date"],
    ]
    var buffer_house: any = [
        {},
        [
            "house",
            "fias-house-code",
            "original-fias-house-code",
            "hm-house-guid",
            "address-string",
            "house-type",
            "house-condition",
            "house-heating-system-type",
            "hot-water-supply-system-type",
            "in-house-engineering-drainage-system",
            "in-house-engineering-cold-water-supply-system",
            "in-house-engineering-gas-supply-system",
            "code",
            "guid",
            "value",
        ],
    ]

    var buffer_nsi_house: any = [
        [
            "jkh-house-code",
            "link_name",
            "code",
            "guid",
            "value",
        ],
    ]

    var buffer_communal_rate_consumption = [
        {},
        [
            "jkh-house-code",
            "communal-rate-consumption",
            "root-rate-guid",
            "rate-guid",
            "name",
            "date-begin",
            "date-end",
            "nsi-norm-type",
            "nsi-service-type",
            "nsi-resource-type",
            "direction",
            "components-count",
            "component-one",
            "component-two",
            "tko-consumer-category",
            "objects-category",
            "territory-oktmo",
            "diff-criterion-reference-object",
            "is-diff-criteria-set",
            "is-diff-criteria-not-set",
            "diff-criteria",
            "code",
            "guid",
            "value",
            "diff-criterion-guid",
            "other-diff-criterion",
            "type",
            "operator",
            "source",
            "criterion-code",
            "criterion-name",
            "logical-value",
            "integer-value-from",
            "integer-value-to",
            "real-value-from",
            "reference-code",
            "nsi-code",
            "nsi-name",
        ],
    ]

    var buffer_communal_rate_criterion: any = [
        [
            "root-rate-guid",
            "rate-guid",
            "link_name",
            "diff-criterion-guid",
            "type",
            "operator",
            "source",
            "criterion-code",
            "criterion-name",
            "logical-value",
            "integer-value-from",
            "integer-value-to",
            "real-value-from",
            "other-diff-criterion",
            "diff-criterion-reference-object",
            "reference-code",
            "nsi-code",
            "nsi-name",
        ],
    ]

    var buffer_nsi_communal: any = [
        [
            "jkh-house-code",
            "link_name",
            "code",
            "guid",
            "value",
        ],
    ]

    var buffer_standard = [
        {},
        [
            "jkh-house-code",
            "standard",
            "root-standard-guid",
            "standard-guid",
            "date-begin",
            "date-end",
            "territory-oktmo",
            "all-categories",
            "categories",
            "code",
            "name",
            "size",
            "measure",
            "is-diff-criteria-not-set",
            "diff-criteria",
        ],
    ]

    var buffer_standard_rate: any = [
        [
            "jkh-house-code",
            "root-standard-guid",
            "standard-guid",
            "code",
            "name",
            "size",
            "measure",
            "is-diff-criteria-not-set",
            "diff-criteria",
        ],
    ]

    var buffer_unified_account = [
        {},
        [
            "jkh-house-code",
            "unified-account",
            "unified-account-number",
            "object",
            "premise",
            "premise-guid",
            "category",
            "whole-house",
            "room",
            "room-guid",
            "number",
            "accrual",
            "payment-document",
            "service-provider",
            "service",
            "code",
            "guid",
            "value",
            "payment-document-guid",
            "payment-document-id",
            "payment-document-type",
            "payment-document-number",
            "service-id",
            "account-number",
            "account-status",
            "period",
            "invoice-date",
            "total-amount",
            "total-amount-with-debt-advance",
            "use-total-amount-with-debt-and-advance",
            "main-municipal-service",
            "municipal-resource",
            "resource-type",
            "service-type",
            "charge-type",
            "total-amount",
            "amount-by-service",
            "amount",
            "tariff",
            "individual-consumption-norm",
            "okei",
            "name",
            "volume",
            "type",
            "consumption-measure-type",
            "consumption",
            "receiver-guid",
            "provider-name",
            "provider-inn",
            "provider-kpp",
            "amount-by-provider",
            "total-amount-debt-advance",
            "total-amount-with-debt-and-advance",
            "total-amount-with-debt-advance",
        ],
    ]

    var buffer_nsi_unified_account: any = [
        [
            "jkh-house-code",
            "link_name",
            "code",
            "guid",
            "value",
        ],
    ]

    var buffer_payment_unified_account: any = [
        [
            "jkh-house-code",
            "payment-document-guid",
            "payment-document-id",
            "payment-document-type",
            "payment-document-number",
            "service-id",
            "account-number",
            "account-status",
            "period",
            "invoice-date",
            "total-amount",
            "use-total-amount-with-debt-and-advance",
            "total-amount-with-debt-and-advance",
        ],
    ]

    var buffer_payment_service: any = [
        [
            "jkh-house-code",
            "payment-document-guid",
            "guid",
            "main-municipal-service",
            "municipal-resource",
            "resource-type",
            "service-type",
            "charge-type",
            "total-amount",
            "amount-by-service",
            "tariff",
            "amount",
            "individual-consumption-norm",
            "okei",
            "code",
            "name",
            "volume",
            "type",
            "consumption-measure-type",
            "consumption",
        ],
    ]

    var buffer_provider_service: any = [
        [
            "jkh-house-code",
            "payment-document-guid",
            "receiver-guid",
            "provider-name",
            "provider-inn",
            "provider-kpp",
            "amount-by-provider",
            "total-amount-debt-advance",
            "total-amount-with-debt-and-advance",
            "total-amount-with-debt-advance",
        ],
    ]

    // function change_group_tag(old_tag: string, new_tag: string, old_buffer: any) {
    //     if (old_tag == "ExportAccrualsPaymentsPackage") {
    //         buffer_PaymentsPackage.push([old_buffer])
    //     } else if (old_tag == "house") {
    //         buffer_house.push([old_buffer])
    //         buffer_nsi_house.push([buffer_nsi_row])
    //     } else if (old_tag == "communal-rate-consumption") {
    //         buffer_communal_rate_consumption.push([old_buffer])
    //         buffer_nsi_communal.push([buffer_nsi_row])
    //         buffer_communal_rate_criterion.push([buffer_criterion_row])
    //     } else if (old_tag == "standard") {
    //         buffer_standard.push([old_buffer])
    //         buffer_standard_rate.push([buffer_rate_row])
    //     } else if (old_tag == "unified-account") {
    //         buffer_unified_account.push([old_buffer])
    //         buffer_nsi_unified_account.push([buffer_nsi_row])
    //         buffer_payment_unified_account.push([buffer_payment_row])
    //         buffer_payment_service.push([buffer_service_row])
    //         buffer_provider_service.push([buffer_provider_row])
    //     }
    //     return new_tag
    // }

    //Create table
    const start_time = Date.now()
    let file_name = file_path.split("/").pop()?.slice(0, -4);


    var table_name = "content" + "$" + start_time
    table_name = table_name.replaceAll("-", "_")

    // await create_table(table_name)

    const fileStat: any = [];
    fs.stat(file_path, function (err, stats) {

        //Checking for errors
        if (err) {
            console.log(err)
        }
        else {
            //Logging the stats Object
            fileStat.push(stats)
            console.log(stats)
        }
    });

    var xml = fs.readFileSync(file_path);
    const options = {
        ignoreAttributes: true,
        removeNSPrefix: true,
        parseAttributeValue: true
    };

    const parser = new XMLParser(options);

    let jsonObj = parser.parse(xml);
    delete jsonObj[Object.keys(jsonObj)[0]]


    console.log(file_name)


    console.log(start_time)


    var flag_create_table = true


    buffer_PaymentsPackage.push([{
        "ExportAccrualsPaymentsPackage": null,
        "version": jsonObj["ExportAccrualsPaymentsPackage"]["version"],
        "create-date": jsonObj["ExportAccrualsPaymentsPackage"]["create-date"]
    }])
    // var group_tag = current_tag
    // var buffer_id = ""
    // var buffer_root_id = ""
    // var buffer_rate_id = ""
    // var buffer_root_standard_id = ""
    // var buffer_standard_id = ""
    // var buffer_row: any = {}
    // var buffer_nsi_row: any = {}

    for (var elem of jsonObj["ExportAccrualsPaymentsPackage"]["house"]) {
        console.log(elem)


        buffer_house.push([{
            'house': null,
            'fias-house-code': elem.fias_house_code,
            'original-fias-house-code': elem.original_fias_house_code,
            'hm-house-guid': elem["hm-house-guid"],
            'address-string': elem['address-string'],
            
        }])





        buffer_communal_rate_consumption
        buffer_communal_rate_criterion
        buffer_nsi_communal
        buffer_standard
        buffer_standard_rate
        buffer_unified_account
        buffer_nsi_unified_account
        buffer_payment_unified_account
        buffer_payment_service
        buffer_provider_service



        // current_tag = elem
        // if (current_tag == "house" && group_tag! != "house") {
        //     group_tag = change_group_tag(group_tag!, current_tag, buffer_row)
        //     buffer_row = {}
        //     buffer_nsi_row = {}
        // }
        // else if (current_tag == "communal-rate-consumption") {
        //     if (group_tag! != "communal-rate-consumption") {
        //         group_tag = change_group_tag(group_tag!, current_tag, buffer_row)
        //         buffer_id = buffer_row["fias-house-code"]
        //         if (buffer_row["root_rate_guid"]) {
        //             buffer_root_id = buffer_row["root_rate_guid"]
        //             buffer_rate_id = buffer_row["rate_guid"]
        //         }
        //         buffer_row = {}
        //         buffer_nsi_row = {}
        //         var buffer_criterion_row: any = {}
        //     }
        //     if (buffer_row) {
        //         buffer_communal_rate_consumption.push([buffer_row])
        //         buffer_nsi_communal.push([buffer_nsi_row])
        //         buffer_communal_rate_criterion.push([buffer_criterion_row])
        //     }
        //     buffer_row = {}
        //     buffer_row["jkh-house-code"] = buffer_id!
        //     buffer_nsi_row = {}
        //     buffer_nsi_row["jkh-house-code"] = buffer_id!
        //     buffer_criterion_row = {}
        //     buffer_criterion_row["root_rate_guid"] = buffer_root_id!
        //     buffer_criterion_row["rate_guid"] = buffer_rate_id!
        // }
        // else if (current_tag == "standard") {
        //     if (group_tag! != "standard") {
        //         group_tag = change_group_tag(group_tag!, current_tag, buffer_row)
        //         if (buffer_row.get("root_standard_guid")) {
        //             buffer_root_standard_id = buffer_row["root_standard_guid"]
        //             buffer_standard_id = buffer_row["standard_guid"]
        //         }
        //         buffer_row = {}
        //         var buffer_rate_row: any = {}
        //     }
        //     if (buffer_row) {
        //         buffer_standard.push([buffer_row])
        //         buffer_standard_rate.push([buffer_rate_row!])
        //     }
        //     buffer_row = {}
        //     buffer_row["jkh-house-code"] = buffer_id!
        //     buffer_rate_row = {}
        //     buffer_rate_row["jkh-house-code"] = buffer_id!
        //     buffer_rate_row["root_standard_guid"] = buffer_root_standard_id!
        //     buffer_rate_row["standard_guid"] = buffer_standard_id!
        // }
        // else if (current_tag == "unified-account") {
        //     if (group_tag! != "unified-account") {
        //         group_tag = change_group_tag(group_tag!, current_tag, buffer_row)
        //         buffer_row = {}
        //         buffer_nsi_row = {}
        //         var buffer_payment_row: any = {}
        //         var buffer_service_row: any = {}
        //         var buffer_provider_row: any = {}
        //     }
        //     if (buffer_row) {
        //         buffer_unified_account.push([buffer_row])
        //         buffer_nsi_unified_account.push([buffer_nsi_row!])
        //         buffer_payment_unified_account.push([buffer_payment_row!])
        //         buffer_payment_service.push([buffer_service_row!])
        //         buffer_provider_service.push([buffer_provider_row!])
        //     }
        //     buffer_row = {}
        //     buffer_row["jkh-house-code"] = buffer_id!
        //     buffer_nsi_row = {}
        //     buffer_nsi_row["jkh-house-code"] = buffer_id!
        //     buffer_payment_row = {}
        //     buffer_payment_row["jkh-house-code"] = buffer_id!
        //     buffer_service_row = {}
        //     buffer_service_row["jkh-house-code"] = buffer_id!
        //     buffer_provider_row = {}
        //     buffer_provider_row["jkh-house-code"] = buffer_id!
        // }
        // if (group_tag! == "ExportAccrualsPaymentsPackage") {
        //     if (buffer_PaymentsPackage[1].indexOf(group_tag) != -1)
        //         buffer_row[current_tag] = jsonObj["ExportAccrualsPaymentsPackage"][elem]
        //     else
        //         buffer_PaymentsPackage[0] = { current_tag: elem }
        // }
        // else if (group_tag! == "house") {
        //     if (buffer_house[1].indexOf(current_tag) != -1) {
        //         if (buffer_nsi_house[0].indexOf(current_tag) != -1) {
        //             if (
        //                 buffer_id! != ""
        //                 && buffer_nsi_row["jkh-house-code"] != buffer_id!
        //             ) {
        //                 buffer_nsi_row["jkh-house-code"] = buffer_id!
        //                 for (let buffer = 0; buffer < buffer_nsi_house[1].length; buffer++) {
        //                     buffer_nsi_house[1][buffer]["jkh-house-code"] = buffer_nsi_house[1][buffer]["jkh-house-code"]
        //                 }
        //             }
        //             buffer_nsi_row["link_name"] = nsi_tag!
        //             buffer_nsi_row[current_tag] = jsonObj["ExportAccrualsPaymentsPackage"][elem]
        //         }
        //         else {
        //             for (var text of jsonObj["ExportAccrualsPaymentsPackage"][elem]) {
        //                 buffer_row[current_tag] = jsonObj["ExportAccrualsPaymentsPackage"][elem]
        //                 var nsi_tag = current_tag
        //             }
        //         }
        //     }
        //     else
        //         buffer_house[0] = { current_tag: elem }
        // }
        // else if (group_tag! == "communal-rate-consumption") {
        //     if (current_tag in buffer_communal_rate_consumption[1]) {
        //         if (current_tag in buffer_nsi_communal[0]) {
        //             buffer_nsi_row["link_name"] = nsi_tag!
        //             buffer_nsi_row[current_tag] = elem
        //         }
        //         else if (current_tag in buffer_communal_rate_criterion[0]) {
        //             buffer_criterion_row["link_name"] = nsi_tag!
        //             buffer_criterion_row[current_tag] = elem
        //         }
        //         else {
        //             if (
        //                 nsi_tag! in ["rate-guid", "component-one", "territory-oktmo"]
        //                 && current_tag == "name"
        //             ) {
        //                 current_tag = nsi_tag! + "_" + current_tag
        //             }
        //             buffer_row[current_tag] = elem
        //             nsi_tag = current_tag
        //         }
        //     }
        //     else
        //         buffer_communal_rate_consumption[0] = { current_tag: elem }
        // }
        // else if (group_tag! == "standard") {
        //     if (current_tag in buffer_standard[1]) {
        //         if (current_tag in buffer_standard_rate[0])
        //             buffer_rate_row[current_tag] = elem
        //         else {
        //             buffer_row[current_tag] = elem
        //             nsi_tag = current_tag
        //         }
        //     }
        //     else
        //         buffer_standard[0] = { current_tag: elem };
        // }
        // else if (group_tag! == "unified-account") {
        //     if (current_tag in buffer_unified_account[1]) {
        //         if (current_tag in buffer_payment_unified_account[0]) {
        //             if (current_tag == "payment-document-guid")
        //                 var payment_tag = elem
        //             buffer_payment_row[current_tag] = elem
        //         }
        //         else if (current_tag in buffer_nsi_unified_account[0]) {
        //             buffer_nsi_row["link_name"] = nsi_tag!
        //             buffer_nsi_row[current_tag] = elem
        //         }
        //         else if (current_tag in buffer_payment_service[0]) {
        //             buffer_service_row["payment-document-guid"] = payment_tag!
        //             buffer_service_row[current_tag] = elem
        //         }
        //         else if (current_tag in buffer_provider_service[0]) {
        //             buffer_provider_row["payment-document-guid"] = payment_tag!
        //             buffer_provider_row[current_tag] = elem
        //         }
        //         else {
        //             buffer_row[current_tag] = elem
        //             nsi_tag = current_tag
        //         }
        //     }
        //     else
        //         buffer_unified_account[0] = { current_tag: elem };
        // }
        // change_group_tag(group_tag!, "", buffer_row!)
    }




    if (flag_create_table) {
        flag_create_table = false
        create_table(table_name)
    }
    if (buffer_PaymentsPackage) {
        bulk_insert(table_name, true, buffer_PaymentsPackage, 1000)
        buffer_PaymentsPackage = [];
    }
    if (buffer_house) {
        bulk_insert(table_name + "$HOUSE", true, buffer_house, 1000)
        buffer_house = [];
    }
    if (buffer_nsi_house) {
        bulk_insert(table_name + "$NSI_HOUSE", true, buffer_nsi_house, 1000)
        buffer_nsi_house = [];
    }
    if (buffer_communal_rate_consumption) {
        bulk_insert(
            table_name + "$communal_rate_consumption",
            true,
            buffer_communal_rate_consumption,
            1000,
        )
        buffer_communal_rate_consumption = [];
    }
    if (buffer_communal_rate_criterion) {
        bulk_insert(
            table_name + "$communal_rate_criterion",
            false,
            buffer_communal_rate_criterion,
            1000,
        )
        buffer_communal_rate_criterion = [];
    }
    if (buffer_nsi_communal) {
        bulk_insert(table_name + "$nsi_communal", true, buffer_nsi_communal, 1000)
        buffer_nsi_communal = [];
    }
    if (buffer_standard) {
        bulk_insert(table_name + "$standard", true, buffer_standard, 1000)
        buffer_standard = [];
    }
    if (buffer_standard_rate) {
        bulk_insert(table_name + "$standard_rate", true, buffer_standard_rate, 1000)
        buffer_standard_rate = [];
    }
    if (buffer_unified_account) {
        bulk_insert(table_name + "$unified_account", true, buffer_unified_account, 1000)
        buffer_unified_account = [];
    }
    if (buffer_nsi_unified_account) {
        bulk_insert(
            table_name + "$nsi_unified_account", false, buffer_nsi_unified_account, 1000
        )
        buffer_nsi_unified_account = [];
    }
    if (buffer_payment_unified_account) {
        bulk_insert(
            table_name + "$payment_unified_account",
            false,
            buffer_payment_unified_account,
            1000,
        )
        buffer_payment_unified_account = [];
    }
    if (buffer_payment_service) {

    }
    bulk_insert(
        table_name + "$payment_service", false, buffer_payment_service, 1000
    )
    buffer_payment_service = []
    if (buffer_provider_service) {
        bulk_insert(
            table_name + "$provider_service", false, buffer_provider_service, 1000
        )
        buffer_provider_service = [];
    }

    // конечное время
    const end_time = Date.now()

    // разница между конечным и начальным временем
    console.log("Elapsed time: ", end_time - start_time * 7000 / 60 / 60 / 24)
}


// Ресет бафферов к дефолтным значениям
const resetBuffers = function (buffer_provider_service: any) {
    const cleanBuffer = JSON.parse(JSON.stringify([[]]));
    return cleanBuffer;
};



export default async function parseContentLoaderDirectory(directory_path: string = "files") {
    const normalizedPath = require("path").join(__dirname, directory_path);
    const fileNames = await fs.promises.readdir(normalizedPath);
    for (let file of fileNames) {
        await parseContentLoader(`${normalizedPath}/${file}`);
    }
};