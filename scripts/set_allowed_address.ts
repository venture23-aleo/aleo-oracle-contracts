import { ExecutionMode } from "@doko-js/core";
import { Veru_oracle_data_v3Contract } from "../artifacts/js/veru_oracle_data_v3";


const oracle = new Veru_oracle_data_v3Contract({mode: ExecutionMode.SnarkExecute});

export const setAllow = async (allowed_address: string) => {

  const allowedTxn = await oracle.set_key(allowed_address, true);
  await allowedTxn.wait();

};

// setAllow();