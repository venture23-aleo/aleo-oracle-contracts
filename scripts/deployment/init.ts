import { ExecutionMode } from "@doko-js/core";

import { Veru_oracle_v2Contract } from "../../artifacts/js/veru_oracle_v2";
import { Veru_oracle_council_v2Contract } from "../../artifacts/js/veru_oracle_council_v2";
import { Veru_oracle_council_imp_v2Contract } from "../../artifacts/js/veru_oracle_council_imp_v2";
import { Veru_oracle_checksum_v2Contract } from "../../artifacts/js/veru_oracle_checksum_v2";

const mode = ExecutionMode.SnarkExecute;

const oracleDeploymentChecksum = new Veru_oracle_checksum_v2Contract({mode: mode});
const oracle = new Veru_oracle_v2Contract({mode: mode});
const council = new Veru_oracle_council_v2Contract({mode: mode});
const councilImple = new Veru_oracle_council_imp_v2Contract({mode: mode});


const intialize = async (initialCouncilList: string[], initialCouncilThresholdData: number) => {

  //Initialize council
  console.log(`Initializing council with council members: ${initialCouncilList}` + ` and threshold: ${initialCouncilThresholdData}`);
  const initializeCouncilTx = await council.initialize(initialCouncilList, initialCouncilThresholdData);
  await initializeCouncilTx.wait();

  //Initialize oracle Checksum contract 
  console.log(`Initializing upgradable handling contract: ${council.address()}`);
  const initializeoracleDeploymentChecksumTx = await oracleDeploymentChecksum.initialize(councilImple.address());
  await initializeoracleDeploymentChecksumTx.wait();

  // Initialize oracle
  console.log(`Initializing oracle with council address: ${council.address()}`);
  const initializeOracleTx = await oracle.initialize(councilImple.address());
  await initializeOracleTx.wait();
}


const council1 = "aleo1fg8y0ax9g0yhahrknngzwxkpcf7ejy3mm6cent4mmtwew5ueps8s6jzl27";
const council2 = "aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc";
const council3 = "aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc";
const council4 = "aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc";
const council5 = "aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc";
const councilThreshold = 1;
intialize([council1, council2, council3, council4, council5], councilThreshold);

