import veru_oracle_checksum_v5.aleo;

program veru_oracle_data_v5.aleo {

    // upgrade through the checksum mapping in another program
    @checksum(mapping="veru_oracle_checksum_v5.aleo/approved_checksums", key="veru_oracle_data_v5.aleo")
    async constructor() {
        // The Leo compiler automatically generates the constructor logic.
    }


// 32 byte enclave unique_id
  // split into 2 16 byte u128 chunks
  struct UniqueID {
    chunk_1: u128,
    chunk_2: u128
  }

  struct AttestedData {
    data: u128,
    attestation_timestamp: u128
  }

  struct TimestampedHash {
    request_hash: u128,
    attestation_timestamp: u128
  }

  struct TimestampedAttestation {
      request_hash: u128,
      timestamped_hash: u128,
      attested_data: AttestedData
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

  struct NewReport {
    c0: DataChunk
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


  // initializer of a contract
  const initializer: address = aleo1fg8y0ax9g0yhahrknngzwxkpcf7ejy3mm6cent4mmtwew5ueps8s6jzl27;
  const OWNER_INDEX: bool = true;
  const STATUS_INDEX: u8 = 0u8;
  const PAUSED_VALUE: bool = true;
  const UNPAUSED_VALUE: bool = false;
  const VALID_HTTP_STATUS: u128 = 200u128;

  mapping admin: bool => address;
  mapping status: u8 => bool;


  // unique_id is always stored with 0u8 key
  mapping sgx_unique_id: u8 => UniqueID;

  // mapping with allowed enclave keys
  mapping allowed_keys: address => bool;

  // storage of data attested by sgx
  // hash of notarization request with timestamp => Attested_Data
  // or just hash of notarization request for the lastest stored data
  mapping sgx_attested_data: u128 => AttestedData;

  // zero hash value
  const ZERO_REPORT_DATA_HASH: u128 = 80824152642381387473083613428479139074u128;

  const ARRAY_SIZE: u8 = 5u8;

async transition initialize(public owner_address: address) -> Future {
    // can be called only once
    assert_eq(self.caller, initializer);
    return finalize_initialize(owner_address);
  }

  // finalize initialization
  async function finalize_initialize(public owner_address: address) {
    // Assert bridge has not been initialized before
    assert(!Mapping::contains(admin, OWNER_INDEX));

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

        Mapping::set(status, STATUS_INDEX, UNPAUSED_VALUE);
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

  function get_request_hash(report_data: DataChunk) -> u128 {
    let report_data_chunk: DataChunk = DataChunk {
      f0: report_data.f0,
      f1: report_data.f1,
      f2: 0u128,
      f3: 0u128,
      f4: report_data.f4,
      f5: report_data.f5,
      f6: report_data.f6,
      f7: report_data.f7,
      f8: report_data.f8,
      f9: report_data.f9,
      f10: report_data.f10,
      f11: report_data.f11,
      f12: report_data.f12,
      f13: report_data.f13,
      f14: report_data.f14,
      f15: report_data.f15,
      f16: report_data.f16,
      f17: report_data.f17,
      f18: report_data.f18,
      f19: report_data.f19,
      f20: report_data.f20,
      f21: report_data.f21,
      f22: report_data.f22,
      f23: report_data.f23,
      f24: report_data.f24,
      f25: report_data.f25,
      f26: report_data.f26,
      f27: report_data.f27,
      f28: report_data.f28,
      f29: report_data.f29,
      f30: report_data.f30,
      f31: report_data.f31
    };

    let new_report: NewReport = NewReport {
      c0: report_data_chunk
    };

    let request_hash: u128 = Poseidon8::hash_to_u128(new_report);
    return request_hash;
  }


  /// Stores SGX-attested data after full verification and identity match,
  /// updating both a historical record keyed by a timestamped hash and the
  /// latest value keyed by a   stable `request_hash`.
  ///
  /// Pipeline:
  /// 1) Require HTTP status OK in `report_data.c0.f4 == 200`.
  /// 2) `verify_sgx_report(...)` to check SGX flags, data binding, and signature.
  /// 3) Compute `request_hash = get_request_hash(report_data)`.
  /// 4) Compute `timestamped_hash = Poseidon8({request_hash, attestation_timestamp})`.
  /// 5) Build `AttestedData { data: report_data.c0.f2, attestation_timestamp: report_data.c0.f3 }`.
  /// 6) `finalize_set_data_sgx(...)` enforces:
  ///    - Caller key is allowed
  ///    - Oracle is unpaused
  ///    - Report unique_id matches stored `sgx_unique_id`
  ///    - Historical write at `timestamped_hash`
  ///    - Latest write at `request_hash` only if timestamp is newer
  async transition set_sgx_data(
    public pub_key: address,
    public report_unique_id_1: u128,
    public report_unique_id_2: u128,
    public report_datas: [DataChunk; ARRAY_SIZE]
  ) -> Future {

    assert_eq(self.caller, veru_oracle_interface_v5.aleo);
    let attested_data: AttestedData = AttestedData { data: 0u128, attestation_timestamp: 0u128 };
    let data_packets: [TimestampedAttestation; ARRAY_SIZE] = [TimestampedAttestation {request_hash: ZERO_REPORT_DATA_HASH, timestamped_hash: 0u128, attested_data: attested_data}; ARRAY_SIZE];

    for i:u8 in 0u8..ARRAY_SIZE {
        if (report_datas[i].f1 != 0u128){
            data_packets[i].request_hash = get_request_hash(report_datas[i]);

            data_packets[i].timestamped_hash = Poseidon8::hash_to_u128(TimestampedHash {
                          request_hash: data_packets[i].request_hash,
                          attestation_timestamp: report_datas[i].f3
            });

            assert_eq(report_datas[i].f4, VALID_HTTP_STATUS);

            data_packets[i].attested_data = AttestedData {
                data: report_datas[i].f2,
                attestation_timestamp: report_datas[i].f3
            };
        }
    }

    return (f_set_sgx_data(
      self.caller,
      data_packets,
      report_unique_id_1,
      report_unique_id_2,
      pub_key
    ));
  }

  async function f_set_sgx_data(
    public from: address,
    public data_packets: [TimestampedAttestation; ARRAY_SIZE],
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

    assert(block.timestamp as u128 >= data_packets[0].attested_data.attestation_timestamp);

    for i: u8 in 0u8..ARRAY_SIZE {
      if (data_packets[i].request_hash != ZERO_REPORT_DATA_HASH) {
          Mapping::set(sgx_attested_data, data_packets[i].timestamped_hash, data_packets[i].attested_data);

                   // replace latest data if current data is newer
          let latest_data: AttestedData = Mapping::get_or_use(sgx_attested_data, data_packets[i].request_hash, AttestedData { data: 0u128, attestation_timestamp: 0u128 });

          if (data_packets[i].attested_data.attestation_timestamp > latest_data.attestation_timestamp) {
            Mapping::set(sgx_attested_data, data_packets[i].request_hash, data_packets[i].attested_data);
          }
      }
    }
  }




  /// Stores SGX-attested data after full verification and identity match,
  /// updating both a historical record keyed by a timestamped hash and the
  /// latest value keyed by a stable `request_hash`.
  ///
  /// Pipeline:
  /// 1) Require HTTP status OK in `report_data.c0.f4 == 200`.
  /// 2) `verify_sgx_report(...)` to check SGX flags, data binding, and signature.
  /// 3) Compute `request_hash = get_request_hash(report_data)`.
  /// 4) Compute `timestamped_hash = Poseidon8({request_hash, attestation_timestamp})`.
  /// 5) Build `AttestedData { data: report_data.c0.f2, attestation_timestamp: report_data.c0.f3 }`.
  /// 6) `finalize_set_data_sgx(...)` enforces:
  ///    - Caller key is allowed
  ///    - Oracle is unpaused
  ///    - Report unique_id matches stored `sgx_unique_id`
  ///    - Historical write at `timestamped_hash`
  ///    - Latest write at `request_hash` only if timestamp is newer
  async transition set_single_data_sgx(
    public report_data: DataChunk
  ) -> Future {
    
    assert_eq(self.caller, veru_oracle_interface_v5.aleo);

    let request_hash: u128 = get_request_hash(report_data);

    let struct_to_hash: TimestampedHash = TimestampedHash {
      request_hash: request_hash,
      attestation_timestamp: report_data.f3
    };

    let timestamped_hash: u128 = Poseidon8::hash_to_u128(struct_to_hash);

    let attested_data: AttestedData = AttestedData {
      data: report_data.f2,
      attestation_timestamp: report_data.f3
    };

    let data_packet = TimestampedAttestation {request_hash, timestamped_hash, attested_data};

    return finalize_set_single_sgx(
      self.caller,
      data_packet
    );
  }

  async function finalize_set_single_sgx(
    public from: address,
    public data_packet: TimestampedAttestation
  ) {

    // check timestamp
    assert(block.timestamp as u128 >= data_packet.attested_data.attestation_timestamp);

    Mapping::set(sgx_attested_data, data_packet.timestamped_hash, data_packet.attested_data);

    // replace latest data if current data is newer
    let latest_data: AttestedData = Mapping::get_or_use(sgx_attested_data, data_packet.request_hash, AttestedData { data: 0u128, attestation_timestamp: 0u128 });

    if (data_packet.attested_data.attestation_timestamp > latest_data.attestation_timestamp) {
      Mapping::set(sgx_attested_data, data_packet.request_hash, data_packet.attested_data);
    }
  }



  async transition update_historic_data ( public timestamped_hash: u128, public attested_data: AttestedData) -> Future {
      return finalize_update_historic_data(self.caller, timestamped_hash, attested_data);
  }

  async function finalize_update_historic_data(public from: address, public timestamped_hash: u128, public attested_data: AttestedData) {
    let current_owner: address = Mapping::get(admin, OWNER_INDEX);
    assert_eq(from, current_owner);
    assert(Mapping::contains(sgx_attested_data, timestamped_hash));
    Mapping::set(sgx_attested_data, timestamped_hash, attested_data);
  }


}