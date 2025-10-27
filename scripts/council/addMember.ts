import { Vlink_oracle_council_v2Contract } from "../../artifacts/js/vlink_oracle_council_v2";
import { hashStruct } from "../../utils/hash";

import { COUNCIL_TOTAL_PROPOSALS_INDEX, SUPPORTED_THRESHOLD, TAG_ADD_MEMBER } from "../../utils/constants";
import { getProposalStatus, validateExecution, validateProposer, validateVote } from "./councilUtils";
import { getVotersWithYesVotes, padWithZeroAddress } from "../../utils/voters";
import { ExecutionMode } from "@doko-js/core";
import { AddMember } from "../../artifacts/js/types/vlink_oracle_council_v2";
import { getAddMemberLeo } from "../../artifacts/js/js2leo/vlink_oracle_council_v2";

const mode = ExecutionMode.SnarkExecute;


const council = new Vlink_oracle_council_v2Contract({ mode, priorityFee: 10_000 });

//////////////////////
///// Propose ////////
//////////////////////
export const proposeAddMember = async (member: string, new_threshold: number): Promise<number> => {

  console.log(`👍 Proposing to add council Member: ${member}`)
  const isMember = await council.members(member, false);
  if (isMember) {
    throw Error(`${member} is already council memeber!`);
  }

  const proposer = council.getAccounts()[0];
  validateProposer(proposer);

  const proposalId = parseInt((await council.proposals(COUNCIL_TOTAL_PROPOSALS_INDEX)).toString()) + 1;
  const addMemeberProposal: AddMember = {
    tag: TAG_ADD_MEMBER,
    id: proposalId,
    new_member: member,
    new_threshold: new_threshold,
  };
  const addMemberProposalHash = hashStruct(getAddMemberLeo(addMemeberProposal));

  const addMemberTx = await council.propose(proposalId, addMemberProposalHash);
  await addMemberTx.wait();

  return proposalId
};

///////////////////
///// Vote ////////
///////////////////
export const voteAddMember = async (proposalId: number, member: string, new_threshold: number) => {

  console.log(`👍 Voting to add council Member: ${member}`)
  const isMember = await council.members(member, false);
  if (isMember) {
    throw Error(`${member} is already council memeber!`);
  }

  const voter = council.getAccounts()[0];

  const addMemeberProposal: AddMember = {
    tag: TAG_ADD_MEMBER,
    id: proposalId,
    new_member: member,
    new_threshold: new_threshold,
  };
  const addMemberProposalHash = hashStruct(getAddMemberLeo(addMemeberProposal));

  validateVote(addMemberProposalHash, voter);

  const addMemberTx = await council.vote(addMemberProposalHash, true);
  await addMemberTx.wait();

  getProposalStatus(addMemberProposalHash);

};


//////////////////////
///// Execute ////////
//////////////////////
export const execAddMember = async (proposalId: number, member: string, new_threshold: number,) => {

  console.log(`👍executing to add council Member: ${member}`)
  const isMember = await council.members(member, false);
  if (isMember) {
    throw Error(`${member} is not council memeber!`);
  }

  const addMemeberProposal: AddMember = {
    tag: TAG_ADD_MEMBER,
    id: proposalId,
    new_member: member,
    new_threshold: new_threshold,
  };
  const addMemberProposalHash = hashStruct(getAddMemberLeo(addMemeberProposal));

  validateExecution(addMemberProposalHash);

  const voters = padWithZeroAddress(await getVotersWithYesVotes(addMemberProposalHash), SUPPORTED_THRESHOLD);

  const addMemeberExecTx = await council.add_member(proposalId, member, new_threshold, voters);
  await addMemeberExecTx.wait();

  const isMemberAdded = await council.members(member, false);
  if (!isMemberAdded) {
    throw Error(`❌ Unknown error.`);
  }

  console.log(` ✅ Member: ${member} added successfully.`)
}



async function run() {
  await execAddMember(8, "aleo17w6pmhm5cmres75wz0spqdjl6p7aaurev97rca356k38vmjwry9s8axwwn", 1);
}

run();