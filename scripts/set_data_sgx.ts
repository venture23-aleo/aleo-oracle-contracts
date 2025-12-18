import { ExecutionMode, parseJSONLikeString } from "@doko-js/core";
import { Veru_oracle_data_v3Contract } from "../artifacts/js/veru_oracle_data_v3";
import data from '../test/eth_usdc.json';
import { getReport, getReportData, getUniqueID } from "../artifacts/js/leo2js/veru_oracle_data_v3";

const oracle = new Veru_oracle_data_v3Contract({mode: ExecutionMode.SnarkExecute});

const userData = parseJSONLikeString(data.oracleData.userData);

const reportData = getReportData(userData);

let report = getReport(parseJSONLikeString(data.oracleData.report))

let signature = data.oracleData.signature;
let address = data.oracleData.address;

export const setDataSgx = async () => {

  const setDataSgxTxn = await oracle.set_data_sgx(reportData, report, signature, address);
  await setDataSgxTxn.wait();
};

setDataSgx();