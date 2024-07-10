import os
import re
import sys
import time
import xml.etree.ElementTree as ET
from datetime import datetime

sys.path.append("srvParser")

import json

import utils

prefix = set()

os.chdir("srvParser/Data")

content = os.listdir(".")


def clear_tag(tag):
    prefix_local = re.match("{.*}", tag)
    prefix.add(prefix_local.group())
    return re.sub("{.*}", "", tag)


def change_group_tag(old_tag, new_tag, old_buffer):
    if old_tag == "ExportAccrualsPaymentsPackage":
        buffer_PaymentsPackage.append([old_buffer])
    elif old_tag == "house":
        buffer_house.append([old_buffer])
        buffer_nsi_house.append([buffer_nsi_row])
    elif old_tag == "communal-rate-consumption":
        buffer_communal_rate_consumption.append([old_buffer])
        buffer_nsi_communal.append([buffer_nsi_row])
        buffer_communal_rate_criterion.append([buffer_criterion_row])
    elif old_tag == "standard":
        buffer_standard.append([old_buffer])
        buffer_standard_rate.append([buffer_rate_row])
    elif old_tag == "unified-account":
        buffer_unified_account.append([old_buffer])
        buffer_nsi_unified_account.append([buffer_nsi_row])
        buffer_payment_unified_account.append([buffer_payment_row])
        buffer_payment_service.append([buffer_service_row])
        buffer_provider_service.append([buffer_provider_row])
    return new_tag


