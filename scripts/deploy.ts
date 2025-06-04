import { ExecutionMode } from "@doko-js/core";
import { Vlink_oracle_v0001Contract } from "../artifacts/js/vlink_oracle_v0001";


const contract = new Vlink_oracle_v0001Contract({mode: ExecutionMode.SnarkExecute});

(async () => {
  const result = await contract.deploy();
  console.log(result);
})();
