import { ExecutionMode, parseJSONLikeString } from "@doko-js/core";
import data from '../test/multi_token.json';
import { getReport, getReportData, getUniqueID } from "../artifacts/js/leo2js/veru_oracle_data_v5";
import { Veru_oracle_interface_v5Contract } from "../artifacts/js/veru_oracle_interface_v5";

const oracle = new Veru_oracle_interface_v5Contract({mode: ExecutionMode.SnarkExecute});

const userData = parseJSONLikeString(data.oracleData.userData);

const reportData = getReportData(userData);

let report = getReport(parseJSONLikeString(data.oracleData.report))

let signature = data.oracleData.signature;
let address = data.oracleData.address;

export const setDataSgx = async () => {

  const setDataSgxTxn = await oracle.set_multiple_data_sgx(reportData, report, signature, address);
  await setDataSgxTxn.wait();
};

setDataSgx();