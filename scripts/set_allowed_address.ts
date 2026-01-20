import { ExecutionMode } from "@doko-js/core";
import { Veru_oracle_data_v5Contract } from "../artifacts/js/veru_oracle_data_v5";


const oracle = new Veru_oracle_data_v5Contract({mode: ExecutionMode.SnarkExecute});

export const setAllow = async (allowed_address: string) => {

  const allowedTxn = await oracle.set_key(allowed_address, true);
  await allowedTxn.wait();

};

// setAllow();