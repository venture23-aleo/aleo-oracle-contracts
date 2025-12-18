import { hashStruct } from "../../../utils/hash";

import { getProposalStatus, validateExecution, validateProposer, validateVote } from "../councilUtils";

import { getVotersWithYesVotes, padWithZeroAddress } from "../../../utils/voters";
import { ExecutionMode } from "@doko-js/core";
import { Veru_oracle_council_imp_v3Contract } from "../../../artifacts/js/veru_oracle_council_imp_v3";
import { Veru_oracle_council_v3Contract } from "../../../artifacts/js/veru_oracle_council_v3";
import { COUNCIL_TOTAL_PROPOSALS_INDEX, SUPPORTED_THRESHOLD, TAG_TRANSFER_OWNERSHIP } from "../../../utils/constants";
import { TransferOwnership } from "../../../artifacts/js/types/veru_oracle_council_imp_v3";
import { getTransferOwnershipLeo } from "../../../artifacts/js/js2leo/veru_oracle_council_imp_v3";
import { ExternalProposal } from "../../../artifacts/js/types/veru_oracle_council_v3";
import { getExternalProposalLeo } from "../../../artifacts/js/js2leo/veru_oracle_council_v3";

const mode = ExecutionMode.SnarkExecute;
const council = new Veru_oracle_council_v3Contract({ mode, priorityFee: 10_000 });
const councilImpl = new Veru_oracle_council_imp_v3Contract({ mode, priorityFee: 10_000 });


export const proposeTransferOwnership = async (newOwner: string): Promise<number> => {

  console.log(`👍 Proposing to transfer ownership to: ${newOwner}`)

  const [proposer] = council.getAccounts();
  validateProposer(proposer);

  const proposalId = parseInt((await council.proposals(COUNCIL_TOTAL_PROPOSALS_INDEX)).toString()) + 1;

  //generating hash
  const transferOwnership: TransferOwnership = {
    tag: TAG_TRANSFER_OWNERSHIP,
    id: proposalId,
    new_owner : newOwner
  };
  const transferOwnerShipHash = hashStruct(getTransferOwnershipLeo(transferOwnership));

  const externalProposal: ExternalProposal = {
    id: proposalId,
    external_program: councilImpl.address(),
    proposal_hash: transferOwnerShipHash
  }
  const ExternalProposalHash = hashStruct(getExternalProposalLeo(externalProposal));

  // proposing
  const proposeAddChainTx = await council.propose(proposalId, ExternalProposalHash);
  await proposeAddChainTx.wait();

  getProposalStatus(ExternalProposalHash);

  return proposalId
};

export const voteTransferOwnership = async (proposalId: number, newOwner: string) => {

  console.log(`👍 Voting to transfer Owner to : ${newOwner}`)


   //generating hash
  const transferOwnership: TransferOwnership = {
    tag: TAG_TRANSFER_OWNERSHIP,
    id: proposalId,
    new_owner : newOwner
  };
  const transferOwnerShipHash = hashStruct(getTransferOwnershipLeo(transferOwnership));

  const externalProposal: ExternalProposal = {
    id: proposalId,
    external_program: councilImpl.address(),
    proposal_hash: transferOwnerShipHash
  }
  const ExternalProposalHash = hashStruct(getExternalProposalLeo(externalProposal));

  const voter = council.getDefaultAccount();
  validateVote(ExternalProposalHash, voter);

  // vote
  const voteAddChainTx = await council.vote(ExternalProposalHash, true);
  await voteAddChainTx.wait();

  getProposalStatus(ExternalProposalHash);

}

export const execTransferOwnership = async (proposalId: number, newOwner: string) => {

  console.log(`Transferring ownership to ${newOwner}`)


  //generating hash
  const transferOwnership: TransferOwnership = {
    tag: TAG_TRANSFER_OWNERSHIP,
    id: proposalId,
    new_owner : newOwner
  };
  const transferOwnerShipHash = hashStruct(getTransferOwnershipLeo(transferOwnership));

  const externalProposal: ExternalProposal = {
    id: proposalId,
    external_program: councilImpl.address(),
    proposal_hash: transferOwnerShipHash
  }
  const ExternalProposalHash = hashStruct(getExternalProposalLeo(externalProposal));

  validateExecution(ExternalProposalHash);

  const voters = padWithZeroAddress(await getVotersWithYesVotes(ExternalProposalHash), SUPPORTED_THRESHOLD);
  console.log(voters)
  const transferOwnerShipTx = await councilImpl.oracle_transfer_ownership(
    transferOwnership.id,
    transferOwnership.new_owner,
    voters
  )
  await transferOwnerShipTx.wait();

  console.log(` ✅ Onwer Transfered successfully.`)

}

// async function run() {
//   const proposalId = await proposeAddChain(BSC_MAINNET);
//   await execAddChain(proposalId, BSC_MAINNET);
// }

// run();