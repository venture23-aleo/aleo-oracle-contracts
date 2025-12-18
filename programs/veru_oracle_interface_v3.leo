import veru_oracle_data_v3.aleo;


program veru_oracle_interface_v3.aleo {

    // upgrade through the checksum mapping in another program
    @checksum(mapping="veru_oracle_checksum_v3.aleo/approved_checksums", key="veru_oracle_interface_v3.aleo")
    async constructor() {
        // The Leo compiler automatically generates the constructor logic.
    }
    
    struct AttestedData {
        data: u128,
        attestation_timestamp: u128
    }

    async transition set_data_sgx(
        public report_data: ReportData,
        public report: Report,
        public sig: signature,
        public pub_key: address
        ) -> Future
        {
            let set_timestampped_data: ([u128;10], [AttestedData; 10], Future) = veru_oracle_data_v3.aleo/set_timestampped_data(
                report_data,
                report,
                sig,
                pub_key
            );

            let set_request_hash_data : Future = veru_oracle_data_v3.aleo/set_request_hash_data(
                set_timestampped_data.0,
                set_timestampped_data.1
            );


            return finalize_set_data_sgx(
                set_timestampped_data.2, 
                set_request_hash_data
            );
            
        }

    async function finalize_set_data_sgx(
        public set_timestampped_data: Future,
        public set_request_hash_data: Future
    ) {
        set_timestampped_data.await();
        set_request_hash_data.await();
    }

}