# Create table
def create_table(table_name):
    connection = utils.connect()
    if not connection:
        raise ("Can`t establish connection to database")
    with connection.cursor() as cursor:
        create_query = f"CREATE TABLE {table_name} ("
        create_query += "ExportAccrualsPaymentsPackage character varying(300),"
        create_query += "version character varying(300),"
        create_query += "create_date character varying(300)"
        create_query += ");"
        cursor.execute(create_query)
        connection.commit()

        create_query = f'CREATE TABLE {table_name+"_error"} ('
        create_query += "UNKNOWN_TAG_JSON character varying(300)"
        create_query += ");"
        cursor.execute(create_query)
        connection.commit()

        create_query = f'CREATE TABLE {table_name+"$HOUSE"} ('
        create_query += "house character varying(300),"
        create_query += "fias-house-code character varying(300),"
        create_query += "original-fias-house-code character varying(300),"
        create_query += "hm-house-guid character varying(300),"
        create_query += "address-string character varying(300),"
        create_query += "house-type character varying(300),"
        create_query += "house-condition character varying(300),"
        create_query += "house-heating-system-type character varying(300),"
        create_query += "hot-water-supply-system-type character varying(300),"
        create_query += "in-house-engineering-drainage-system character varying(300),"
        create_query += (
            "in-house-engineering-cold-water-supply-system character varying(300),"
        )
        create_query += "in-house-engineering-gas-supply-system character varying(300)"
        create_query += ");"
        cursor.execute(create_query.replace("-", "_"))
        connection.commit()

        create_query = f'CREATE TABLE {table_name+"$HOUSE_error"} ('
        create_query += "UNKNOWN_TAG_JSON character varying(300)"
        create_query += ");"
        cursor.execute(create_query)
        connection.commit()

        create_query = f'CREATE TABLE {table_name+"$NSI_HOUSE"} ('
        create_query += "jkh_house_code character varying(300),"
        create_query += "link_name character varying(300),"
        create_query += "code character varying(300),"
        create_query += "guid character varying(300),"
        create_query += "value character varying(300)"
        create_query += ");"
        cursor.execute(create_query)
        connection.commit()

        create_query = f'CREATE TABLE {table_name+"$communal_rate_consumption"} ('
        create_query += "jkh_house_code character varying(300),"
        create_query += "communal-rate-consumption character varying(300),"
        create_query += "root-rate-guid character varying(300),"
        create_query += "rate-guid character varying(300),"
        create_query += "name character varying(300),"
        create_query += "date-begin character varying(300),"
        create_query += "date-end character varying(300),"
        create_query += "nsi-norm-type character varying(300),"
        create_query += "nsi-service-type character varying(300),"
        create_query += "nsi-resource-type character varying(300),"
        create_query += "direction character varying(300),"
        create_query += "components-count character varying(300),"
        create_query += "component-one character varying(300),"
        create_query += "component-two character varying(300),"
        create_query += "tko-consumer-category character varying(300),"
        create_query += "objects-category character varying(300),"
        create_query += "territory-oktmo character varying(300),"
        create_query += "diff-criterion-reference-object character varying(300),"
        create_query += "is-diff-criteria-set character varying(300),"
        create_query += "is-diff-criteria-not-set character varying(300),"
        create_query += "diff-criteria character varying(300)"
        create_query += ");"
        cursor.execute(create_query.replace("-", "_"))
        connection.commit()

        create_query = f'CREATE TABLE {table_name+"$communal_rate_consumption_error"} ('
        create_query += "UNKNOWN_TAG_JSON character varying(300)"
        create_query += ");"
        cursor.execute(create_query)
        connection.commit()

        create_query = f'CREATE TABLE {table_name+"$communal_rate_criterion"} ('
        create_query += "root_rate_guid character varying(300),"
        create_query += "rate_guid character varying(300),"
        create_query += "link_name character varying(300),"
        create_query += "diff-criterion-guid character varying(300),"
        create_query += "type character varying(300),"
        create_query += "operator character varying(300),"
        create_query += "source character varying(300),"
        create_query += "criterion-code character varying(300),"
        create_query += "criterion-name character varying(300),"
        create_query += "logical-value character varying(300),"
        create_query += "integer-value-from character varying(300),"
        create_query += "integer-value-to character varying(300),"
        create_query += "real-value-from character varying(300),"
        create_query += "other-diff-criterion character varying(300),"
        create_query += "diff-criterion-reference-object character varying(300),"
        create_query += "reference-code character varying(300),"
        create_query += "nsi-code character varying(300),"
        create_query += "nsi-name character varying(300)"
        create_query += ");"
        cursor.execute(create_query.replace("-", "_"))
        connection.commit()

        create_query = f'CREATE TABLE {table_name+"$nsi_communal"} ('
        create_query += "jkh_house_code character varying(300),"
        create_query += "link_name character varying(300),"
        create_query += "code character varying(300),"
        create_query += "guid character varying(300),"
        create_query += "value character varying(300)"
        create_query += ");"
        cursor.execute(create_query.replace("-", "_"))
        connection.commit()

        create_query = f'CREATE TABLE {table_name+"$standard"} ('
        create_query += "jkh_house_code character varying(300),"
        create_query += "standard character varying(300),"
        create_query += "root-standard-guid character varying(300),"
        create_query += "standard-guid character varying(300),"
        create_query += "date-begin character varying(300),"
        create_query += "date-end character varying(300),"
        create_query += "territory-oktmo character varying(300),"
        create_query += "standard-rate character varying(300),"
        create_query += "all-categories character varying(300),"
        create_query += "categories character varying(300)"
        create_query += ");"
        cursor.execute(create_query.replace("-", "_"))
        connection.commit()

        create_query = f'CREATE TABLE {table_name+"$standard_error"} ('
        create_query += "UNKNOWN_TAG_JSON character varying(300)"
        create_query += ");"
        cursor.execute(create_query)
        connection.commit()

        create_query = f'CREATE TABLE {table_name+"$standard_rate"} ('
        create_query += "jkh_house_code character varying(300),"
        create_query += "root-standard-guid character varying(300),"
        create_query += "standard-guid character varying(300),"
        create_query += "code character varying(300),"
        create_query += "name character varying(300),"
        create_query += "size character varying(300),"
        create_query += "measure character varying(300),"
        create_query += "is-diff-criteria-not-set character varying(300),"
        create_query += "diff-criteria character varying(300)"
        create_query += ");"
        cursor.execute(create_query.replace("-", "_"))
        connection.commit()

        create_query = f'CREATE TABLE {table_name+"$unified_account"} ('
        create_query += "jkh_house_code character varying(300),"
        create_query += "unified-account character varying(300),"
        create_query += "unified-account-number character varying(300),"
        create_query += "object character varying(300),"
        create_query += "premise character varying(300),"
        create_query += "premise-guid character varying(300),"
        create_query += "category character varying(300),"
        create_query += "whole-house character varying(300),"
        create_query += "room character varying(300),"
        create_query += "room-guid character varying(300),"
        create_query += "number character varying(300),"
        create_query += "accrual character varying(300),"
        create_query += "payment-document character varying(300),"
        create_query += "service-provider character varying(300),"
        create_query += "service character varying(300)"
        create_query += ");"
        cursor.execute(create_query.replace("-", "_"))
        connection.commit()

        create_query = f'CREATE TABLE {table_name+"$unified_account_error"} ('
        create_query += "UNKNOWN_TAG_JSON character varying(300)"
        create_query += ");"
        cursor.execute(create_query)
        connection.commit()

        create_query = f'CREATE TABLE {table_name+"$nsi_unified_account"} ('
        create_query += "jkh_house_code character varying(300),"
        create_query += "link_name character varying(300),"
        create_query += "code character varying(300),"
        create_query += "guid character varying(300),"
        create_query += "value character varying(300)"
        create_query += ");"
        cursor.execute(create_query.replace("-", "_"))
        connection.commit()

        create_query = f'CREATE TABLE {table_name+"$payment_unified_account"} ('
        create_query += "jkh_house_code character varying(300),"
        create_query += "payment-document-guid character varying(300),"
        create_query += "payment-document-id character varying(300),"
        create_query += "payment-document-type character varying(300),"
        create_query += "payment-document-number character varying(300),"
        create_query += "service-id character varying(300),"
        create_query += "account-number character varying(300),"
        create_query += "account-status character varying(300),"
        create_query += "period character varying(300),"
        create_query += "invoice-date character varying(300),"
        create_query += "total-amount character varying(300),"
        create_query += "use-total-amount-with-debt-and-advance character varying(300),"
        create_query += "total-amount-with-debt-and-advance character varying(300)"
        create_query += ");"
        cursor.execute(create_query.replace("-", "_"))
        connection.commit()

        create_query = f'CREATE TABLE {table_name+"$payment_service"} ('
        create_query += "jkh_house_code character varying(300),"
        create_query += "payment-document-guid character varying(300),"
        create_query += "guid character varying(300),"
        create_query += "main-municipal-service character varying(300),"
        create_query += "municipal-resource character varying(300),"
        create_query += "resource-type character varying(300),"
        create_query += "service-type character varying(300),"
        create_query += "charge-type character varying(300),"
        create_query += "total-amount character varying(300),"
        create_query += "amount-by-service character varying(300),"
        create_query += "tariff character varying(300),"
        create_query += "amount character varying(300),"
        create_query += "individual-consumption-norm character varying(300),"
        create_query += "okei character varying(300),"
        create_query += "code character varying(300),"
        create_query += "name character varying(300),"
        create_query += "volume character varying(300),"
        create_query += "type character varying(300),"
        create_query += "consumption-measure-type character varying(300),"
        create_query += "consumption character varying(300)"
        create_query += ");"
        cursor.execute(create_query.replace("-", "_"))
        connection.commit()

        create_query = f'CREATE TABLE {table_name+"$provider_service"} ('
        create_query += "jkh_house_code character varying(300),"
        create_query += "payment-document-guid character varying(300),"
        create_query += "receiver-guid character varying(300),"
        create_query += "provider-name character varying(300),"
        create_query += "provider-inn character varying(300),"
        create_query += "provider-kpp character varying(300),"
        create_query += "amount-by-provider character varying(300),"
        create_query += "total-amount-debt-advance character varying(300),"
        create_query += "total-amount-with-debt-and-advance character varying(300),"
        create_query += "total-amount-with-debt-advance character varying(300)"
        create_query += ");"
        cursor.execute(create_query.replace("-", "_"))
        connection.commit()


