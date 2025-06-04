import { ExecutionMode, parseJSONLikeString } from "@doko-js/core";
import { Vlink_oracle_v0001Contract } from "../artifacts/js/vlink_oracle_v0001";
import { getUniqueID } from "../artifacts/js/leo2js/vlink_oracle_v0001";

const oracle = new Vlink_oracle_v0001Contract({mode: ExecutionMode.SnarkExecute});

let uniqueId =  getUniqueID(parseJSONLikeString( "{ chunk_1: 56440781192508629403198160677188546358u128, chunk_2: 252117865119545778245377439517424065830u128 }"));


export const setUniqueId= async () => {
  const setDataSgxTxn = await oracle.set_unique_id(uniqueId);
  await setDataSgxTxn.wait();
};

setUniqueId();