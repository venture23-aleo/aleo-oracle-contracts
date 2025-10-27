import { ExecutionMode } from "@doko-js/core";
import { Vlink_oracle_v2Contract } from "../artifacts/js/vlink_oracle_v2";


const oracle = new Vlink_oracle_v2Contract({mode: ExecutionMode.SnarkExecute});

export const setAllow = async (allowed_address: string) => {

  const allowedTxn = await oracle.set_key(allowed_address, true);
  await allowedTxn.wait();

};

// setAllow();