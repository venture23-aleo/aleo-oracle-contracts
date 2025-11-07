import veru_oracle_checksum_v2.aleo;
import veru_oracle_council_v2.aleo;
import veru_oracle_v2.aleo;

program veru_oracle_council_imp_v2.aleo
{   
    // upgrade through the checksum mapping in another program
    @checksum(mapping="veru_oracle_checksum_v2.aleo/approved_checksums", key="veru_oracle_council_imp_v2.aleo")
    async constructor() {
        // The Leo compiler automatically generates the constructor logic.
    }


    //TODO: add a function to change admin of checksum contract

    ///////////////////////////////////////////
    /////// Bridge: Transfer Ownership ////////
    ///////////////////////////////////////////

    const TAG_TRANSFER_OWNERSHIP: u8 = 1u8;
    const TAG_SET_UNIQUE_ID: u8 = 2u8;
    const TAG_SET_PCR_VALUES: u8 = 3u8;
    const TAG_SET_KEYS: u8 = 4u8;
    const TAG_UPDATE_HISTORIC_DATA: u8 = 5u8;
    const TAG_PAUSE: u8 = 6u8;
    const TAG_UNPAUSE: u8 = 7u8;
    const TAG_UPGRADE_PROGRAM: u8 = 8u8;
    const TAG_TRANSFER_OWNERSHIP_CHECKSUM: u8 = 9u8;


    ///////////////////////////////////////////
    /////// Oracle: Transfer Ownership ////////
    ///////////////////////////////////////////


    struct TransferOwnership {
        tag: u8,
        id: u32,
        new_owner: address
    }

    async transition oracle_transfer_ownership(public id: u32, public new_owner: address, public voters: [address; 5]) -> Future{
        let proposal: TransferOwnership = TransferOwnership {
            tag: TAG_TRANSFER_OWNERSHIP,
            id,
            new_owner
        };
        let proposal_hash: field = BHP256::hash_to_field(proposal);

        // Execute the proposal
        let transfering_ownership: Future = veru_oracle_v2.aleo/transfer_ownership(new_owner);

        let external_execute: Future = veru_oracle_council_v2.aleo/external_execute(id, proposal_hash, voters);

        return f_orc_transfer_ownership(transfering_ownership, external_execute);
    }

    async function f_orc_transfer_ownership(f0: Future, f1: Future) {
        f0.await();
        f1.await();
    }

    /////////////////////////////////////
    /////// Bridge: Add Attestor ////////
    /////////////////////////////////////

    struct SetUniqueID {
        tag: u8,
        id: u32,
        unique_id: UniqueID
    }

    async transition tb_set_unique_id(public id: u32, public unique_id: UniqueID, public voters: [address; 5])  -> Future{
        let proposal: SetUniqueID = SetUniqueID {
            tag: TAG_SET_UNIQUE_ID,
            id,
            unique_id
        };
        let proposal_hash: field = BHP256::hash_to_field(proposal);

        // Execute the proposal
        let setting_unique_id: Future = veru_oracle_v2.aleo/set_unique_id(unique_id);

        let external_execute: Future = veru_oracle_council_v2.aleo/external_execute(id, proposal_hash, voters);

        return finalize_tb_set_unique_id(setting_unique_id, external_execute);
    }

    async function finalize_tb_set_unique_id(f0: Future, f1: Future) {
        f0.await();
        f1.await();
    }


    ////////////////////////////////////////
    /////// Bridge: Remove Attestor ////////
    ///////////////////////////////////////

    struct SetPcrValues {
        tag: u8,
        id: u32,
        pcr_values: PcrValues
    }

    async transition tb_set_pcr_values(public id: u32, public pcr_values: PcrValues, public voters: [address; 5]) -> Future{
        let proposal: SetPcrValues = SetPcrValues {
            tag: TAG_SET_PCR_VALUES,
            id,
            pcr_values
        };
        let proposal_hash: field = BHP256::hash_to_field(proposal);

        // Execute the proposal
        let setting_pcr_values: Future = veru_oracle_v2.aleo/set_pcr_values(pcr_values);

        let external_execute: Future = veru_oracle_council_v2.aleo/external_execute(id, proposal_hash, voters);

        return finalize_tb_set_pcr_values(setting_pcr_values, external_execute);
    }

    async function finalize_tb_set_pcr_values(f0: Future, f1: Future) {
        f0.await();
        f1.await();
    }

    /////////////////////////////////////////
    /////// Bridge: Update Threshold ////////
    /////////////////////////////////////////

    struct SetKeys {
        tag: u8,
        id: u32,
        keys: address,
        status: bool
    }

    async transition tb_set_key(public id: u32, public keys: address, public status: bool, public voters: [address; 5]) -> Future{
        let proposal: SetKeys = SetKeys {
            tag: TAG_SET_KEYS,
            id,
            keys,
            status
        };
        let proposal_hash: field = BHP256::hash_to_field(proposal);

        // Execute the proposal
        let setting_keys : Future = veru_oracle_v2.aleo/set_key(keys, status);

        let external_execute: Future = veru_oracle_council_v2.aleo/external_execute(id, proposal_hash, voters);

        return finalize_tb_update_threshold(setting_keys, external_execute);
    }

    async function finalize_tb_update_threshold(f0: Future, f1: Future) {
        f0.await();
        f1.await();
    }

    //////////////////////////////////
    /////// Bridge: Add Chain ////////
    //////////////////////////////////

    struct UpdateHistoricData {
        tag: u8,
        id: u32,
        is_sgx_attested_data: bool,
        timestamped_hash: u128,
        attested_data: AttestedData
    }

    async transition update_historic_data(public id: u32, public is_sgx_attested_data: bool, public timestamped_hash: u128, public attested_data: AttestedData, public voters: [address; 5]) -> Future{
        let proposal: UpdateHistoricData = UpdateHistoricData {
            tag: TAG_UPDATE_HISTORIC_DATA,
            id,
            is_sgx_attested_data,
            timestamped_hash,
            attested_data
        };
        let proposal_hash: field = BHP256::hash_to_field(proposal);

        // Execute the proposal
        let add_chain: Future = veru_oracle_v2.aleo/update_historic_data(is_sgx_attested_data, timestamped_hash, attested_data);

        let external_execute: Future = veru_oracle_council_v2.aleo/external_execute(id, proposal_hash, voters);
        
        return finalize_tb_add_chain(add_chain, external_execute);
    }

    async function finalize_tb_add_chain(f0: Future, f1: Future) {
        f0.await();
        f1.await();
    }


  
    //////////////////////////////
    /////// Bridge: Pause ////////
    //////////////////////////////

    struct Pause {
        tag: u8,
        id: u32,
    }

    async transition pause(public id: u32, public voters: [address; 5]) -> Future{
        let proposal: Pause = Pause {
            tag: TAG_PAUSE,
            id,
        };
        let proposal_hash: field = BHP256::hash_to_field(proposal);

        // Execute the proposal
        let pausing: Future = veru_oracle_v2.aleo/pause();

        let external_execute: Future = veru_oracle_council_v2.aleo/external_execute(id, proposal_hash, voters);

        return finalize_tb_pause(pausing, external_execute);
    }

    async function finalize_tb_pause(f0: Future, f1: Future) {
        f0.await();
        f1.await();
    }

    //////////////////////////////
    /////// Bridge: Unpause ////////
    //////////////////////////////

    struct Unpause {
        tag: u8,
        id: u32,
    }

    async transition unpause(public id: u32, public voters: [address; 5]) -> Future{
        let proposal: Unpause = Unpause {
            tag: TAG_UNPAUSE,
            id,
        };
        let proposal_hash: field = BHP256::hash_to_field(proposal);

        // Execute the proposal
        let unpausing: Future = veru_oracle_v2.aleo/unpause();

        let external_execute: Future = veru_oracle_council_v2.aleo/external_execute(id, proposal_hash, voters);

        return finalize_tb_unpause(unpausing, external_execute);
    }

    async function finalize_tb_unpause(f0: Future, f1: Future) {
        f0.await();
        f1.await();
    }


    /// to update programs through checksum contract
    struct UpdateProgramCheckSum {
        tag: u8,
        id: u32,
        program_address: address,
        approved_checksum: [u8; 32]
    }

    async transition update_program_checksum(public id: u32, public voters: [address; 5], public program_address: address, public approved_checksum: [u8; 32]) -> Future {
        let proposal: UpdateProgramCheckSum = UpdateProgramCheckSum {
            tag:TAG_UPGRADE_PROGRAM,
            id,
            program_address,
            approved_checksum
        };
        let proposal_hash: field = BHP256::hash_to_field(proposal);

        let update_pc: Future = veru_oracle_checksum_v2.aleo/update_program_checksum(program_address, approved_checksum);

        let external_execute: Future = veru_oracle_council_v2.aleo/external_execute(id, proposal_hash, voters);

        return finalize_update_pc(external_execute, update_pc);
    }

    async function finalize_update_pc(f0: Future, f1: Future) {
        f0.await();
        f1.await();
    }


    ///////////////////////////////////////////
    /////// Checksum: Transfer Ownership ////////
    ///////////////////////////////////////////

    struct TransferOwnershipChecksum {
        tag: u8,
        id: u32,
        new_owner: address
    }

    async transition checksum_transfer_ownership(public id: u32, public new_owner: address, public voters: [address; 5]) -> Future{
        let proposal: TransferOwnershipChecksum = TransferOwnershipChecksum {
            tag: TAG_TRANSFER_OWNERSHIP_CHECKSUM,
            id,
            new_owner
        };
        let proposal_hash: field = BHP256::hash_to_field(proposal);

        // Execute the proposal
        let transfering_ownership: Future = veru_oracle_checksum_v2.aleo/set_admin(new_owner);

        let external_execute: Future = veru_oracle_council_v2.aleo/external_execute(id, proposal_hash, voters);

        return f_cksm_transfer_ownership(transfering_ownership, external_execute);
    }

    async function f_cksm_transfer_ownership(f0: Future, f1: Future) {
        f0.await();
        f1.await();
    }


}