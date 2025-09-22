import { hashStruct } from "../../../utils/hash";

import { getProposalStatus, validateExecution, validateProposer, validateVote } from "../councilUtils";

import { getVotersWithYesVotes, padWithZeroAddress } from "../../../utils/voters";
import { ExecutionMode } from "@doko-js/core";
import { Vlink_oracle_council_imp_v1Contract } from "../../../artifacts/js/vlink_oracle_council_imp_v1";
import { Vlink_oracle_council_v1Contract } from "../../../artifacts/js/vlink_oracle_council_v1";
import { COUNCIL_TOTAL_PROPOSALS_INDEX, SUPPORTED_THRESHOLD, TAG_SET_UNIQUE_ID } from "../../../utils/constants";
import { SetUniqueID,  } from "../../../artifacts/js/types/vlink_oracle_council_imp_v1";
import { getSetUniqueIDLeo } from "../../../artifacts/js/js2leo/vlink_oracle_council_imp_v1";
import { ExternalProposal } from "../../../artifacts/js/types/vlink_oracle_council_v1";
import { getExternalProposalLeo } from "../../../artifacts/js/js2leo/vlink_oracle_council_v1";
import { UniqueID } from "../../../artifacts/js/types/vlink_oracle_v0001";

const mode = ExecutionMode.SnarkExecute;
const council = new Vlink_oracle_council_v1Contract({ mode, priorityFee: 10_000 });
const councilImpl = new Vlink_oracle_council_imp_v1Contract({ mode, priorityFee: 10_000 });


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

// async function run() {
//   const proposalId = await proposeAddChain(BSC_MAINNET);
//   await execAddChain(proposalId, BSC_MAINNET);
// }

// run();