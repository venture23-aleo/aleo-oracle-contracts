import { ExecutionMode, parseJSONLikeString } from "@doko-js/core";
import { Vlink_oracle_v2Contract } from "../artifacts/js/vlink_oracle_v2";
import data from '../test/eth_usdc.json';
import { getReport, getReportData, getUniqueID } from "../artifacts/js/leo2js/vlink_oracle_v2";

const oracle = new Vlink_oracle_v2Contract({mode: ExecutionMode.SnarkExecute});

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