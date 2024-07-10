import parser_csv from "./parser_csv";
import parseXlsxDirectory from "./parser_xlsx/parser_xlsx";

import parseGUXmlDirectory from "./parser_gu_xml/parser_gu_xml"
import parseGarZIP from "./gar_parser";

const parsers = {
    parser_csv,
    parseXlsxDirectory,
    parseGUXmlDirectory,
    parseGarZIP
};

export default parsers;