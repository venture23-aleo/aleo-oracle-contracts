import veru_oracle_data_v5.aleo;


program veru_oracle_interface_v5.aleo {


    // upgrade through the checksum mapping in another program
    @checksum(mapping="veru_oracle_checksum_v5.aleo/approved_checksums", key="veru_oracle_interface_v5.aleo")
    async constructor() {
        // The Leo compiler automatically generates the constructor logic.
    }

    // a 512-byte data chunk
  struct DataChunk {
    f0: u128,
    f1: u128,
    f2: u128,
    f3: u128,
    f4: u128,
    f5: u128,
    f6: u128,
    f7: u128,
    f8: u128,
    f9: u128,
    f10: u128,
    f11: u128,
    f12: u128,
    f13: u128,
    f14: u128,
    f15: u128,
    f16: u128,
    f17: u128,
    f18: u128,
    f19: u128,
    f20: u128,
    f21: u128,
    f22: u128,
    f23: u128,
    f24: u128,
    f25: u128,
    f26: u128,
    f27: u128,
    f28: u128,
    f29: u128,
    f30: u128,
    f31: u128
  }

  struct Report {
    c0: DataChunk,
    c1: DataChunk,
    c2: DataChunk,
    c3: DataChunk,
    c4: DataChunk,
    c5: DataChunk,
    c6: DataChunk,
    c7: DataChunk,
    c8: DataChunk,
    c9: DataChunk
  }

  struct ReportData {
    c0: DataChunk,
    c1: DataChunk,
    c2: DataChunk,
    c3: DataChunk,
    c4: DataChunk,
    c5: DataChunk,
    c6: DataChunk,
    c7: DataChunk,
    c8: DataChunk,
    c9: DataChunk
  }


    const ARRAY_SIZE: u8 = 5u8;

    const VALID_HTTP_STATUS: u128 = 200u128;

    function verify_sgx_report(
        report_data: veru_oracle_data_v5.aleo/ReportData,
        report: veru_oracle_data_v5.aleo/Report,
        sig: signature,
        pub_key: address
    ) {
        // https://github.com/openenclave/openenclave/blob/e9a0423e3a0b242bccbe0b5b576e88b640f88f85/include/openenclave/bits/sgx/sgxtypes.h#L1088
        // verify enclave flags
        // chunk 0 field 7 contains enclave flags
        let enclave_flags: u128 = report.c0.f7;
        assert_eq(enclave_flags & 1u128, 1u128); // enclave initted
        assert_eq(enclave_flags & 2u128, 0u128); // enclave is not in debug mode
        assert_eq(enclave_flags & 4u128, 4u128); // enclave is in 64-bit mode

        let data_hash: u128 = Poseidon8::hash_to_u128(report_data);

        // verify that the hash of the data signed by TEE and is included in the report
        assert_eq(data_hash, report.c0.f24);
        assert_eq(0u128, report.c0.f25);
        assert_eq(0u128, report.c0.f26);
        assert_eq(0u128, report.c0.f27);

        let report_hash: u128 = Poseidon8::hash_to_u128(report);

        assert_eq(report_data.c0.f4, VALID_HTTP_STATUS);


        // verify that the report was signed by TEE
        let is_valid: bool = signature::verify(sig, pub_key, report_hash);
        assert(is_valid);
    }


    async transition set_multiple_data_sgx(
        public report_data: veru_oracle_data_v5.aleo/ReportData,
        public report: veru_oracle_data_v5.aleo/Report,
        public sig: signature,
        public pub_key: address
        ) -> Future
        {   
            verify_sgx_report(report_data, report, sig, pub_key);

            let report_datas_1: [DataChunk; ARRAY_SIZE] = [report_data.c0, report_data.c1, report_data.c2, report_data.c3, report_data.c4];
            
            let report_datas_2: [DataChunk; ARRAY_SIZE] = [report_data.c5, report_data.c6, report_data.c7, report_data.c8, report_data.c9];
            

            let set_data1: Future = veru_oracle_data_v5.aleo/set_sgx_data(
                pub_key, 
                report.c0.f8,
                report.c0.f9,
                report_datas_1
            );

            let set_data2 : Future = veru_oracle_data_v5.aleo/set_sgx_data(
                pub_key, 
                report.c0.f8, 
                report.c0.f9, 
                report_datas_2
            );

            return finalize_set_data_sgx(
                set_data1, 
                set_data2
            );
            
    }

    async function finalize_set_data_sgx(
        public set_data1: Future,
        public set_data2: Future
    ) {
        set_data1.await();
        set_data2.await();
    }


    async transition set_single_data_sgx(
        public report_data: veru_oracle_data_v5.aleo/ReportData,
        public report: veru_oracle_data_v5.aleo/Report,
        public sig: signature,
        public pub_key: address
        ) -> Future
        {   
            verify_sgx_report(report_data, report, sig, pub_key);

            let set_data: Future = veru_oracle_data_v5.aleo/set_single_data_sgx(report_data.c0);

            return finalize_data_sgx(
            set_data
        );
            
        }

    async function finalize_data_sgx(
        public set_data: Future
        ) {
            set_data.await();
        }

        async transition set_five_data_sgx(
        public report_data: veru_oracle_data_v5.aleo/ReportData,
        public report: veru_oracle_data_v5.aleo/Report,
        public sig: signature,
        public pub_key: address
        ) -> Future
        {   
            verify_sgx_report(report_data, report, sig, pub_key);

            let report_datas_1: [DataChunk; ARRAY_SIZE] = [report_data.c0, report_data.c1, report_data.c2, report_data.c3, report_data.c4];
            
            let set_data1: Future = veru_oracle_data_v5.aleo/set_sgx_data(
                pub_key, 
                report.c0.f8,
                report.c0.f9,
                report_datas_1
            );

            return finalize_set_f_data_sgx(
                set_data1, 
            );
            
    }

    async function finalize_set_f_data_sgx(
        public set_data1: Future
    ) {
        set_data1.await();
    }


}