import { hashStruct } from "../../../utils/hash";

import { getProposalStatus, validateExecution, validateProposer, validateVote } from "../councilUtils";

import { getVotersWithYesVotes, padWithZeroAddress } from "../../../utils/voters";
import { ExecutionMode, parseJSONLikeString } from "@doko-js/core";
import { Veru_oracle_council_imp_v3Contract } from "../../../artifacts/js/veru_oracle_council_imp_v3";
import { Veru_oracle_council_v3Contract } from "../../../artifacts/js/veru_oracle_council_v3";
import { COUNCIL_TOTAL_PROPOSALS_INDEX, SUPPORTED_THRESHOLD, TAG_SET_UNIQUE_ID } from "../../../utils/constants";
import { SetUniqueID,  } from "../../../artifacts/js/types/veru_oracle_council_imp_v3";
import { getSetUniqueIDLeo } from "../../../artifacts/js/js2leo/veru_oracle_council_imp_v3";
import { ExternalProposal } from "../../../artifacts/js/types/veru_oracle_council_v3";
import { getExternalProposalLeo } from "../../../artifacts/js/js2leo/veru_oracle_council_v3";
import { UniqueID } from "../../../artifacts/js/types/veru_oracle_data_v3";
import { getUniqueID } from "../../../artifacts/js/leo2js/veru_oracle_data_v3";

const mode = ExecutionMode.SnarkExecute;
const council = new Veru_oracle_council_v3Contract({ mode, priorityFee: 10_000 });
const councilImpl = new Veru_oracle_council_imp_v3Contract({ mode, priorityFee: 10_000 });

export const proposeSetUniqueID = async (unique_id: UniqueID): Promise<number> => {

  console.log(`👍 Proposing to set unique id`);

  const [proposer] = council.getAccounts();
  validateProposer(proposer);

  const proposalId = parseInt((await council.proposals(COUNCIL_TOTAL_PROPOSALS_INDEX)).toString()) + 1;

  //generating hash
  const setUniqueID: SetUniqueID = {
    tag: TAG_SET_UNIQUE_ID,
    id: proposalId,
    unique_id : unique_id
  };
  const setUniqueValueHash = hashStruct(getSetUniqueIDLeo(setUniqueID));

  const externalProposal: ExternalProposal = {
    id: proposalId,
    external_program: councilImpl.address(),
    proposal_hash: setUniqueValueHash
  }
  const ExternalProposalHash = hashStruct(getExternalProposalLeo(externalProposal));

  // proposing
  const proposeAddChainTx = await council.propose(proposalId, ExternalProposalHash);
  await proposeAddChainTx.wait();

  getProposalStatus(ExternalProposalHash);

  return proposalId
};

export const voteSetUniqueID = async (proposalId: number, unique_id: UniqueID) => {

  console.log(`👍 Voting to set unique id`)

   //generating hash
  const setUniqueID: SetUniqueID = {
    tag: TAG_SET_UNIQUE_ID,
    id: proposalId,
    unique_id : unique_id
  };
  const setUniqueValueHash = hashStruct(getSetUniqueIDLeo(setUniqueID));

  const externalProposal: ExternalProposal = {
    id: proposalId,
    external_program: councilImpl.address(),
    proposal_hash: setUniqueValueHash
  }
  const ExternalProposalHash = hashStruct(getExternalProposalLeo(externalProposal));

  const voter = council.getDefaultAccount();
  validateVote(ExternalProposalHash, voter);

  // vote
  const voteAddChainTx = await council.vote(ExternalProposalHash, true);
  await voteAddChainTx.wait();

  getProposalStatus(ExternalProposalHash);

}

export const execSetUniqueID = async (proposalId: number, unique_id: UniqueID) => {

  console.log(`Executing to set unique id`)

    //generating hash
  const setUniqueID: SetUniqueID = {
    tag: TAG_SET_UNIQUE_ID,
    id: proposalId,
    unique_id : unique_id
  };
  const setUniqueValueHash = hashStruct(getSetUniqueIDLeo(setUniqueID));

  const externalProposal: ExternalProposal = {
    id: proposalId,
    external_program: councilImpl.address(),
    proposal_hash: setUniqueValueHash
  }
  const ExternalProposalHash = hashStruct(getExternalProposalLeo(externalProposal));

  validateExecution(ExternalProposalHash);

  const voters = padWithZeroAddress(await getVotersWithYesVotes(ExternalProposalHash), SUPPORTED_THRESHOLD);
  console.log(voters)
  const setUniqueIdTx = await councilImpl.tb_set_unique_id(
    setUniqueID.id,
    setUniqueID.unique_id,
    voters
  )
  await setUniqueIdTx.wait();

  console.log(` ✅ Unique ID Set successfully.`)

}

async function run() {

  let uniqueId = getUniqueID(parseJSONLikeString("{ chunk_1: 88626332893175282811551044736698063735u128, chunk_2: 147269136852994607438230605496892530896u128 }"));
  const proposalId = await proposeSetUniqueID(uniqueId);
  await execSetUniqueID(proposalId, uniqueId);
}

run();