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


export const deployOraclePrograms = async () => {

  // Deploy oracle checksum contract
  console.log("Deploying oracle checksum contract");
  const oracleDeploymentChecksumTx = await oracleDeploymentChecksum.deploy();
  await oracleDeploymentChecksumTx.wait();

  // Deploy council
  console.log("Deploying council");
  const councilDeployTx = await council.deploy();
  await councilDeployTx.wait();

  // Deploy oracle
  console.log("Deploying oracle");
  const oracleDeploymentTx = await oracle.deploy();
  await oracleDeploymentTx.wait();

  // Deploy Council External Implementation
  console.log("Deploying councilImple");
  const bridgeCouncilDeployTx = await councilImple.deploy();
  await bridgeCouncilDeployTx.wait();

};



deployOraclePrograms();