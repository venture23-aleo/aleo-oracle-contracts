import { hashStruct } from "../../../utils/hash";

import { getProposalStatus, validateExecution, validateProposer, validateVote } from "../councilUtils";

import { getVotersWithYesVotes, padWithZeroAddress } from "../../../utils/voters";
import { ExecutionMode } from "@doko-js/core";
import { Veru_oracle_council_imp_v3Contract } from "../../../artifacts/js/veru_oracle_council_imp_v3";
import { Veru_oracle_council_v3Contract } from "../../../artifacts/js/veru_oracle_council_v3";
import { COUNCIL_TOTAL_PROPOSALS_INDEX, SUPPORTED_THRESHOLD, TAG_UNPAUSE } from "../../../utils/constants";
import { Unpause  } from "../../../artifacts/js/types/veru_oracle_council_imp_v3";
import { getUnpauseLeo } from "../../../artifacts/js/js2leo/veru_oracle_council_imp_v3";
import { ExternalProposal } from "../../../artifacts/js/types/veru_oracle_council_v3";
import { getExternalProposalLeo } from "../../../artifacts/js/js2leo/veru_oracle_council_v3";

const mode = ExecutionMode.SnarkExecute;
const council = new Veru_oracle_council_v3Contract({ mode, priorityFee: 10_000 });
const councilImpl = new Veru_oracle_council_imp_v3Contract({ mode, priorityFee: 10_000 });


export const proposeUnpause = async (): Promise<number> => {

  console.log(`👍 Proposing to Unpause`);

  const [proposer] = council.getAccounts();
  validateProposer(proposer);

  const proposalId = parseInt((await council.proposals(COUNCIL_TOTAL_PROPOSALS_INDEX)).toString()) + 1;

  //generating hash
  const unpause: Unpause = {
    tag: TAG_UNPAUSE,
    id: proposalId
  };

  const unpauseHash = hashStruct(getUnpauseLeo(unpause));

  const externalProposal: ExternalProposal = {
    id: proposalId,
    external_program: councilImpl.address(),
    proposal_hash: unpauseHash
  }
  const ExternalProposalHash = hashStruct(getExternalProposalLeo(externalProposal));

  // proposing
  const proposeAddChainTx = await council.propose(proposalId, ExternalProposalHash);
  await proposeAddChainTx.wait();

  getProposalStatus(ExternalProposalHash);

  return proposalId
};

export const voteUnpause = async (proposalId: number) => {

  console.log(`👍 Voting to update historic data`);

  //generating hash
  const unpause: Unpause = {
    tag: TAG_UNPAUSE,
    id: proposalId
  };

  const unpauseHash = hashStruct(getUnpauseLeo(unpause));

  const externalProposal: ExternalProposal = {
    id: proposalId,
    external_program: councilImpl.address(),
    proposal_hash: unpauseHash
  }
  const ExternalProposalHash = hashStruct(getExternalProposalLeo(externalProposal));

  const voter = council.getDefaultAccount();
  validateVote(ExternalProposalHash, voter);

  // vote
  const voteAddChainTx = await council.vote(ExternalProposalHash, true);
  await voteAddChainTx.wait();

  getProposalStatus(ExternalProposalHash);

}

export const execUnpause = async (proposalId: number) => {

  console.log(`Executing to Unpause`);

  //generating hash
  const unpause: Unpause = {
    tag: TAG_UNPAUSE,
    id: proposalId
  };

  const unpauseHash = hashStruct(getUnpauseLeo(unpause));

  const externalProposal: ExternalProposal = {
    id: proposalId,
    external_program: councilImpl.address(),
    proposal_hash: unpauseHash
  }
  const ExternalProposalHash = hashStruct(getExternalProposalLeo(externalProposal));

  validateExecution(ExternalProposalHash);

  const voters = padWithZeroAddress(await getVotersWithYesVotes(ExternalProposalHash), SUPPORTED_THRESHOLD);
  console.log(voters)
  const unpauseTx = await councilImpl.unpause(
    unpause.id,
    voters
  )
  await unpauseTx.wait();

  console.log(` ✅ Unpaused successfully.`)

}

async function run() {
  const proposalId = await proposeUnpause();
  await execUnpause(proposalId);
}

run();