import { ExecutionMode, parseJSONLikeString } from '@doko-js/core';
import { Testing_offical_oracle_v2Contract } from '../artifacts/js/testing_offical_oracle_v2';
import data from './eth_usdc.json';
import { getDataChunk , getReportData, getReport, getUniqueID} from '../artifacts/js/leo2js/testing_offical_oracle_v2';
const TIMEOUT = 200_000;

// Available modes are evaluate | execute (Check README.md for further description)
const mode = ExecutionMode.LeoRun;
// Contract class initialization
const contract = new Testing_offical_oracle_v2Contract({ mode });

// let testnetOracle = new Official_oracle_v2Contract({ mode });

// This maps the accounts defined inside networks in aleo-config.js and return array of address of respective private keys
// const [admin] = contract.getAccounts();
// const recipient = process.env.ALEO_DEVNET_PRIVATE_KEY3;

describe('deploy test', () => {

  //   test('test params', async () => {
  //     const userData = parseJSONLikeString(data.oracleData.userData);

  //     // console.log(userData)

  //     const reportData = getReportData(userData);
  //     // console.log("getData:", getData);
  //     let report = getReport(parseJSONLikeString(data.oracleData.report))

  //     let signature = "sign1sv7e34k2l5g58q02hw0d90uzrs2q2sjdkk4krd4dqx7fl9lvlcprl5e46qg7u5mrjww5pethyy9evvt7u6wyemkfmaw5lherzatzxp9rtnw4fxck8yccpvfykdg4wv2888afgl2kwmshz687h3v0d8lrpepmxy89ct2huhmevae6tlq9wtku3r75ay0fhuk7usqjq0xw8c5qwc3dvdz";
  //     let address = "aleo1tku8xqh4m3gyvsvpyat7frguf07a3v62a6yewugcwqnysr9pes9s3gp768";

  //     const tx = await contract.test_result_combine(report, reportData, signature, address);
  //     const result = await tx.wait();
  //     console.log("result1: ", result);

  //     // const tx = await contract.test_result(reportData);
  //     // const result = await tx.wait();
  //     // console.log("result1: ", result);

  //     // const tx2 = await contract.test_result_report(report);
  //     // const result2 = await tx2.wait();
  //     // console.log("result2: ",result2);

  //     // const tx3 = await contract.test_result_signature(signature);
  //     // const result3 = await tx3.wait();
  //     // console.log("result3: ",result3);

  //     // const tx4 = await contract.test_result_pub_key(address);
  //     // const result4 = await tx4.wait();
  //     // console.log("result4: ",result4);

  // }, 10000000);

  test('check value', async () => {
      const userData = parseJSONLikeString(data.oracleData.userData);

      // console.log(userData)

      const reportData = getReportData(userData);
      // console.log("getData:", getData);
      let report = getReport(parseJSONLikeString(data.oracleData.report))

      let uniqueId =  getUniqueID(parseJSONLikeString( "{ chunk_1: 56440781192508629403198160677188546358u128, chunk_2: 252117865119545778245377439517424065830u128 }"));

      let signature = data.oracleData.signature;
      let address = data.oracleData.address;
      const tx = await contract.set_data_sgx(reportData, report, signature, address, uniqueId);
      const result = await tx.wait();
      console.log("is valid: ", result )
  }, 10000000);

  //   test('testnet execute', async () => {
  //     let reportData : ReportData = {

  //     }
  //     let  report : Report= {} ;
  //     let data: Datachunk = {
  //         c0: BigInt(1),
  //         c1: BigInt(2),
  //     };
  //     let signature = "sign1sv7e34k2l5g58q02hw0d90uzrs2q2sjdkk4krd4dqx7fl9lvlcprl5e46qg7u5mrjww5pethyy9evvt7u6wyemkfmaw5lherzatzxp9rtnw4fxck8yccpvfykdg4wv2888afgl2kwmshz687h3v0d8lrpepmxy89ct2huhmevae6tlq9wtku3r75ay0fhuk7usqjq0xw8c5qwc3dvdz";
  //     let addres = "aleo1tku8xqh4m3gyvsvpyat7frguf07a3v62a6yewugcwqnysr9pes9s3gp768";
  //     const tx = await testnetOracle.set_data_sgx(reportData, report, signature, addres);
  //     const result = await tx.wait();
  //     console.log("is valid: ", result )
  // }, 10000000);

  
});
