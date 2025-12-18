import { ExecutionMode } from "@doko-js/core";
import { Veru_oracle_data_v3Contract } from "../artifacts/js/veru_oracle_data_v3";


const contract = new Veru_oracle_data_v3Contract({mode: ExecutionMode.SnarkExecute});

(async () => {
  const result = await contract.deploy();
  console.log(result);
})();
