import veru_oracle_data_v3.aleo;


program veru_oracle_interface_v3.aleo {

    const ARRAY_SIZE: u8 = 10u8;

    // upgrade through the checksum mapping in another program
    @checksum(mapping="veru_oracle_checksum_v3.aleo/approved_checksums", key="veru_oracle_interface_v3.aleo")
    async constructor() {
        // The Leo compiler automatically generates the constructor logic.
    }

    async transition set_multiple_data_sgx(
        public report_data: ReportData,
        public report: Report,
        public sig: signature,
        public pub_key: address
        ) -> Future
        {
            let set_timestampped_data: ( [TimestampedAttestation; ARRAY_SIZE], Future) = veru_oracle_data_v3.aleo/set_timestampped_data(
                report_data,
                report,
                sig,
                pub_key
            );

            let set_request_hash_data : Future = veru_oracle_data_v3.aleo/set_request_hash_data(set_timestampped_data.0);


            return finalize_set_data_sgx(
                set_timestampped_data.1, 
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


    async transition set_single_data_sgx(
        public report_data: ReportData,
        public report: Report,
        public sig: signature,
        public pub_key: address
        ) -> Future
        {
            let set_data: Future = veru_oracle_data_v3.aleo/set_single_data_sgx(report_data, report, sig, pub_key);
            return finalize_data_sgx(
            set_data
        );
            
        }

    async function finalize_data_sgx(
        public set_data: Future,
        ) {
            set_data.await();
        }

}