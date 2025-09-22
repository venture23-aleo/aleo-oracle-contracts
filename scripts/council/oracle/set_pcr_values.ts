import { hashStruct } from "../../../utils/hash";

import { getProposalStatus, validateExecution, validateProposer, validateVote } from "../councilUtils";

import { getVotersWithYesVotes, padWithZeroAddress } from "../../../utils/voters";
import { ExecutionMode } from "@doko-js/core";
import { Vlink_oracle_council_imp_v1Contract } from "../../../artifacts/js/vlink_oracle_council_imp_v1";
import { Vlink_oracle_council_v1Contract } from "../../../artifacts/js/vlink_oracle_council_v1";
import { COUNCIL_TOTAL_PROPOSALS_INDEX, SUPPORTED_THRESHOLD, TAG_SET_PCR_VALUES } from "../../../utils/constants";
import { SetPcrValues  } from "../../../artifacts/js/types/vlink_oracle_council_imp_v1";
import { getSetPCRValuesLeo } from "../../../artifacts/js/js2leo/vlink_oracle_council_imp_v1";
import { ExternalProposal } from "../../../artifacts/js/types/vlink_oracle_council_v1";
import { getExternalProposalLeo } from "../../../artifacts/js/js2leo/vlink_oracle_council_v1";
import { PcrValues } from "../../../artifacts/js/types/vlink_oracle_v0001";

const mode = ExecutionMode.SnarkExecute;
const council = new Vlink_oracle_council_v1Contract({ mode, priorityFee: 10_000 });
const councilImpl = new Vlink_oracle_council_imp_v1Contract({ mode, priorityFee: 10_000 });


export const proposeSetPCRValues = async (pcr_values: PcrValues): Promise<number> => {

  console.log(`👍 Proposing to set PCR values`);

  const [proposer] = council.getAccounts();
  validateProposer(proposer);

  const proposalId = parseInt((await council.proposals(COUNCIL_TOTAL_PROPOSALS_INDEX)).toString()) + 1;

  //generating hash
  const setPCRValues: SetPcrValues = {
    tag: TAG_SET_PCR_VALUES,
    id: proposalId,
    pcr_values: pcr_values
  };
  const setPCRValuesHash = hashStruct(getSetPCRValuesLeo(setPCRValues));

  const externalProposal: ExternalProposal = {
    id: proposalId,
    external_program: councilImpl.address(),
    proposal_hash: setPCRValuesHash
  }
  const ExternalProposalHash = hashStruct(getExternalProposalLeo(externalProposal));

  // proposing
  const proposeAddChainTx = await council.propose(proposalId, ExternalProposalHash);
  await proposeAddChainTx.wait();

  getProposalStatus(ExternalProposalHash);

  return proposalId
};

export const voteSetPCRValues = async (proposalId: number, pcr_values: PcrValues) => {

  console.log(`👍 Voting to set PCR values`);

  //generating hash
  const setPCRValues: SetPcrValues = {
    tag: TAG_SET_PCR_VALUES,
    id: proposalId,
    pcr_values: pcr_values
  };
  const setPCRValuesHash = hashStruct(getSetPCRValuesLeo(setPCRValues));

  const externalProposal: ExternalProposal = {
    id: proposalId,
    external_program: councilImpl.address(),
    proposal_hash: setPCRValuesHash
  }
  const ExternalProposalHash = hashStruct(getExternalProposalLeo(externalProposal));

  const voter = council.getDefaultAccount();
  validateVote(ExternalProposalHash, voter);

  // vote
  const voteAddChainTx = await council.vote(ExternalProposalHash, true);
  await voteAddChainTx.wait();

  getProposalStatus(ExternalProposalHash);

}

export const execSetPCRValues = async (proposalId: number, pcr_values: PcrValues) => {

  console.log(`Executing to set PCR values`);

  //generating hash
  const setPCRValues: SetPcrValues = {
    tag: TAG_SET_PCR_VALUES,
    id: proposalId,
    pcr_values: pcr_values
  };
  const setPCRValuesHash = hashStruct(getSetPCRValuesLeo(setPCRValues));

  const externalProposal: ExternalProposal = {
    id: proposalId,
    external_program: councilImpl.address(),
    proposal_hash: setPCRValuesHash
  }
  const ExternalProposalHash = hashStruct(getExternalProposalLeo(externalProposal));

  validateExecution(ExternalProposalHash);

  const voters = padWithZeroAddress(await getVotersWithYesVotes(ExternalProposalHash), SUPPORTED_THRESHOLD);
  console.log(voters)
  const setPCRValuesTx = await councilImpl.tb_set_pcr_values(
    setPCRValues.id,
    setPCRValues.pcr_values,
    voters
  )
  await setPCRValuesTx.wait();

  console.log(` ✅ PCR Values Set successfully.`)

}

// async function run() {
//   const proposalId = await proposeAddChain(BSC_MAINNET);
//   await execAddChain(proposalId, BSC_MAINNET);
// }

// run();