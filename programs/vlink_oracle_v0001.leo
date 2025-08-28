program vlink_oracle_v0001.aleo {
  // 32 byte enclave unique_id
  // split into 2 16 byte u128 chunks
  struct UniqueID {
    chunk_1: u128,
    chunk_2: u128
  }

  // 3 AWS Nitro PCR_values
  // 48 bytes each, split into 3 16 byte u128 chunks
  struct PcrValues {
    pcr_0_chunk_1: u128,
    pcr_0_chunk_2: u128,
    pcr_0_chunk_3: u128,
    pcr_1_chunk_1: u128,
    pcr_1_chunk_2: u128,
    pcr_1_chunk_3: u128,
    pcr_2_chunk_1: u128,
    pcr_2_chunk_2: u128,
    pcr_2_chunk_3: u128
  }

  struct AttestedData {
    data: u128,
    attestation_timestamp: u128
  }

  struct TimestampedHash {
    request_hash: u128,
    attestation_timestamp: u128
  }

  struct PositionData {
    block_index: u8,
    shift_a: u8,
    shift_b: u8,
    mask_a: u128,
    mask_b: u128
  }

  // initializer of a contract
  const initializer: address = aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px;
  const OWNER_INDEX: bool = true;
  const STATUS_INDEX: u8 = 0u8;
  const PAUSED_VALUE: bool = true;
  const UNPAUSED_VALUE: bool = false;
  const VALID_HTTP_STATUS: u128 = 200u128;

  mapping admin: bool => address;
  mapping status: u8 => bool;


  // unique_id is always stored with 0u8 key
  mapping sgx_unique_id: u8 => UniqueID;

  // pcr_values is always stored with 0u8 key
  mapping nitro_pcr_values: u8 => PcrValues;

  // mapping with allowed enclave keys
  mapping allowed_keys: address => bool;

  // storage of data attested by sgx
  // hash of notarization request with timestamp => Attested_Data
  // or just hash of notarization request for the lastest stored data
  mapping sgx_attested_data: u128 => AttestedData;

  // storage of data attested by sgx
  // hash of notarization request with timestamp => Attested_Data
  // or just hash of notarization request for the lastest stored data
  mapping nitro_attested_data: u128 => AttestedData;


  async transition initialize(public owner_address: address) -> Future {
    // can be called only once
    assert_eq(self.caller, initializer);
    return finalize_initialize(owner_address);
  }

  // finalize initialization
  async function finalize_initialize(public owner_address: address) {
    Mapping::set(admin, OWNER_INDEX, owner_address);
    Mapping::set(status, STATUS_INDEX, PAUSED_VALUE); // paused by default
  }


  /// Update the existing admin
  /// Can only be called from admin
  async transition transfer_ownership(public new_owner: address) -> Future{
    return finalize_transfer_ownership(self.caller, new_owner);
  }

  async function finalize_transfer_ownership(from: address, new_owner: address) {
    // Get the admin address
    // If program not initialized, this fails
    let current_owner: address = Mapping::get(admin, OWNER_INDEX);
    assert_eq(from, current_owner);

    Mapping::set(admin, OWNER_INDEX, new_owner);
  }


    //////////////////////////////////
    //// Pause / Unpause //////
    //////////////////////////////////

    /// Pauses the oracle
    async transition pause() -> Future{
        return finalize_pause(self.caller);
    }

    async function finalize_pause(from: address) {
        // Get the owner address
        // If program not initialized, this fails
        let owner: address = Mapping::get(admin, OWNER_INDEX);
        assert_eq(from, owner);

        Mapping::set(status, STATUS_INDEX, PAUSED_VALUE);
    }

    /// Unpauses the oracle
    /// There can be transfers only when the oracle is unpaused
    async transition unpause() -> Future{
        return finalize_unpause(self.caller);
    }

    async function finalize_unpause(from: address) {
        // Get the owner address
        // If program not initialized, this fails
        let owner: address = Mapping::get(admin, OWNER_INDEX);
        assert_eq(from, owner);

        Mapping::set(status, STATUS_INDEX, PAUSED_VALUE);
    }

  // set new enclave unique id which is going to be used to verify sgx report
  async transition set_unique_id(public unique_id: UniqueID) -> Future {
    return finalize_set_unique_id(self.caller, unique_id);
  }

  async function finalize_set_unique_id(public from: address, public unique_id: UniqueID) {
    // caller must be admin
    let current_owner: address = Mapping::get(admin, OWNER_INDEX);
    assert_eq(from, current_owner);

    Mapping::set(sgx_unique_id, 0u8, unique_id);
  }

  async transition set_pcr_values(public pcr_values: PcrValues) -> Future {
    return finalize_set_pcr_values(self.caller, pcr_values);
  }

  async function finalize_set_pcr_values(public from: address, public pcr_values: PcrValues) {
    // caller must be admin
    let current_owner: address = Mapping::get(admin, OWNER_INDEX);
    assert_eq(from, current_owner);

    Mapping::set(nitro_pcr_values, 0u8, pcr_values);
  }

  async transition set_key(
    public pub_key: address,
    public allowed: bool
  ) -> Future {
    return finalize_set_key(
      self.caller,
      pub_key,
      allowed
    );
  }

  async function finalize_set_key(
    public from: address,
    public pub_key: address,
    public allowed: bool
  ) {
    // caller must be admin
    let current_owner: address = Mapping::get(admin, OWNER_INDEX);
    assert_eq(from, current_owner);

    Mapping::set(allowed_keys, pub_key, allowed);
  }

  function extract_value(
    a: u128,
    b: u128,
    position_info: PositionData
  ) -> u128 {
    let a_masked: u128 = a & position_info.mask_a;
    let a_masked_shifted: u128 = a_masked.shr_wrapped(position_info.shift_a);

    let b_masked: u128 = b & position_info.mask_b;
    let b_masked_shifted: u128 = b_masked.shl_wrapped(position_info.shift_b);

    let result: u128 = a_masked_shifted | b_masked_shifted;

    return result;
  }

  function select_chunk(c: DataChunk, pos: u8) -> (u128, u128, u128, u128) {
    if pos == 0u8 {
      return (c.f0, c.f1, c.f2, c.f3);
    }
    if pos == 1u8 {
      return (c.f1, c.f2, c.f3, c.f4);
    }
    if pos == 2u8 {
      return (c.f2, c.f3, c.f4, c.f5);
    }
    if pos == 3u8 {
      return (c.f3, c.f4, c.f5, c.f6);
    }
    if pos == 4u8 {
      return (c.f4, c.f5, c.f6, c.f7);
    }
    if pos == 5u8 {
      return (c.f5, c.f6, c.f7, c.f8);
    }
    if pos == 6u8 {
      return (c.f6, c.f7, c.f8, c.f9);
    }
    if pos == 7u8 {
      return (c.f7, c.f8, c.f9, c.f10);
    }
    if pos == 8u8 {
      return (c.f8, c.f9, c.f10, c.f11);
    }
    if pos == 9u8 {
      return (c.f9, c.f10, c.f11, c.f12);
    }
    if pos == 10u8 {
      return (c.f10, c.f11, c.f12, c.f13);
    }
    if pos == 11u8 {
      return (c.f11, c.f12, c.f13, c.f14);
    }
    if pos == 12u8 {
      return (c.f12, c.f13, c.f14, c.f15);
    }
    if pos == 13u8 {
      return (c.f13, c.f14, c.f15, c.f16);
    }
    if pos == 14u8 {
      return (c.f14, c.f15, c.f16, c.f17);
    }
    if pos == 15u8 {
      return (c.f15, c.f16, c.f17, c.f18);
    }
    if pos == 16u8 {
      return (c.f16, c.f17, c.f18, c.f19);
    }
    if pos == 17u8 {
      return (c.f17, c.f18, c.f19, c.f20);
    }
    if pos == 18u8 {
      return (c.f18, c.f19, c.f20, c.f21);
    }
    if pos == 19u8 {
      return (c.f19, c.f20, c.f21, c.f22);
    }
    if pos == 20u8 {
      return (c.f20, c.f21, c.f22, c.f23);
    }
    if pos == 21u8 {
      return (c.f21, c.f22, c.f23, c.f24);
    }
    if pos == 22u8 {
      return (c.f22, c.f23, c.f24, c.f25);
    }
    if pos == 23u8 {
      return (c.f23, c.f24, c.f25, c.f26);
    }
    if pos == 24u8 {
      return (c.f24, c.f25, c.f26, c.f27);
    }
    if pos == 25u8 {
      return (c.f25, c.f26, c.f27, c.f28);
    }
    if pos == 26u8 {
      return (c.f26, c.f27, c.f28, c.f29);
    }
    if pos == 27u8 {
      return (c.f27, c.f28, c.f29, c.f30);
    }
    if pos == 28u8 {
      return (c.f28, c.f29, c.f30, c.f31);
    }
    if pos == 29u8 {
      return (c.f29, c.f30, c.f31, 0u128);
    }
    if pos == 30u8 {
      return (c.f30, c.f31, 0u128, 0u128);
    }

    return (0u128, 0u128, 0u128, 0u128);
  }

  function get_request_hash(report_data: ReportData) -> u128 {
    let first_data_chunk: DataChunk = DataChunk {
      f0: report_data.c0.f0,
      f1: report_data.c0.f1,
      f2: 0u128,
      f3: 0u128,
      f4: report_data.c0.f4,
      f5: report_data.c0.f5,
      f6: report_data.c0.f6,
      f7: report_data.c0.f7,
      f8: report_data.c0.f8,
      f9: report_data.c0.f9,
      f10: report_data.c0.f10,
      f11: report_data.c0.f11,
      f12: report_data.c0.f12,
      f13: report_data.c0.f13,
      f14: report_data.c0.f14,
      f15: report_data.c0.f15,
      f16: report_data.c0.f16,
      f17: report_data.c0.f17,
      f18: report_data.c0.f18,
      f19: report_data.c0.f19,
      f20: report_data.c0.f20,
      f21: report_data.c0.f21,
      f22: report_data.c0.f22,
      f23: report_data.c0.f23,
      f24: report_data.c0.f24,
      f25: report_data.c0.f25,
      f26: report_data.c0.f26,
      f27: report_data.c0.f27,
      f28: report_data.c0.f28,
      f29: report_data.c0.f29,
      f30: report_data.c0.f30,
      f31: report_data.c0.f31
    };

    let request_data: ReportData = ReportData {
      c0: first_data_chunk,
      c1: report_data.c1,
      c2: report_data.c2,
      c3: report_data.c3,
      c4: report_data.c4,
      c5: report_data.c5,
      c6: report_data.c6,
      c7: report_data.c7
    };

    let request_hash: u128 = Poseidon8::hash_to_u128(request_data);

    return request_hash;
  }

  function verify_sgx_report(
    report_data: ReportData,
    report: Report,
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

    // verify that the report was signed by TEE
    let is_valid: bool = signature::verify(sig, pub_key, report_hash);
    assert(is_valid);
  }

  function verify_nitro_report(
    report_data: ReportData,
    report: Report,
    sig: signature,
    pub_key: address,
    hash_from_report: u128
  ) {
    let report_data_hash: u128 = Poseidon8::hash_to_u128(report_data);
    assert_eq(report_data_hash, hash_from_report);

    let report_hash: u128 = Poseidon8::hash_to_u128(report);

    // verify that the report was signed by TEE
    let is_valid: bool = signature::verify(sig, pub_key, report_hash);
    assert(is_valid);
  }

  async transition set_data_sgx(
    public report_data: ReportData,
    public report: Report,
    public sig: signature,
    public pub_key: address
  ) -> Future {
    assert_eq(report_data.c0.f4, VALID_HTTP_STATUS);
    verify_sgx_report(report_data, report, sig, pub_key);

    let request_hash: u128 = get_request_hash(report_data);

    let struct_to_hash: TimestampedHash = TimestampedHash {
      request_hash: request_hash,
      attestation_timestamp: report_data.c0.f3
    };

    let timestamped_hash: u128 = Poseidon8::hash_to_u128(struct_to_hash);

    let attested_data: AttestedData = AttestedData {
      data: report_data.c0.f2,
      attestation_timestamp: report_data.c0.f3
    };

    return finalize_set_data_sgx(
      request_hash,
      timestamped_hash,
      attested_data,
      report.c0.f8,
      report.c0.f9,
      pub_key
    );
  }

  async function finalize_set_data_sgx(
    public request_hash: u128,
    public timestamped_hash: u128,
    public attested_data: AttestedData,
    public report_unique_id_1: u128,
    public report_unique_id_2: u128,
    public pub_key: address
  ) {
    let pub_key_allowed: bool = Mapping::get_or_use(allowed_keys, pub_key, false);
    assert(pub_key_allowed);

    assert(Mapping::get(status, STATUS_INDEX) == UNPAUSED_VALUE); // oracle must be unpaused

    // verify unique id from the TEE report
    let unique_id: UniqueID = Mapping::get(sgx_unique_id, 0u8);
    assert_eq(unique_id.chunk_1, report_unique_id_1);
    assert_eq(unique_id.chunk_2, report_unique_id_2);

    Mapping::set(sgx_attested_data, timestamped_hash, attested_data);

    // replace latest data if current data is newer
    let latest_data: AttestedData = Mapping::get_or_use(sgx_attested_data, request_hash, AttestedData { data: 0u128, attestation_timestamp: 0u128 });

    if (attested_data.attestation_timestamp > latest_data.attestation_timestamp) {
      Mapping::set(sgx_attested_data, request_hash, attested_data);
    }
  }

  async transition set_data_nitro(
    public report_data: ReportData,
    public report: Report,
    public sig: signature,
    public pub_key: address,
    public data_position: PositionData,
    public pcr_0_position: PositionData,
    public pcr_1_position: PositionData,
    public pcr_2_position: PositionData
  ) -> Future {
    let hash_blocks: (u128, u128, u128, u128) = select_chunk(report.c8, data_position.block_index);
    let data_hash_from_report: u128 = extract_value(hash_blocks.0, hash_blocks.1, data_position);

    assert_eq(report_data.c0.f4, VALID_HTTP_STATUS);
    verify_nitro_report(report_data, report, sig, pub_key, data_hash_from_report);

    let request_hash: u128 = get_request_hash(report_data);

    let struct_to_hash: TimestampedHash = TimestampedHash {
      request_hash: request_hash,
      attestation_timestamp: report_data.c0.f3
    };

    let timestamped_hash: u128 = Poseidon8::hash_to_u128(struct_to_hash);

    let attested_data: AttestedData = AttestedData {
      data: report_data.c0.f2,
      attestation_timestamp: report_data.c0.f3
    };

    let pcr_0_block: (u128, u128, u128, u128) = select_chunk(report.c0, pcr_0_position.block_index);
    let pcr_0_chunk_1: u128 = extract_value(pcr_0_block.0, pcr_0_block.1, pcr_0_position);
    let pcr_0_chunk_2: u128 = extract_value(pcr_0_block.1, pcr_0_block.2, pcr_0_position);
    let pcr_0_chunk_3: u128 = extract_value(pcr_0_block.2, pcr_0_block.3, pcr_0_position);

    let pcr_1_block: (u128, u128, u128, u128) = select_chunk(report.c0, pcr_1_position.block_index);
    let pcr_1_chunk_1: u128 = extract_value(pcr_1_block.0, pcr_1_block.1, pcr_1_position);
    let pcr_1_chunk_2: u128 = extract_value(pcr_1_block.1, pcr_1_block.2, pcr_1_position);
    let pcr_1_chunk_3: u128 = extract_value(pcr_1_block.2, pcr_1_block.3, pcr_1_position);

    let pcr_2_block: (u128, u128, u128, u128) = select_chunk(report.c0, pcr_2_position.block_index);
    let pcr_2_chunk_1: u128 = extract_value(pcr_2_block.0, pcr_2_block.1, pcr_2_position);
    let pcr_2_chunk_2: u128 = extract_value(pcr_2_block.1, pcr_2_block.2, pcr_2_position);
    let pcr_2_chunk_3: u128 = extract_value(pcr_2_block.2, pcr_2_block.3, pcr_2_position);

    let pcr_values: PcrValues = PcrValues {
      pcr_0_chunk_1: pcr_0_chunk_1,
      pcr_0_chunk_2: pcr_0_chunk_2,
      pcr_0_chunk_3: pcr_0_chunk_3,
      pcr_1_chunk_1: pcr_1_chunk_1,
      pcr_1_chunk_2: pcr_1_chunk_2,
      pcr_1_chunk_3: pcr_1_chunk_3,
      pcr_2_chunk_1: pcr_2_chunk_1,
      pcr_2_chunk_2: pcr_2_chunk_2,
      pcr_2_chunk_3: pcr_2_chunk_3
    };

    return finalize_set_data_nitro(
      request_hash,
      timestamped_hash,
      attested_data,
      pcr_values,
      pub_key
    );
  }

  async function finalize_set_data_nitro(
    public request_hash: u128,
    public timestamped_hash: u128,
    public attested_data: AttestedData,
    public report_pcr_values: PcrValues,
    public pub_key: address
  ) {
    let pub_key_allowed: bool = Mapping::get_or_use(allowed_keys, pub_key, false);
    assert(pub_key_allowed);

    assert(Mapping::get(status, STATUS_INDEX) == UNPAUSED_VALUE); // oracle must be unpaused

    let pcr_values: PcrValues = Mapping::get(nitro_pcr_values, 0u8);
    assert_eq(pcr_values, report_pcr_values);

    Mapping::set(nitro_attested_data, timestamped_hash, attested_data);

    // replace latest data if current data is newer
    let latest_data: AttestedData = Mapping::get_or_use(nitro_attested_data, request_hash, AttestedData { data: 0u128, attestation_timestamp: 0u128 });

    if (attested_data.attestation_timestamp > latest_data.attestation_timestamp) {
      Mapping::set(nitro_attested_data, request_hash, attested_data);
    }
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
    c7: DataChunk
  }


  async transition update_historic_data (public is_sgx_attested_data: bool, public timestamped_hash: u128, public request_hash: u128, public attested_data: AttestedData) -> Future {
      return finalize_update_historic_data(self.caller, is_sgx_attested_data, timestamped_hash, request_hash, attested_data);
  }

  async function finalize_update_historic_data(public from: address, public is_sgx_attested_data: bool, public timestamped_hash: u128, public request_hash: u128, public attested_data: AttestedData) {
    let current_owner: address = Mapping::get(admin, OWNER_INDEX);
    assert_eq(from, current_owner);

    if (is_sgx_attested_data) {
      assert(Mapping::contains(sgx_attested_data, timestamped_hash));
      assert(Mapping::contains(sgx_attested_data, request_hash));
      Mapping::set(sgx_attested_data, timestamped_hash, attested_data);
      Mapping::set(sgx_attested_data, request_hash, attested_data);
    } else {  
      assert(Mapping::contains(nitro_attested_data, timestamped_hash));
      assert(Mapping::contains(nitro_attested_data, request_hash));
      Mapping::set(nitro_attested_data, request_hash, attested_data);
      Mapping::set(nitro_attested_data, timestamped_hash, attested_data);
    }


  }



}