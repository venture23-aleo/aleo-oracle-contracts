import { ExecutionMode } from "@doko-js/core";
import { Veru_oracle_data_v5Contract } from "../artifacts/js/veru_oracle_data_v5";


const contract = new Veru_oracle_data_v5Contract({mode: ExecutionMode.SnarkExecute});

(async () => {
  const result = await contract.deploy();
  console.log(result);
})();
