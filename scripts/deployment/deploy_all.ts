import { ExecutionMode } from "@doko-js/core";
import { Vlink_oracle_v0001Contract } from "../../artifacts/js/vlink_oracle_v0001";
import { Vlink_oracle_council_v1Contract } from "../../artifacts/js/vlink_oracle_council_v1";
import { Vlink_oracle_council_imp_v1Contract } from "../../artifacts/js/vlink_oracle_council_imp_v1";

const mode = ExecutionMode.SnarkExecute;

const oracle = new Vlink_oracle_v0001Contract({mode: ExecutionMode.SnarkExecute});
const council = new Vlink_oracle_council_v1Contract({mode: ExecutionMode.SnarkExecute});
const councilImple = new Vlink_oracle_council_imp_v1Contract({mode: ExecutionMode.SnarkExecute});


export const deployOraclePrograms = async () => {

  // Deploy holding
  console.log("Deploying oracle");
  const oracleDeploymentTx = await oracle.deploy();
  await oracleDeploymentTx.wait();

  // Deploy council
  console.log("Deploying council");
  const councilDeployTx = await council.deploy();
  await councilDeployTx.wait();

  // Deploy Council External Implementation
  console.log("Deploying councilImple");
  const bridgeCouncilDeployTx = await councilImple.deploy();
  await bridgeCouncilDeployTx.wait();

};



deployOraclePrograms();