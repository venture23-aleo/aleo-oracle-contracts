import vlink_oracle_council_v1.aleo;
import vlink_oracle_v0001.aleo;

program vlink_oracle_council_imp_v1.aleo
{   

    // This constructor is for the "admin" mode.
    // It ensures that only the designated admin can upgrade the program.
    @admin(address="aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px")
    async constructor() {
        // The Leo compiler automatically generates the constructor logic.
    }


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


    struct TransferOwnership {
        tag: u8,
        id: u32,
        new_owner: address
    }

    async transition transfer_ownership(public id: u32, public new_owner: address, public voters: [address; 5]) -> Future{
        let proposal: TransferOwnership = TransferOwnership {
            tag: TAG_TRANSFER_OWNERSHIP,
            id,
            new_owner
        };
        let proposal_hash: field = BHP256::hash_to_field(proposal);

        // Execute the proposal
        let transfering_ownership: Future = vlink_oracle_v0001.aleo/transfer_ownership(new_owner);

        let external_execute: Future = vlink_oracle_council_v1.aleo/external_execute(id, proposal_hash, voters);

        return finalize_tb_transfer_ownership(transfering_ownership, external_execute);
    }

    async function finalize_tb_transfer_ownership(f0: Future, f1: Future) {
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
        let setting_unique_id: Future = vlink_oracle_v0001.aleo/set_unique_id(unique_id);

        let external_execute: Future = vlink_oracle_council_v1.aleo/external_execute(id, proposal_hash, voters);

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
        let setting_pcr_values: Future = vlink_oracle_v0001.aleo/set_pcr_values(pcr_values);

        let external_execute: Future = vlink_oracle_council_v1.aleo/external_execute(id, proposal_hash, voters);

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
        let setting_keys : Future = vlink_oracle_v0001.aleo/set_key(keys, status);

        let external_execute: Future = vlink_oracle_council_v1.aleo/external_execute(id, proposal_hash, voters);

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
        let add_chain: Future = vlink_oracle_v0001.aleo/update_historic_data(is_sgx_attested_data, timestamped_hash, attested_data);

        let external_execute: Future = vlink_oracle_council_v1.aleo/external_execute(id, proposal_hash, voters);
        
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
        let pausing: Future = vlink_oracle_v0001.aleo/pause();

        let external_execute: Future = vlink_oracle_council_v1.aleo/external_execute(id, proposal_hash, voters);

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
        let unpausing: Future = vlink_oracle_v0001.aleo/unpause();

        let external_execute: Future = vlink_oracle_council_v1.aleo/external_execute(id, proposal_hash, voters);

        return finalize_tb_unpause(unpausing, external_execute);
    }

    async function finalize_tb_unpause(f0: Future, f1: Future) {
        f0.await();
        f1.await();
    }
}