def bulk_insert(table_name, isBox, buffer_save, chunk):
    connection = utils.connect()
    if not connection:
        raise ("Can`t establish connection to database")
    if len(buffer_save) > (1 + isBox):
        with connection.cursor() as cursor:
            insert_field = ""
            insert_value = ""
            insert_query = f"INSERT INTO {table_name} ("
            for key in buffer_save[isBox]:
                if isBox and key == "code":
                    break
                insert_field += key + ","
            insert_field = insert_field.replace("-", "_")[:-1]
            insert_query += insert_field
            insert_query += ") VALUES ("
            repeat = chunk
            repeat_query = insert_query
            for j in range(1 + isBox, len(buffer_save)):
                for key in buffer_save[isBox]:
                    if isBox and key == "code":
                        break
                    value = str(buffer_save[j][0].get(key, "NULL")).replace("'", "")
                    insert_value += (
                        ("" if value == "NULL" else "'")
                        + value
                        + ("" if value == "NULL" else "'")
                        + ","
                    )
                insert_value = insert_value[:-1]
                insert_value += "),("
                if j == repeat:
                    insert_query += insert_value[:-3]
                    insert_query += ");"
                    cursor.execute(insert_query)
                    connection.commit()
                    repeat += chunk
                    insert_query = repeat_query
                    insert_value = ""
            insert_value = insert_value[:-3]
            insert_query = f"INSERT INTO {table_name} ("
            insert_query += insert_field
            insert_query += ") VALUES ("
            insert_query += insert_value
            insert_query += ");"
            cursor.execute(insert_query)
            connection.commit()
            if isBox and len(buffer_save[0]):
                insert_query = f'INSERT INTO {table_name+"_error"} ('
                insert_query += "unknown_tag_json"
                insert_query += ") VALUES ('"
                insert_query += json.dumps(buffer_save[0])
                insert_query += "');"
                cursor.execute(insert_query)
                connection.commit()
        connection.close()


