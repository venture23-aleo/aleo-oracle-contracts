import { ExecutionMode, parseJSONLikeString } from "@doko-js/core";
import { Veru_oracle_data_v3Contract } from "../artifacts/js/veru_oracle_data_v3";
import { getUniqueID } from "../artifacts/js/leo2js/veru_oracle_data_v3";

const oracle = new Veru_oracle_data_v3Contract({mode: ExecutionMode.SnarkExecute});

let uniqueId =  getUniqueID(parseJSONLikeString( "{ chunk_1: 56440781192508629403198160677188546358u128, chunk_2: 252117865119545778245377439517424065830u128 }"));


export const setUniqueId= async () => {
  const setDataSgxTxn = await oracle.set_unique_id(uniqueId);
  await setDataSgxTxn.wait();
};

setUniqueId();