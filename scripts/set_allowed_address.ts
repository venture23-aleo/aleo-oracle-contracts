import { ExecutionMode } from "@doko-js/core";
import { Vlink_oracle_v0001Contract } from "../artifacts/js/vlink_oracle_v0001";


const oracle = new Vlink_oracle_v0001Contract({mode: ExecutionMode.SnarkExecute});

export const setAllow = async (allowed_address: string) => {

  const allowedTxn = await oracle.set_key(allowed_address, true);
  await allowedTxn.wait();

};

// setAllow();