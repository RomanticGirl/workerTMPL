import parser_csv from "./parser_csv";
import parseXlsxDirectory from "./parser_xlsx/parser_xlsx";

import parseGUXmlDirectory from "./parser_gu_xml/parser_gu_xml"
import parseGarZIP from "./gar_parser";
import parseContentLoaderDirectory from "./loader_content";

const parsers = {
    parser_csv,
    parseXlsxDirectory,
    parseGUXmlDirectory,
    parseGarZIP,
    parseContentLoaderDirectory
};

export default parsers;