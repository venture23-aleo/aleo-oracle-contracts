import { hashStruct } from "../../../utils/hash";

import { getProposalStatus, validateExecution, validateProposer, validateVote } from "../councilUtils";

import { getVotersWithYesVotes, padWithZeroAddress } from "../../../utils/voters";
import { ExecutionMode } from "@doko-js/core";
import { Veru_oracle_council_imp_v3Contract } from "../../../artifacts/js/veru_oracle_council_imp_v3";
import { Veru_oracle_council_v3Contract } from "../../../artifacts/js/veru_oracle_council_v3";
import { COUNCIL_TOTAL_PROPOSALS_INDEX, SUPPORTED_THRESHOLD, TAG_PAUSE } from "../../../utils/constants";
import { Pause  } from "../../../artifacts/js/types/veru_oracle_council_imp_v3";
import { getPauseLeo } from "../../../artifacts/js/js2leo/veru_oracle_council_imp_v3";
import { ExternalProposal } from "../../../artifacts/js/types/veru_oracle_council_v3";
import { getExternalProposalLeo } from "../../../artifacts/js/js2leo/veru_oracle_council_v3";

const mode = ExecutionMode.SnarkExecute;
const council = new Veru_oracle_council_v3Contract({ mode, priorityFee: 10_000 });
const councilImpl = new Veru_oracle_council_imp_v3Contract({ mode, priorityFee: 10_000 });


export const proposePause = async (): Promise<number> => {

  console.log(`👍 Proposing to pause`);

  const [proposer] = council.getAccounts();
  validateProposer(proposer);

  const proposalId = parseInt((await council.proposals(COUNCIL_TOTAL_PROPOSALS_INDEX)).toString()) + 1;

  //generating hash
  const pause: Pause = {
    tag: TAG_PAUSE,
    id: proposalId
  };

  const pauseHash = hashStruct(getPauseLeo(pause));

  const externalProposal: ExternalProposal = {
    id: proposalId,
    external_program: councilImpl.address(),
    proposal_hash: pauseHash
  }
  const ExternalProposalHash = hashStruct(getExternalProposalLeo(externalProposal));

  // proposing
  const proposeAddChainTx = await council.propose(proposalId, ExternalProposalHash);
  await proposeAddChainTx.wait();

  getProposalStatus(ExternalProposalHash);

  return proposalId
};

export const votePause = async (proposalId: number) => {

  console.log(`👍 Voting to update historic data`);

  //generating hash
  const pause: Pause = {
    tag: TAG_PAUSE,
    id: proposalId
  };

  const pauseHash = hashStruct(getPauseLeo(pause));

  const externalProposal: ExternalProposal = {
    id: proposalId,
    external_program: councilImpl.address(),
    proposal_hash: pauseHash
  }
  const ExternalProposalHash = hashStruct(getExternalProposalLeo(externalProposal));

  const voter = council.getDefaultAccount();
  validateVote(ExternalProposalHash, voter);

  // vote
  const voteAddChainTx = await council.vote(ExternalProposalHash, true);
  await voteAddChainTx.wait();

  getProposalStatus(ExternalProposalHash);

}

export const execPause = async (proposalId: number) => {

  console.log(`Executing to pause`);

  //generating hash
  const pause: Pause = {
    tag: TAG_PAUSE,
    id: proposalId
  };

  const pauseHash = hashStruct(getPauseLeo(pause));

  const externalProposal: ExternalProposal = {
    id: proposalId,
    external_program: councilImpl.address(),
    proposal_hash: pauseHash
  }
  const ExternalProposalHash = hashStruct(getExternalProposalLeo(externalProposal));

  validateExecution(ExternalProposalHash);

  const voters = padWithZeroAddress(await getVotersWithYesVotes(ExternalProposalHash), SUPPORTED_THRESHOLD);
  console.log(voters)
  const pauseTx = await councilImpl.pause(
    pause.id,
    voters
  )
  await pauseTx.wait();

  console.log(` ✅ Paused successfully.`)

}

// async function run() {
//   const proposalId = await proposeAddChain(BSC_MAINNET);
//   await execAddChain(proposalId, BSC_MAINNET);
// }

// run();