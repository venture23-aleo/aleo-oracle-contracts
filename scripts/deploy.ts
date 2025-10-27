import { ExecutionMode } from "@doko-js/core";
import { Vlink_oracle_v2Contract } from "../artifacts/js/vlink_oracle_v2";


const contract = new Vlink_oracle_v2Contract({mode: ExecutionMode.SnarkExecute});

(async () => {
  const result = await contract.deploy();
  console.log(result);
})();
