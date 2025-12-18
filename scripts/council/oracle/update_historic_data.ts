import { hashStruct } from "../../../utils/hash";

import { getProposalStatus, validateExecution, validateProposer, validateVote } from "../councilUtils";

import { getVotersWithYesVotes, padWithZeroAddress } from "../../../utils/voters";
import { ExecutionMode } from "@doko-js/core";
import { Veru_oracle_council_imp_v3Contract } from "../../../artifacts/js/veru_oracle_council_imp_v3";
import { Veru_oracle_council_v3Contract } from "../../../artifacts/js/veru_oracle_council_v3";
import { COUNCIL_TOTAL_PROPOSALS_INDEX, SUPPORTED_THRESHOLD, TAG_UPDATE_HISTORIC_DATA } from "../../../utils/constants";
import { UpdateHistoricData  } from "../../../artifacts/js/types/veru_oracle_council_imp_v3";
import { getUpdateHistoricDataLeo } from "../../../artifacts/js/js2leo/veru_oracle_council_imp_v3";
import { ExternalProposal } from "../../../artifacts/js/types/veru_oracle_council_v3";
import { getExternalProposalLeo } from "../../../artifacts/js/js2leo/veru_oracle_council_v3";
import { AttestedData } from "../../../artifacts/js/types/veru_oracle_data_v3";

const mode = ExecutionMode.SnarkExecute;
const council = new Veru_oracle_council_v3Contract({ mode, priorityFee: 10_000 });
const councilImpl = new Veru_oracle_council_imp_v3Contract({ mode, priorityFee: 10_000 });


export const proposeUpdateHistoricData = async (is_sgx_attested_data: boolean, timestamped_hash: bigint, attested_data: AttestedData): Promise<number> => {

  console.log(`👍 Proposing to update historic data`);

  const [proposer] = council.getAccounts();
  validateProposer(proposer);

  const proposalId = parseInt((await council.proposals(COUNCIL_TOTAL_PROPOSALS_INDEX)).toString()) + 1;

  //generating hash
  const updateHistoricData: UpdateHistoricData = {
    tag: TAG_UPDATE_HISTORIC_DATA,
    id: proposalId,
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