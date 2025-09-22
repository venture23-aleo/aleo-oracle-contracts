import { hashStruct } from "../../../utils/hash";

import { getProposalStatus, validateExecution, validateProposer, validateVote } from "../councilUtils";

import { getVotersWithYesVotes, padWithZeroAddress } from "../../../utils/voters";
import { ExecutionMode } from "@doko-js/core";
import { Vlink_oracle_council_imp_v1Contract } from "../../../artifacts/js/vlink_oracle_council_imp_v1";
import { Vlink_oracle_council_v1Contract } from "../../../artifacts/js/vlink_oracle_council_v1";
import { COUNCIL_TOTAL_PROPOSALS_INDEX, SUPPORTED_THRESHOLD, TAG_UPDATE_HISTORIC_DATA } from "../../../utils/constants";
import { UpdateHistoricData  } from "../../../artifacts/js/types/vlink_oracle_council_imp_v1";
import { getUpdateHistoricDataLeo } from "../../../artifacts/js/js2leo/vlink_oracle_council_imp_v1";
import { ExternalProposal } from "../../../artifacts/js/types/vlink_oracle_council_v1";
import { getExternalProposalLeo } from "../../../artifacts/js/js2leo/vlink_oracle_council_v1";
import { AttestedData } from "../../../artifacts/js/types/vlink_oracle_v0001";

const mode = ExecutionMode.SnarkExecute;
const council = new Vlink_oracle_council_v1Contract({ mode, priorityFee: 10_000 });
const councilImpl = new Vlink_oracle_council_imp_v1Contract({ mode, priorityFee: 10_000 });


export const proposeUpdateHistoricData = async (is_sgx_attested_data: boolean, timestamped_hash: bigint, attested_data: AttestedData): Promise<number> => {

  console.log(`👍 Proposing to update historic data`);

  const [proposer] = council.getAccounts();
  validateProposer(proposer);

  const proposalId = parseInt((await council.proposals(COUNCIL_TOTAL_PROPOSALS_INDEX)).toString()) + 1;

  //generating hash
  const updateHistoricData: UpdateHistoricData = {
    tag: TAG_UPDATE_HISTORIC_DATA,
    id: proposalId,
    is_sgx_attested_data: is_sgx_attested_data,
    timestamped_hash: timestamped_hash,
    attested_data: attested_data
  };
  const updateHistoricDataHash = hashStruct(getUpdateHistoricDataLeo(updateHistoricData));

  const externalProposal: ExternalProposal = {
    id: proposalId,
    external_program: councilImpl.address(),
    proposal_hash: updateHistoricDataHash
  }
  const ExternalProposalHash = hashStruct(getExternalProposalLeo(externalProposal));

  // proposing
  const proposeAddChainTx = await council.propose(proposalId, ExternalProposalHash);
  await proposeAddChainTx.wait();

  getProposalStatus(ExternalProposalHash);

  return proposalId
};

export const voteUpdateHistoricData = async (proposalId: number, is_sgx_attested_data: boolean, timestamped_hash: bigint, attested_data: AttestedData) => {

  console.log(`👍 Voting to update historic data`);

  //generating hash
  const updateHistoricData: UpdateHistoricData = {
    tag: TAG_UPDATE_HISTORIC_DATA,
    id: proposalId,
    is_sgx_attested_data: is_sgx_attested_data,
    timestamped_hash: timestamped_hash,
    attested_data: attested_data
  };
  const updateHistoricDataHash = hashStruct(getUpdateHistoricDataLeo(updateHistoricData));

  const externalProposal: ExternalProposal = {
    id: proposalId,
    external_program: councilImpl.address(),
    proposal_hash: updateHistoricDataHash
  }
  const ExternalProposalHash = hashStruct(getExternalProposalLeo(externalProposal));

  const voter = council.getDefaultAccount();
  validateVote(ExternalProposalHash, voter);

  // vote
  const voteAddChainTx = await council.vote(ExternalProposalHash, true);
  await voteAddChainTx.wait();

  getProposalStatus(ExternalProposalHash);

}

export const execUpdateHistoricData = async (proposalId: number, is_sgx_attested_data: boolean, timestamped_hash: bigint, attested_data: AttestedData) => {

  console.log(`Executing to update historic data`);

  //generating hash
  const updateHistoricData: UpdateHistoricData = {
    tag: TAG_UPDATE_HISTORIC_DATA,
    id: proposalId,
    is_sgx_attested_data: is_sgx_attested_data,
    timestamped_hash: timestamped_hash,
    attested_data: attested_data
  };
  const updateHistoricDataHash = hashStruct(getUpdateHistoricDataLeo(updateHistoricData));

  const externalProposal: ExternalProposal = {
    id: proposalId,
    external_program: councilImpl.address(),
    proposal_hash: updateHistoricDataHash
  }
  const ExternalProposalHash = hashStruct(getExternalProposalLeo(externalProposal));

  validateExecution(ExternalProposalHash);

  const voters = padWithZeroAddress(await getVotersWithYesVotes(ExternalProposalHash), SUPPORTED_THRESHOLD);
  console.log(voters)
  const updateHistoricDataTx = await councilImpl.update_historic_data(
    updateHistoricData.id,
    updateHistoricData.is_sgx_attested_data,
    updateHistoricData.timestamped_hash,
    updateHistoricData.attested_data,
    voters
  )
  await updateHistoricDataTx.wait();

  console.log(` ✅ Historic Data Updated successfully.`)

}

// async function run() {
//   const proposalId = await proposeAddChain(BSC_MAINNET);
//   await execAddChain(proposalId, BSC_MAINNET);
// }

// run();