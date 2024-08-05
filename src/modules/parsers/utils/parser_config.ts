export let PIN_REC_default = {
  RES_CODE: null,
  PIN: null,
  PIN_PR: null,
  L_NAME: null,
  F_NAME: null,
  S_NAME: null,
  BNF_CAT: null,
  INFO_DATE: null,
  BEGIN_DATE: null,
  END_DATE: null,
  N: null,
  OBJECT_ADDRESS: null,
  OBJECT_GUID: null,
  FLAT: null,
  PREMISE_GUID: null,
  LS_TYPE: null,
  OWNER: null,
  N_ALL: null,
  SQ_ALL: null,
  SQ: null,
  DISTR_ID: null,
  DISTR_NAME: null,
  D1_SQ: null,
  D2_SQ: null,
  CHARGE_SUM: null,
};

export let PIN_REC_fields_default: any = {
  MC: {
    MC_ACC: null,
    MC_CODE: null,
    MC_NAME: null,
    MC_INN: null,
    N_MC: null,
    SQ_PAY: null,
    OWN_TYPE: null,
  },
  RENT: {
    RENT_ACC: null,
    RENT_CODE: null,
    RENT_NAME: null,
    RENT_INN: null,
    N_RENT: null,
    SQ_RENT: null,
    OWNER_TYPE: null,
  },
  REP: {
    REP_ACC: null,
    REP_CODE: null,
    REP_NAME: null,
    REP_INN: null,
    N_REP: null,
    SQ_REP: null,
  },
  RES_CODE: {
    RES_CODE_CODE: null,
    DATA_CODE_CODE: null,
  },
  RSO: {
    RSO_ACC: null,
    RSO_CODE: null,
    RSO_NAME: null,
    INN: null,
    N_RSO: null,
    SQ_RSO: null,
  },
};

export var PIN_REC_buffer_default = {
  PIN_REC: [],
  MC: [],
  RENT: [],
  REP: [],
  RES_CODE: [],
  RSO: [],
};

export var PIN_REC_error_buffer_default = {
  PIN_REC: [],
  MC: [],
  RENT: [],
  REP: [],
  RES_CODE: [],
  RSO: [],
};

export const bulkInsertStep = 1000;