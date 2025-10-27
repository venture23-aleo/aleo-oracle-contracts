program testing.aleo {


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

  // storage of data attested by nitro
  // hash of notarization request with timestamp => Attested_Data
  // or just hash of notarization request for the lastest stored data
  mapping nitro_attested_data: u128 => AttestedData;



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



    transition set_data_sgx(
    public report_data: ReportData,
    public report: Report,
    public sig: signature,
    public pub_key: address
  ) -> AttestedData {
    assert_eq(report_data.c0.f4, VALID_HTTP_STATUS);

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

    return attested_data;
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





}