start_time = time.time()
xml_files = []
for file in content:
    if (
        os.path.isfile(os.path.join(".", file))
        #        and file == "TEST_content.xml"
        and file.endswith(".xml")
        and file.startswith("content")
    ):
        xml_files.append(file)

# xml_files.append("content0.xml")

print(xml_files)

count_print = 0

for file_name in xml_files:
    tree = ET.parse(file_name)
    root = tree.getroot()

    buffer_PaymentsPackage = [
        {},
        ["ExportAccrualsPaymentsPackage", "version", "create-date"],
    ]
    buffer_house = [
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

    buffer_nsi_house = [
        [
            "jkh-house-code",
            "link_name",
            "code",
            "guid",
            "value",
        ],
    ]

    buffer_communal_rate_consumption = [
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

    buffer_communal_rate_criterion = [
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

    buffer_nsi_communal = [
        [
            "jkh-house-code",
            "link_name",
            "code",
            "guid",
            "value",
        ],
    ]

    buffer_standard = [
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

    buffer_standard_rate = [
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

    buffer_unified_account = [
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
            "payment-document",  #
            "service-provider",  #
            "service",  #
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

    buffer_nsi_unified_account = [
        [
            "jkh-house-code",
            "link_name",
            "code",
            "guid",
            "value",
        ],
    ]

    buffer_payment_unified_account = [
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

    buffer_payment_service = [
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

    buffer_provider_service = [
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

    print(file_name)
    file_time = str(
        datetime.fromtimestamp(os.path.getmtime(file_name)).strftime(
            "%d_%m_%Y %H:%M:%S"
        )
    ).replace(" ", "$")
    print(file_time)

    table_name = file_name[:-4] + "$" + file_time.replace(":", "_")
    table_name = table_name.replace("-", "_")
    flag_create_table = True

    for elem in root.iter():
        current_tag = clear_tag(elem.tag)
        if current_tag == "ExportAccrualsPaymentsPackage":
            group_tag = current_tag
            buffer_id = ""
            buffer_root_id = ""
            buffer_rate_id = ""
            buffer_root_standard_id = ""
            buffer_standard_id = ""
            buffer_row = {}
            buffer_nsi_row = {}
        elif current_tag == "house" and group_tag != "house":
            group_tag = change_group_tag(group_tag, current_tag, buffer_row)
            buffer_row = {}
            buffer_nsi_row = {}
        elif current_tag == "communal-rate-consumption":
            if group_tag != "communal-rate-consumption":
                group_tag = change_group_tag(group_tag, current_tag, buffer_row)
                buffer_id = buffer_row["fias-house-code"]
                if buffer_row.get("root_rate_guid"):
                    buffer_root_id = buffer_row["root_rate_guid"]
                    buffer_rate_id = buffer_row["rate_guid"]
                buffer_row = {}
                buffer_nsi_row = {}
                buffer_criterion_row = {}
            if buffer_row:
                buffer_communal_rate_consumption.append([buffer_row])
                buffer_nsi_communal.append([buffer_nsi_row])
                buffer_communal_rate_criterion.append([buffer_criterion_row])
            buffer_row = {}
            buffer_row["jkh-house-code"] = buffer_id
            buffer_nsi_row = {}
            buffer_nsi_row["jkh-house-code"] = buffer_id
            buffer_criterion_row = {}
            buffer_criterion_row["root_rate_guid"] = buffer_root_id
            buffer_criterion_row["rate_guid"] = buffer_rate_id
        elif current_tag == "standard":
            if group_tag != "standard":
                group_tag = change_group_tag(group_tag, current_tag, buffer_row)
                if buffer_row.get("root_standard_guid"):
                    buffer_root_standard_id = buffer_row["root_standard_guid"]
                    buffer_standard_id = buffer_row["standard_guid"]
                buffer_row = {}
                buffer_rate_row = {}
            if buffer_row:
                buffer_standard.append([buffer_row])
                buffer_standard_rate.append([buffer_rate_row])
            buffer_row = {}
            buffer_row["jkh-house-code"] = buffer_id
            buffer_rate_row = {}
            buffer_rate_row["jkh-house-code"] = buffer_id
            buffer_rate_row["root_standard_guid"] = buffer_root_standard_id
            buffer_rate_row["standard_guid"] = buffer_standard_id
        elif current_tag == "unified-account":
            if group_tag != "unified-account":
                group_tag = change_group_tag(group_tag, current_tag, buffer_row)
                buffer_row = {}
                buffer_nsi_row = {}
                buffer_payment_row = {}
                buffer_service_row = {}
                buffer_provider_row = {}
            if buffer_row:
                buffer_unified_account.append([buffer_row])
                buffer_nsi_unified_account.append([buffer_nsi_row])
                buffer_payment_unified_account.append([buffer_payment_row])
                buffer_payment_service.append([buffer_service_row])
                buffer_provider_service.append([buffer_provider_row])
            buffer_row = {}
            buffer_row["jkh-house-code"] = buffer_id
            buffer_nsi_row = {}
            buffer_nsi_row["jkh-house-code"] = buffer_id
            buffer_payment_row = {}
            buffer_payment_row["jkh-house-code"] = buffer_id
            buffer_service_row = {}
            buffer_service_row["jkh-house-code"] = buffer_id
            buffer_provider_row = {}
            buffer_provider_row["jkh-house-code"] = buffer_id
        # ------------------------------------------------------------------------------------
        if group_tag == "ExportAccrualsPaymentsPackage":
            if current_tag in buffer_PaymentsPackage[1]:
                buffer_row[current_tag] = elem.text
            else:
                buffer_PaymentsPackage[0].setdefault(current_tag, elem.text)
        elif group_tag == "house":
            if current_tag in buffer_house[1]:
                if current_tag in buffer_nsi_house[0]:
                    if (
                        buffer_id != ""
                        and buffer_nsi_row.get("jkh-house-code", "") != buffer_id
                    ):
                        buffer_nsi_row["jkh-house-code"] = buffer_id
                        for buffer in range(len(buffer_nsi_house[1])):
                            buffer_nsi_house[1][buffer]["jkh-house-code"] = (
                                buffer_nsi_house[
                                    1
                                ][buffer].get("jkh-house-code", buffer_id)
                            )
                    buffer_nsi_row["link_name"] = nsi_tag
                    buffer_nsi_row[current_tag] = elem.text
                else:
                    buffer_row[current_tag] = elem.text
                    nsi_tag = current_tag
            else:
                buffer_house[0].setdefault(current_tag, elem.text)
        elif group_tag == "communal-rate-consumption":
            if current_tag in buffer_communal_rate_consumption[1]:
                if current_tag in buffer_nsi_communal[0]:
                    buffer_nsi_row["link_name"] = nsi_tag
                    buffer_nsi_row[current_tag] = elem.text
                elif current_tag in buffer_communal_rate_criterion[0]:
                    buffer_criterion_row["link_name"] = nsi_tag
                    buffer_criterion_row[current_tag] = elem.text
                else:
                    if (
                        nsi_tag in ("rate-guid", "component-one", "territory-oktmo")
                        and current_tag == "name"
                    ):
                        current_tag = nsi_tag + "_" + current_tag
                    buffer_row[current_tag] = elem.text
                    nsi_tag = current_tag
            else:
                buffer_communal_rate_consumption[0].setdefault(current_tag, elem.text)
        elif group_tag == "standard":
            if current_tag in buffer_standard[1]:
                if current_tag in buffer_standard_rate[0]:
                    buffer_rate_row[current_tag] = elem.text
                else:
                    buffer_row[current_tag] = elem.text
                    nsi_tag = current_tag
            else:
                buffer_standard[0].setdefault(current_tag, elem.text)
        elif group_tag == "unified-account":
            if current_tag in buffer_unified_account[1]:
                if current_tag in buffer_payment_unified_account[0]:
                    if current_tag == "payment-document-guid":
                        payment_tag = elem.text
                    buffer_payment_row[current_tag] = elem.text
                elif current_tag in buffer_nsi_unified_account[0]:
                    buffer_nsi_row["link_name"] = nsi_tag
                    buffer_nsi_row[current_tag] = elem.text
                elif current_tag in buffer_payment_service[0]:
                    buffer_service_row["payment-document-guid"] = payment_tag
                    buffer_service_row[current_tag] = elem.text
                elif current_tag in buffer_provider_service[0]:
                    buffer_provider_row["payment-document-guid"] = payment_tag
                    buffer_provider_row[current_tag] = elem.text
                else:
                    buffer_row[current_tag] = elem.text
                    nsi_tag = current_tag
            else:
                buffer_unified_account[0].setdefault(current_tag, elem.text)

    change_group_tag(group_tag, None, buffer_row)

    if flag_create_table:
        flag_create_table = False
        create_table(table_name)
    if buffer_PaymentsPackage:
        bulk_insert(table_name, True, buffer_PaymentsPackage, 1000)
        buffer_PaymentsPackage.clear()
    if buffer_house:
        bulk_insert(table_name + "$HOUSE", True, buffer_house, 1000)
        buffer_house.clear()
    if buffer_nsi_house:
        bulk_insert(table_name + "$NSI_HOUSE", False, buffer_nsi_house, 1000)
        buffer_nsi_house.clear()
    if buffer_communal_rate_consumption:
        bulk_insert(
            table_name + "$communal_rate_consumption",
            True,
            buffer_communal_rate_consumption,
            1000,
        )
        buffer_communal_rate_consumption.clear()
    if buffer_communal_rate_criterion:
        bulk_insert(
            table_name + "$communal_rate_criterion",
            False,
            buffer_communal_rate_criterion,
            1000,
        )
        buffer_communal_rate_criterion.clear()
    if buffer_nsi_communal:
        bulk_insert(table_name + "$nsi_communal", False, buffer_nsi_communal, 1000)
        buffer_nsi_communal.clear()
    if buffer_standard:
        bulk_insert(table_name + "$standard", True, buffer_standard, 1000)
        buffer_standard.clear()
    if buffer_standard_rate:
        bulk_insert(table_name + "$standard_rate", False, buffer_standard_rate, 1000)
        buffer_standard_rate.clear()
    if buffer_unified_account:
        bulk_insert(table_name + "$unified_account", True, buffer_unified_account, 1000)
        buffer_unified_account.clear()
    if buffer_nsi_unified_account:
        bulk_insert(
            table_name + "$nsi_unified_account", False, buffer_nsi_unified_account, 1000
        )
        buffer_nsi_unified_account.clear()
    if buffer_payment_unified_account:
        bulk_insert(
            table_name + "$payment_unified_account",
            False,
            buffer_payment_unified_account,
            1000,
        )
        buffer_payment_unified_account.clear()
    if buffer_payment_service:
        bulk_insert(
            table_name + "$payment_service", False, buffer_payment_service, 1000
        )
        buffer_payment_service.clear()
    if buffer_provider_service:
        bulk_insert(
            table_name + "$provider_service", False, buffer_provider_service, 1000
        )
        buffer_provider_service.clear()

# конечное время
end_time = time.time()

# разница между конечным и начальным временем
elapsed_time = end_time - start_time
print("Elapsed time: ", elapsed_time * 7000 / 60 / 60 / 24)
