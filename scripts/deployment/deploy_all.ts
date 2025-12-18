import { ExecutionMode } from "@doko-js/core";
import { Veru_oracle_council_v3Contract } from "../../artifacts/js/veru_oracle_council_v3";
import { Veru_oracle_council_imp_v3Contract } from "../../artifacts/js/veru_oracle_council_imp_v3";
import { Veru_oracle_checksum_v3Contract } from "../../artifacts/js/veru_oracle_checksum_v3";
import { Veru_oracle_data_v3Contract } from "../../artifacts/js/veru_oracle_data_v3";
import { Veru_oracle_interface_v3Contract } from "../../artifacts/js/veru_oracle_interface_v3";

const mode = ExecutionMode.SnarkExecute;

const oracleDeploymentChecksum = new Veru_oracle_checksum_v3Contract({mode: mode});
const oracle_data = new Veru_oracle_data_v3Contract({mode: mode});
const oracle_interface = new Veru_oracle_interface_v3Contract({mode: mode});
const council = new Veru_oracle_council_v3Contract({mode: mode});
const councilImple = new Veru_oracle_council_imp_v3Contract({mode: mode});


export const deployOraclePrograms = async () => {

   // Deploy oracle checksum contract
  console.log("Deploying oracle checksum contract");
  const oracleDeploymentChecksumTx = await oracleDeploymentChecksum.deploy();
  await oracleDeploymentChecksumTx.wait();

  // Deploy council
  console.log("Deploying council");
  const councilDeployTx = await council.deploy();
  await councilDeployTx.wait();

  // Deploy oracle data
  console.log("Deploying oracle data");
  const oracleDataDeploymentTx = await oracle_data.deploy();
  await oracleDataDeploymentTx.wait();

    // Deploy oracle interface 
  console.log("Deploying oracle interface");
  const oracleInterfaceDeploymentTx = await oracle_interface.deploy();
  await oracleInterfaceDeploymentTx.wait();

  // Deploy Council External Implementation
  console.log("Deploying councilImple");
  const bridgeCouncilDeployTx = await councilImple.deploy();
  await bridgeCouncilDeployTx.wait();

};



deployOraclePrograms();