import { hashStruct } from "../../../utils/hash";

import { getProposalStatus, validateExecution, validateProposer, validateVote } from "../councilUtils";

import { getVotersWithYesVotes, padWithZeroAddress } from "../../../utils/voters";
import { ExecutionMode } from "@doko-js/core";
import { Vlink_oracle_council_imp_v1Contract } from "../../../artifacts/js/vlink_oracle_council_imp_v1";
import { Vlink_oracle_council_v1Contract } from "../../../artifacts/js/vlink_oracle_council_v1";
import { COUNCIL_TOTAL_PROPOSALS_INDEX, SUPPORTED_THRESHOLD, TAG_SET_KEYS } from "../../../utils/constants";
import { SetKeys  } from "../../../artifacts/js/types/vlink_oracle_council_imp_v1";
import { getSetKeysLeo } from "../../../artifacts/js/js2leo/vlink_oracle_council_imp_v1";
import { ExternalProposal } from "../../../artifacts/js/types/vlink_oracle_council_v1";
import { getExternalProposalLeo } from "../../../artifacts/js/js2leo/vlink_oracle_council_v1";

const mode = ExecutionMode.SnarkExecute;
const council = new Vlink_oracle_council_v1Contract({ mode, priorityFee: 10_000 });
const councilImpl = new Vlink_oracle_council_imp_v1Contract({ mode, priorityFee: 10_000 });


export const proposeSetKey = async (key: string, status: boolean): Promise<number> => {

  console.log(`👍 Proposing to set key`);

  const [proposer] = council.getAccounts();
  validateProposer(proposer);

  const proposalId = parseInt((await council.proposals(COUNCIL_TOTAL_PROPOSALS_INDEX)).toString()) + 1;

  //generating hash
  const setKey: SetKeys = {
    tag: TAG_SET_KEYS,
    id: proposalId,
    keys: key,
    status: status
  };
  const setKeyHash = hashStruct(getSetKeysLeo(setKey));

  const externalProposal: ExternalProposal = {
    id: proposalId,
    external_program: councilImpl.address(),
    proposal_hash: setKeyHash
  }
  const ExternalProposalHash = hashStruct(getExternalProposalLeo(externalProposal));

  // proposing
  const proposeAddChainTx = await council.propose(proposalId, ExternalProposalHash);
  await proposeAddChainTx.wait();

  getProposalStatus(ExternalProposalHash);

  return proposalId
};

export const voteSetKey = async (proposalId: number, key: string, status: boolean) => {

  console.log(`👍 Voting to set key`);

  //generating hash
  const setKey: SetKeys = {
    tag: TAG_SET_KEYS,
    id: proposalId,
    keys: key,
    status: status
  };
  const setKeyHash = hashStruct(getSetKeysLeo(setKey));

  const externalProposal: ExternalProposal = {
    id: proposalId,
    external_program: councilImpl.address(),
    proposal_hash: setKeyHash
  }
  const ExternalProposalHash = hashStruct(getExternalProposalLeo(externalProposal));

  const voter = council.getDefaultAccount();
  validateVote(ExternalProposalHash, voter);

  // vote
  const voteAddChainTx = await council.vote(ExternalProposalHash, true);
  await voteAddChainTx.wait();

  getProposalStatus(ExternalProposalHash);

}

export const execSetKey = async (proposalId: number, key: string, status: boolean) => {

  console.log(`Executing to set key`);

    //generating hash
  const setKey: SetKeys = {
    tag: TAG_SET_KEYS,
    id: proposalId,
    keys: key,
    status: status
  };
  const setKeyHash = hashStruct(getSetKeysLeo(setKey));

  const externalProposal: ExternalProposal = {
    id: proposalId,
    external_program: councilImpl.address(),
    proposal_hash: setKeyHash
  }
  const ExternalProposalHash = hashStruct(getExternalProposalLeo(externalProposal));

  validateExecution(ExternalProposalHash);

  const voters = padWithZeroAddress(await getVotersWithYesVotes(ExternalProposalHash), SUPPORTED_THRESHOLD);
  console.log(voters)
  const setKeyTx = await councilImpl.tb_set_key(
    setKey.id,
    setKey.keys,
    setKey.status,
    voters
  )
  await setKeyTx.wait();

  console.log(` ✅ Key Set successfully.`)

}

// async function run() {
//   const proposalId = await proposeAddChain(BSC_MAINNET);
//   await execAddChain(proposalId, BSC_MAINNET);
// }

// run();