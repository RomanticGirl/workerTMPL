function AS_PARAM(item: any) {
    return {
        id: parseInt(item.$.ID, 10),
        objectid: parseInt(item.$.OBJECTID, 10),
        changeid: parseInt(item.$.CHANGEID, 10),
        changeidend: parseInt(item.$.CHANGEIDEND, 10),
        typeid: parseInt(item.$.TYPEID, 10),
        value: item.$.VALUE,
        updatedate: item.$.UPDATEDATE,
        startdate: item.$.STARTDATE,
        enddate: item.$.ENDDATE,
    };
}

function AS_ADDHOUSE_TYPES(item: any) {
    return {
        id: item.$.ID,
        name: item.$.NAME,
        shortname: item.$.SHORTNAME,
        description: item.$.DESCRIPTION,
        updatedate: item.$.UPDATEDATE,
        startdate: item.$.STARTDATE,
        enddate: item.$.ENDDATE,
        isactive: item.$.ISACTIVE,
    };
}

const xmlMapping = {
        AS_ADDR_OBJ_DIVISION: function (item: any) {
            return {
                id: item.$.ID,
                parentid: item.$.PARENTID,
                childid: item.$.CHILDID,
                changeid: item.$.CHANGEID,
            };
        },

        AS_ADDR_OBJ: function (item: any) {
            return {
                id: item.$.ID,
                objectid: item.$.OBJECTID,
                objectguid: item.$.OBJECTGUID,
                changeid: item.$.CHANGEID,
                name: item.$.NAME,
                typename: item.$.TYPENAME,
                level: item.$.LEVEL,
                opertypeid: item.$.OPERTYPEID,
                previd: item.$.PREVID,
                nextid: item.$.NEXTID,
                updatedate: item.$.UPDATEDATE,
                startdate: item.$.STARTDATE,
                enddate: item.$.ENDDATE,
                isactual: item.$.ISACTUAL,
                isactive: item.$.ISACTIVE
            };
        },

        AS_ADDR_OBJ_PARAMS: function (item: any) {
            return AS_PARAM(item);
        },

        AS_ADDR_OBJ_TYPES: function (item: any) {
            return {
                id: item.$.ID,
                level: item.$.LEVEL,
                shortname: item.$.SHORTNAME,
                name: item.$.NAME,
                description: item.$.DESCRIPTION,
                updatedate: item.$.UPDATEDATE,
                startdate: item.$.STARTDATE,
                enddate: item.$.ENDDATE,
                isactive: item.$.ISACTIVE
            };
        },

        AS_ADM_HIERARCHY: function (item: any) {
            return {
                id: item.$.ID,
                objectid: item.$.OBJECTID,
                parentobjid: item.$.PARENTOBJID,
                changeid: item.$.CHANGEID,
                regioncode: item.$.REGIONCODE,
                areacode: item.$.AREACODE,
                citycode: item.$.CITYCODE,
                placecode: item.$.PLACECODE,
                plancode: item.$.PLANCODE,
                streetcode: item.$.STREETCODE,
                previd: item.$.PREVID,
                nextid: item.$.NEXTID,
                updatedate: item.$.UPDATEDATE,
                startdate: item.$.STARTDATE,
                enddate: item.$.ENDDATE,
                isactive: item.$.ISACTIVE,
                path: item.$.PATH
            };
        },

        AS_APARTMENTS: function (item: any) {
            return {
                id: item.$.ID,
                objectid: item.$.OBJECTID,
                objectguid: item.$.OBJECTGUID,
                changeid: item.$.CHANGEID,
                number: item.$.NUMBER,
                aparttype: item.$.APARTTYPE,
                opertypeid: item.$.OPERTYPEID,
                previd: item.$.PREVID,
                nextid: item.$.NEXTID,
                updatedate: item.$.UPDATEDATE,
                startdate: item.$.STARTDATE,
                enddate: item.$.ENDDATE,
                isactual: item.$.ISACTUAL,
                isactive: item.$.ISACTIVE
            };
        },

        AS_APARTMENTS_PARAMS: function (item: any) {
            return AS_PARAM(item);
        },

        AS_APARTMENT_TYPES: function (item: any) {
            return {
                id: item.$.ID,
                name: item.$.NAME,
                shortname: item.$.SHORTNAME,
                description: item.$.DESCRIPTION,
                updatedate: item.$.UPDATEDATE,
                startdate: item.$.STARTDATE,
                enddate: item.$.ENDDATE,
                isactive: item.$.ISACTIVE
            };
        },

        AS_CARPLACES: function (item: any) {
            return {
                id: item.$.ID,
                objectid: item.$.OBJECTID,
                objectguid: item.$.OBJECTGUID,
                changeid: item.$.CHANGEID,
                number: item.$.NUMBER,
                opertypeid: item.$.OPERTYPEID,
                previd: item.$.PREVID,
                nextid: item.$.NEXTID,
                updatedate: item.$.UPDATEDATE,
                startdate: item.$.STARTDATE,
                enddate: item.$.ENDDATE,
                isactual: item.$.ISACTUAL,
                isactive: item.$.ISACTIVE
            };
        },

        AS_CARPLACES_PARAMS: function (item: any) {
            return AS_PARAM(item);
        },

        AS_CHANGE_HISTORY: function (item: any) {
            return {
                changeid: item.$.CHANGEID,
                objectid: item.$.OBJECTID,
                adrobjectid: item.$.ADROBJECTID,
                opertypeid: item.$.OPERTYPEID,
                ndocid: item.$.NDOCID,
                changedate: item.$.CHANGEDATE
            };
        },

        AS_HOUSES: function (item: any) {
            return {
                id: item.$.ID,
                objectid: item.$.OBJECTID,
                objectguid: item.$.OBJECTGUID,
                changeid: item.$.CHANGEID,
                housenum: item.$.HOUSENUM,
                addnum1: item.$.ADDNUM1,
                addnum2: item.$.ADDNUM2,
                housetype: item.$.HOUSETYPE,
                addtype1: item.$.ADDTYPE1,
                addtype2: item.$.ADDTYPE2,
                opertypeid: item.$.OPERTYPEID,
                previd: item.$.PREVID,
                nextid: item.$.NEXTID,
                updatedate: item.$.UPDATEDATE,
                startdate: item.$.STARTDATE,
                enddate: item.$.ENDDATE,
                isactual: item.$.ISACTUAL,
                isactive: item.$.ISACTIVE
            };
        },

        AS_HOUSES_PARAMS: function (item: any) {
            return AS_PARAM(item);
        },

        AS_ADDHOUSE_TYPES: function (item: any) {
          return  AS_ADDHOUSE_TYPES(item);
        },

        AS_HOUSE_TYPES: function (item: any) {
           return AS_ADDHOUSE_TYPES(item);
        },

        AS_MUN_HIERARCHY: function (item: any) {
            return {
                id: item.$.ID,
                objectid: item.$.OBJECTID,
                parentobjid: item.$.PARENTOBJID,
                changeid: item.$.CHANGEID,
                oktmo: item.$.OKTMO,
                previd: item.$.PREVID,
                nextid: item.$.NEXTID,
                updatedate: item.$.UPDATEDATE,
                startdate: item.$.STARTDATE,
                enddate: item.$.ENDDATE,
                isactive: item.$.ISACTIVE,
                path: item.$.PATH
            };
        },
        AS_NORMATIVE_DOCS: function (item: any) {
            return {
                id: item.$.ID,
                name: item.$.NAME?item.$.NAME:'Значение отсутсвует',
                date: item.$.DATE ? new Date(item.$.DATE).toISOString() : new Date().toISOString(),
                number: item.$.NUMBER,
                type: item.$.TYPE,
                kind: item.$.KIND,
                updateDate: item.$.UPDATEDATE,
                orgName: item.$.ORGNAME,
                regNum: item.$.REGNUM ? new Date(item.$.DATE).toISOString() : new Date().toISOString(),
                regDate: item.$.REGDATE ? new Date(item.$.DATE).toISOString() : new Date().toISOString(),
                accDate: item.$.ACCDATE ? new Date(item.$.DATE).toISOString() : new Date().toISOString(),
                comment: item.$.COMMENT ? item.$.COMMENT: null
            };
        },

        AS_NORMATIVE_DOCS_KINDS: function (item: any) {
            return {
                id: item.$.ID,
                name: item.$.NAME
            }
        },

        AS_NORMATIVE_DOCS_TYPES: function (item: any) {
            return {
                id: item.$.ID,
                name: item.$.NAME,
                startdate: item.$.STARTDATE,
                enddate: item.$.ENDDATE
            }
        },

        AS_OBJECT_LEVELS: function (item: any) {
            return {
                level: item.$.LEVEL,
                name: item.$.NAME,
                shortname: item.$.SHORTNAME,
                updatedate: item.$.UPDATEDATE,
                startdate: item.$.STARTDATE,
                enddate: item.$.ENDDATE,
                isactive: item.$.ISACTIVE
            };
        },

        AS_OPERATION_TYPES: function (item: any) {
            return {
                id: item.$.ID,
                name: item.$.NAME,
                shortname: item.$.SHORTNAME,
                description: item.$.DESCRIPTION,
                updatedate: item.$.UPDATEDATE,
                startdate: item.$.STARTDATE,
                enddate: item.$.ENDDATE,
                isactive: item.$.ISACTIVE
            }
        },

        AS_PARAM_TYPES: function (item: any) {
            return {
                id: item.$.ID,
                name: item.$.NAME,
                code: item.$.CODE,
                description: item.$.DESCRIPTION,
                update_date: item.$.UPDATEDATE,
                start_date: item.$.STARTDATE,
                end_date: item.$.ENDDATE,
                is_active: item.$.ISACTIVE
            }
        },

        AS_REESTR_OBJECTS: function (item: any) {
            return {
                objectid: item.$.OBJECTID,
                createdate: item.$.CREATEDATE,
                changeid: item.$.CHANGEID,
                levelid: item.$.LEVELID,
                updatedate: item.$.UPDATEDATE,
                objectguid: item.$.OBJECTGUID,
                isactive: item.$.ISACTIVE
            };
        },

        AS_ROOMS: function (item: any) {
            return {
                id: item.$.ID,
                objectid: item.$.OBJECTID,
                objectguid: item.$.OBJECTGUID,
                changeid: item.$.CHANGEID,
                number: item.$.NUMBER,
                roomtype: item.$.ROOMTYPE,
                opertypeid: item.$.OPERTYPEID,
                previd: item.$.PREVID,
                nextid: item.$.NEXTID,
                updatedate: item.$.UPDATEDATE,
                startdate: item.$.STARTDATE,
                enddate: item.$.ENDDATE,
                isactual: item.$.ISACTUAL,
                isactive: item.$.ISACTIVE
            };
        },

        AS_ROOMS_PARAMS: function (item: any) {
            return AS_PARAM(item);
        },

        AS_ROOM_TYPES: function (item: any) {
            return {
                id: item.$.ID,
                name: item.$.NAME,
                short_name: item.$.SHORT_NAME,
                description: item.$.DESCRIPTION,
                updatedate: item.$.UPDATEDATE,
                startdate: item.$.STARTDATE,
                enddate: item.$.ENDDATE,
                isactive: item.$.ISACTIVE,

            }
        },

        AS_STEADS: function (item: any) {
            return {
                id: item.$.ID,
                objectid: item.$.OBJECTID,
                objectguid: item.$.OBJECTGUID,
                changeid: item.$.CHANGEID,
                number: item.$.NUMBER,
                opertypeid: item.$.OPERTYPEID,
                previd: item.$.PREVID,
                nextid: item.$.NEXTID,
                updatedate: item.$.UPDATEDATE,
                startdate: item.$.STARTDATE,
                enddate: item.$.ENDDATE,
                isactual: item.$.ISACTUAL,
                isactive: item.$.ISACTIVE
            };
        },
        AS_STEADS_PARAMS: function (item: any) {
            return AS_PARAM(item);
        },
}

export default xmlMapping;