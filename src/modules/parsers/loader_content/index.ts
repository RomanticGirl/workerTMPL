import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import { bulk_insert, create_table } from "./parser_content_xml_queries";


const parseContentLoader = async function (file_path: string) {

    var buffer_PaymentsPackage: any = [
        ["ExportAccrualsPaymentsPackage", "version", "create-date", "file_name"],
    ]
    var buffer_house: any = [
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
            // "code",
            // "guid",
            // "value",
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

    var buffer_communal_rate_consumption: any = [
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

    var buffer_standard: any = [
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

    var buffer_unified_account: any = [
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
        ],
    ]

    var buffer_nsi_unified_account: any = [
        [
            "jkh-house-code",
            "link_name",
            "code",
            "guid",
            "value",
            "service_guid"
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


    //Create table
    const start_time = Date.now()
    let file_name = file_path.split("/").pop()?.slice(0, -4);

    var table_name = "content" + file_name!.slice(0, 8)
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
        "ExportAccrualsPaymentsPackage": "None",
        "version": jsonObj["ExportAccrualsPaymentsPackage"]["version"],
        "create-date": jsonObj["ExportAccrualsPaymentsPackage"]["create-date"],
        "file_name": file_name
    }])

    for (var elem of jsonObj["ExportAccrualsPaymentsPackage"]["house"]) {

        console.log(elem)

        buffer_house.push([{
            'house': elem ? 'None' : null,
            'fias-house-code': elem['fias-house-code'],
            'original-fias-house-code': elem['original-fias-house-code'],
            'hm-house-guid': elem["hm-house-guid"],
            'address-string': elem['address-string'],
            'house-type': elem['house-type'] ? 'None' : null,
            'house-condition': elem['house-condition'] ? 'None' : null,
            'house-heating-system-type': elem['house-heating-system-type'] ? 'None' : null,
            'hot-water-supply-system-type': elem['hot-water-supply-system-type'] ? 'None' : null,
            'in-house-engineering-drainage-system': elem['in-house-engineering-drainage-system'] ? 'None' : null,
            'in-house-engineering-cold-water-supply-system': elem['in-house-engineering-cold-water-supply-system'] ? 'None' : null,
            'in-house-engineering-gas-supply-system': elem['in-house-engineering-gas-supply-system'] ? 'None' : null,
        }])
        Object.keys(elem).forEach((el) => {
            if (typeof elem[el] === 'object' && !Array.isArray(elem.el) && elem.el !== null) {
                buffer_nsi_house.push([{
                    "jkh-house-code": elem['fias-house-code'],
                    "link_name": el,
                    "code": elem[el].code,
                    "guid": elem[el].guid,
                    "value": elem[el].value,
                }])
            }
        })
        for (let i = 0; i < elem["communal-rate-consumption"].length; i++) {
            const tempoElem = elem["communal-rate-consumption"][i];
            buffer_communal_rate_consumption.push([{
                "jkh-house-code": elem['fias-house-code'],
                "communal-rate-consumption": tempoElem ? 'None' : null,
                "root-rate-guid": tempoElem["root-rate-guid"],
                "rate-guid": tempoElem["rate-guid"],
                "name": tempoElem["name"],
                "date-begin": tempoElem["date-begin"],
                "date-end": tempoElem["date-end"] || null,
                "nsi-norm-type": tempoElem["nsi-norm-type"] ? 'None' : null,
                "nsi-service-type": tempoElem["nsi-service-type"] ? 'None' : null,
                "nsi-resource-type": tempoElem["nsi-resource-type"] ? 'None' : null,
                "direction": tempoElem["direction"] || null,
                "components-count": tempoElem["components-count"],
                "component-one": tempoElem["component-one"] ? 'None' : null,
                "component-two": tempoElem["component-two"] ? 'None' : null,
                "tko-consumer-category": tempoElem["tko-consumer-category"] ? 'None' : null,
                "objects-category": tempoElem["objects-category"] ? 'None' : null,
                "territory-oktmo": tempoElem["territory-oktmo"] ? 'None' : null,
                "diff-criterion-reference-object": tempoElem["diff-criterion-reference-object"] ? 'None' : null,
                "is-diff-criteria-set": tempoElem["diff-criteria"] ? 'None' : null,  // бесполезное поле
                "is-diff-criteria-not-set": tempoElem["is-diff-criteria-not-set"] || null,
                "diff-criteria": tempoElem["diff-criteria"] ? 'None' : null,
            }])
            tempoElem["diff-criteria"] ?
                buffer_communal_rate_criterion.push([{
                    "root-rate-guid": tempoElem["root-rate-guid"],
                    "rate-guid": tempoElem["rate-guid"],
                    "link_name": "diff-criteria",
                    "diff-criterion-guid": tempoElem["diff-criteria"]["diff-criterion-guid"],
                    "type": tempoElem["diff-criteria"]["type"],
                    "operator": tempoElem["diff-criteria"]["operator"],
                    "source": tempoElem["diff-criteria"]["source"],
                    "criterion-code": tempoElem["diff-criteria"]["criterion-code"],
                    "criterion-name": tempoElem["diff-criteria"]["criterion-name"],
                    "logical-value": tempoElem["diff-criteria"]["logical-value"],
                    "integer-value-from": tempoElem["diff-criteria"]["integer-value-from"],
                    "integer-value-to": tempoElem["diff-criteria"]["integer-value-to"],
                    "real-value-from": tempoElem["diff-criteria"]["real-value-from"],
                    "other-diff-criterion": tempoElem["diff-criteria"]["other-diff-criterion"] ? 'None' : null,
                    "diff-criterion-reference-object": tempoElem["diff-criteria"]["diff-criterion-reference-object"],
                    "reference-code": tempoElem["diff-criteria"]["reference-code"],
                    "nsi-code": tempoElem["diff-criteria"]["nsi-code"],
                    "nsi-name": tempoElem["diff-criteria"]["nsi-name"],
                }]) : null;
            tempoElem["territory-oktmo"] ?
                buffer_nsi_communal.push([{ // ЕСЛИ БОЛЬШЕ ОДНОГО КОМПОНЕНТА ТО ЧТО
                    "jkh-house-code": elem['fias-house-code'],
                    "link_name": "territory-oktmo",  // ??? 'territory-oktmo'
                    "code": tempoElem["territory-oktmo"]["code"],  // ???
                    "guid": tempoElem["nsi-resource-type"]["guid"],  // ???
                    "value": tempoElem["component-one"]["value"],  // ???
                }]) : null;
        }

        buffer_standard.push([{
            "jkh-house-code": elem['fias-house-code'],
            "standard": elem.standard ? 'None' : null,
            "root-standard-guid": elem.standard["root-standard-guid"],
            "standard-guid": elem.standard["standard-guid"],
            "date-begin": elem.standard["date-begin"],
            "date-end": elem.standard["date-end"],
            "territory-oktmo": elem.standard["territory-oktmo"] ? 'None' : null,
            "all-categories": elem.standard["all-categories"]["all-categories"],
            "categories": elem.standard["categories"] ? 'None' : null, // ??
            "code": elem.standard["territory-oktmo"].code,
            "name": elem.standard["territory-oktmo"].name,
            "size": elem.standard["standard-rate"].size,
            "measure": elem.standard["standard-rate"].measure,
            "is-diff-criteria-not-set": elem.standard["standard-rate"]["is-diff-criteria-not-set"],
            "diff-criteria": elem.standard["diff-criteria"] ? 'None' : null, // ???
        }])
        buffer_standard_rate.push([{
            "jkh-house-code": elem['fias-house-code'],
            "root-standard-guid": elem.standard["root-standard-guid"],
            "standard-guid": elem.standard["standard-guid"],
            "code": elem.standard["territory-oktmo"].code,
            "name": elem.standard["territory-oktmo"].name,
            "size": elem.standard["standard-rate"].size,
            "measure": elem.standard["standard-rate"].measure,
            "is-diff-criteria-not-set": elem.standard["standard-rate"]["is-diff-criteria-not-set"],
            "diff-criteria": elem.standard["diff-criteria"] ? 'None' : null, // ????
        }])

        for (let i = 0; i < elem["unified-account"].length; i++) {
            const tempoElem = elem["unified-account"][i];

            buffer_unified_account.push([{
                "jkh-house-code": elem['fias-house-code'],
                "unified-account": tempoElem ? 'None' : null,
                "unified-account-number": tempoElem["unified-account-number"],
                "object": tempoElem["object"] ? 'None' : null,
                "premise": tempoElem.object.premise ? 'None' : null,
                "premise-guid": tempoElem.object.premise ? tempoElem.object.premise["premise-guid"] : null,
                "category": tempoElem.object.premise ? (tempoElem.object.premise["category"] ? 'None' : null) : null,
                "whole-house": tempoElem.object["whole-house"] || null, //
                "room": tempoElem.object.room ? 'None' : null,
                "room-guid": tempoElem.object.room ? tempoElem.object.room["room-guid"] : null,
                "number": !tempoElem.object["whole-house"] ? (tempoElem.object.room ? tempoElem.object.room["number"] : tempoElem.object.premise["number"]) : null,
                "accrual": tempoElem.accrual ? 'None' : null,
                "payment-document": tempoElem.accrual["payment-document"] ? 'None' : null,
                "service-provider": tempoElem.accrual["payment-document"] ? 'None' : null,
                "service": tempoElem.accrual["payment-document"] ? 'None' : null,
            }])
            for (let j = 0; j < tempoElem.accrual["payment-document"].length; j++) {

                const tempoAccEl = tempoElem.accrual["payment-document"][j]
                if (Array.isArray(tempoAccEl["service"])) {
                    for (let z = 0; z < tempoAccEl["service"].length; z++) {
                        buffer_nsi_unified_account.push([{
                            "jkh-house-code": elem['fias-house-code'],
                            "link_name": "service",
                            "code": tempoAccEl["service"][z]["charge-type"]["code"],
                            "guid": tempoAccEl["service"][z]["charge-type"].guid,
                            "value": tempoAccEl["service"][z]["charge-type"].value,
                            "service_guid": tempoAccEl["service"][z].guid
                        }])
                        buffer_payment_service.push([{
                            "jkh-house-code": elem['fias-house-code'],
                            "payment-document-guid": tempoAccEl["payment-document-guid"],
                            "guid": tempoAccEl["service"][z].guid,
                            "main-municipal-service": elem,
                            "municipal-resource": elem,
                            "resource-type": elem,
                            "service-type": tempoAccEl["service"][z]["service-type"],
                            "charge-type": tempoAccEl["service"][z]["charge-type"] ? 'None' : null,
                            "total-amount": tempoAccEl["service"][z]["total-amount"],
                            "amount-by-service": tempoAccEl["service"][z]["amount-by-service"],
                            "tariff": tempoAccEl["service"][z]["tariff"],
                            "amount": elem,
                            "individual-consumption-norm": elem,
                            "okei": elem,
                            "code": elem,
                            "name": elem,
                            "volume": tempoAccEl["service"][z]["volume"] ? 'None' : null,
                            "type": tempoAccEl["service"][z]["volume"] ? tempoAccEl["service"][z]["volume"]["type"] : null,
                            "consumption-measure-type": tempoAccEl["service"][z]["volume"] ? tempoAccEl["service"][z]["volume"]["consumption-measure-type"] : null,
                            "consumption": tempoAccEl["service"][z]["volume"] ? tempoAccEl["service"][z]["volume"]["consumption"] : null,
                        }])
                    }
                } else {
                    buffer_nsi_unified_account.push([{
                        "jkh-house-code": elem['fias-house-code'],
                        "link_name": "service",
                        "code": tempoAccEl["service"]["charge-type"]["code"],
                        "guid": tempoAccEl["service"]["charge-type"].guid,
                        "value": tempoAccEl["service"]["charge-type"].value,
                        "service_guid": tempoAccEl["service"].guid
                    }])
                    buffer_payment_service.push([{
                        "jkh-house-code": elem['fias-house-code'],
                        "payment-document-guid": tempoAccEl["payment-document-guid"],
                        "guid": tempoAccEl["service"].guid,
                        "main-municipal-service": elem,
                        "municipal-resource": elem,
                        "resource-type": elem,
                        "service-type": tempoAccEl["service"]["service-type"],
                        "charge-type": tempoAccEl["service"]["charge-type"] ? 'None' : null,
                        "total-amount": tempoAccEl["service"]["total-amount"],
                        "amount-by-service": tempoAccEl["service"]["amount-by-service"],
                        "tariff": tempoAccEl["service"]["tariff"],
                        "amount": elem,
                        "individual-consumption-norm": elem,
                        "okei": elem,
                        "code": elem,
                        "name": elem,
                        "volume": tempoAccEl["service"]["volume"] ? 'None' : null,
                        "type": tempoAccEl["service"]["volume"] ? tempoAccEl["service"]["volume"]["type"] : null,
                        "consumption-measure-type": tempoAccEl["service"]["volume"] ? tempoAccEl["service"]["volume"]["consumption-measure-type"] : null,
                        "consumption": tempoAccEl["service"]["volume"] ? tempoAccEl["service"]["volume"]["consumption"] : null,
                    }])
                }

                buffer_payment_unified_account.push([{
                    "jkh-house-code": elem['fias-house-code'],
                    "payment-document-guid": tempoAccEl["payment-document-guid"],
                    "payment-document-id": tempoAccEl["payment-document-id"],
                    "payment-document-type": tempoAccEl["payment-document-type"],
                    "payment-document-number": tempoAccEl["payment-document-number"],
                    "service-id": tempoAccEl["service-id"],
                    "account-number": tempoAccEl["account-number"],
                    "account-status": tempoAccEl["account-status"],
                    "period": tempoAccEl["period"],
                    "invoice-date": tempoAccEl["invoice-date"],
                    "total-amount": tempoAccEl["total-amount"],
                    "use-total-amount-with-debt-and-advance": tempoAccEl["use-total-amount-with-debt-and-advance"],
                    "total-amount-with-debt-and-advance": tempoAccEl["total-amount-with-debt-and-advance"],
                }])



                buffer_provider_service.push([{
                    "jkh-house-code": elem['fias-house-code'],
                    "payment-document-guid": tempoAccEl["payment-document-guid"],
                    "receiver-guid": tempoAccEl["service-provider"]["receiver-guid"],
                    "provider-name": tempoAccEl["service-provider"]["provider-name"],
                    "provider-inn": tempoAccEl["service-provider"]["provider-inn"],
                    "provider-kpp": tempoAccEl["service-provider"],
                    "amount-by-provider": tempoAccEl["service-provider"],
                    "total-amount-debt-advance": tempoAccEl["service-provider"]["total-amount-debt-advance"],
                    "total-amount-with-debt-and-advance": tempoAccEl["service-provider"]["total-amount-with-debt-and-advance"],
                    "total-amount-with-debt-advance": tempoAccEl["service-provider"]["total-amount-with-debt-advance"],
                }])

            }
        }
    }




    if (flag_create_table) {
        flag_create_table = false
        await create_table(table_name)
    }
    if (buffer_PaymentsPackage) {
        await bulk_insert(table_name, true, buffer_PaymentsPackage, 1000)
        buffer_PaymentsPackage = [];
    }
    if (buffer_house) {
        await bulk_insert(table_name + "$HOUSE", true, buffer_house, 1000)
        buffer_house = [];
    }
    if (buffer_nsi_house) {
        await bulk_insert(table_name + "$NSI_HOUSE", true, buffer_nsi_house, 1000)
        buffer_nsi_house = [];
    }
    if (buffer_communal_rate_consumption) {
        await bulk_insert(
            table_name + "$communal_rate_consumption",
            true,
            buffer_communal_rate_consumption,
            1000,
        )
        buffer_communal_rate_consumption = [];
    }
    if (buffer_communal_rate_criterion) {
        await bulk_insert(
            table_name + "$communal_rate_criterion",
            false,
            buffer_communal_rate_criterion,
            1000,
        )
        buffer_communal_rate_criterion = [];
    }
    if (buffer_nsi_communal) {
        await bulk_insert(table_name + "$nsi_communal", true, buffer_nsi_communal, 1000)
        buffer_nsi_communal = [];
    }
    if (buffer_standard) {
        await bulk_insert(table_name + "$standard", true, buffer_standard, 1000)
        buffer_standard = [];
    }
    if (buffer_standard_rate) {
        await bulk_insert(table_name + "$standard_rate", true, buffer_standard_rate, 1000)
        buffer_standard_rate = [];
    }
    if (buffer_unified_account) {
        await bulk_insert(table_name + "$unified_account", true, buffer_unified_account, 1000)
        buffer_unified_account = [];
    }
    if (buffer_nsi_unified_account) {
        await bulk_insert(
            table_name + "$nsi_unified_account", false, buffer_nsi_unified_account, 1000
        )
        buffer_nsi_unified_account = [];
    }
    if (buffer_payment_unified_account) {
        await bulk_insert(
            table_name + "$payment_unified_account",
            false,
            buffer_payment_unified_account,
            1000,
        )
        buffer_payment_unified_account = [];
    }
    if (buffer_payment_service) {

    }
    await bulk_insert(
        table_name + "$payment_service", false, buffer_payment_service, 1000
    )
    buffer_payment_service = []
    if (buffer_provider_service) {
        await bulk_insert(
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