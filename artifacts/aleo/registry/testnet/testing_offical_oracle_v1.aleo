program testing_offical_oracle_v1.aleo;

struct DataChunk:
    f0 as u128;
    f1 as u128;
    f2 as u128;
    f3 as u128;
    f4 as u128;
    f5 as u128;
    f6 as u128;
    f7 as u128;
    f8 as u128;
    f9 as u128;
    f10 as u128;
    f11 as u128;
    f12 as u128;
    f13 as u128;
    f14 as u128;
    f15 as u128;
    f16 as u128;
    f17 as u128;
    f18 as u128;
    f19 as u128;
    f20 as u128;
    f21 as u128;
    f22 as u128;
    f23 as u128;
    f24 as u128;
    f25 as u128;
    f26 as u128;
    f27 as u128;
    f28 as u128;
    f29 as u128;
    f30 as u128;
    f31 as u128;

struct Report:
    c0 as DataChunk;
    c1 as DataChunk;
    c2 as DataChunk;
    c3 as DataChunk;
    c4 as DataChunk;
    c5 as DataChunk;
    c6 as DataChunk;
    c7 as DataChunk;
    c8 as DataChunk;
    c9 as DataChunk;

struct ReportData:
    c0 as DataChunk;
    c1 as DataChunk;
    c2 as DataChunk;
    c3 as DataChunk;
    c4 as DataChunk;
    c5 as DataChunk;
    c6 as DataChunk;
    c7 as DataChunk;

struct AttestedData:
    data as u128;
    attestation_timestamp as u128;

struct TimestampedHash:
    request_hash as u128;
    attestation_timestamp as u128;

struct UniqueID:
    chunk_1 as u128;
    chunk_2 as u128;

function set_data_sgx:
    input r0 as ReportData.public;
    input r1 as Report.public;
    input r2 as signature.public;
    input r3 as address.public;
    input r4 as UniqueID.public;
    and r1.c0.f7 1u128 into r5;
    assert.eq r5 1u128;
    and r1.c0.f7 2u128 into r6;
    assert.eq r6 0u128;
    and r1.c0.f7 4u128 into r7;
    assert.eq r7 4u128;
    hash.psd8 r0 into r8 as u128;
    assert.eq r8 r1.c0.f24;
    assert.eq 0u128 r1.c0.f25;
    assert.eq 0u128 r1.c0.f26;
    assert.eq 0u128 r1.c0.f27;
    cast r0.c0.f0 r0.c0.f1 0u128 0u128 r0.c0.f4 r0.c0.f5 r0.c0.f6 r0.c0.f7 r0.c0.f8 r0.c0.f9 r0.c0.f10 r0.c0.f11 r0.c0.f12 r0.c0.f13 r0.c0.f14 r0.c0.f15 r0.c0.f16 r0.c0.f17 r0.c0.f18 r0.c0.f19 r0.c0.f20 r0.c0.f21 r0.c0.f22 r0.c0.f23 r0.c0.f24 r0.c0.f25 r0.c0.f26 r0.c0.f27 r0.c0.f28 r0.c0.f29 r0.c0.f30 r0.c0.f31 into r9 as DataChunk;
    cast r9 r0.c1 r0.c2 r0.c3 r0.c4 r0.c5 r0.c6 r0.c7 into r10 as ReportData;
    hash.psd8 r10 into r11 as u128;
    cast r11 r0.c0.f3 into r12 as TimestampedHash;
    hash.psd8 r12 into r13 as u128;
    cast r0.c0.f2 r0.c0.f3 into r14 as AttestedData;
    assert.eq r4.chunk_1 r1.c0.f8;
    assert.eq r4.chunk_2 r1.c0.f9;
    output r11 as u128.private;
    output r13 as u128.private;
    output r14 as AttestedData.private;
    output r1.c0.f8 as u128.private;
    output r1.c0.f9 as u128.private;
    output r3 as address.private;
