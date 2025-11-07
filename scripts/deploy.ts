import { ExecutionMode } from "@doko-js/core";
import { Veru_oracle_v2Contract } from "../artifacts/js/veru_oracle_v2";


const contract = new Veru_oracle_v2Contract({mode: ExecutionMode.SnarkExecute});

(async () => {
  const result = await contract.deploy();
  console.log(result);
})();
