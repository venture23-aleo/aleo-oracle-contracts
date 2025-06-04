import {
  UniqueID,
  UniqueIDLeo,
  PcrValues,
  PcrValuesLeo,
  AttestedData,
  AttestedDataLeo,
  TimestampedHash,
  TimestampedHashLeo,
  PositionData,
  PositionDataLeo,
  DataChunk,
  DataChunkLeo,
  Report,
  ReportLeo,
  ReportData,
  ReportDataLeo
} from "../types/vlink_oracle_v0001";
import {
  js2leo
} from "@doko-js/core";


export function getUniqueIDLeo(uniqueID: UniqueID): UniqueIDLeo {
  const result: UniqueIDLeo = {
    chunk_1: js2leo.u128(uniqueID.chunk_1),
    chunk_2: js2leo.u128(uniqueID.chunk_2),
  }
  return result;
}

export function getPcrValuesLeo(pcrValues: PcrValues): PcrValuesLeo {
  const result: PcrValuesLeo = {
    pcr_0_chunk_1: js2leo.u128(pcrValues.pcr_0_chunk_1),
    pcr_0_chunk_2: js2leo.u128(pcrValues.pcr_0_chunk_2),
    pcr_0_chunk_3: js2leo.u128(pcrValues.pcr_0_chunk_3),
    pcr_1_chunk_1: js2leo.u128(pcrValues.pcr_1_chunk_1),
    pcr_1_chunk_2: js2leo.u128(pcrValues.pcr_1_chunk_2),
    pcr_1_chunk_3: js2leo.u128(pcrValues.pcr_1_chunk_3),
    pcr_2_chunk_1: js2leo.u128(pcrValues.pcr_2_chunk_1),
    pcr_2_chunk_2: js2leo.u128(pcrValues.pcr_2_chunk_2),
    pcr_2_chunk_3: js2leo.u128(pcrValues.pcr_2_chunk_3),
  }
  return result;
}

export function getAttestedDataLeo(attestedData: AttestedData): AttestedDataLeo {
  const result: AttestedDataLeo = {
    data: js2leo.u128(attestedData.data),
    attestation_timestamp: js2leo.u128(attestedData.attestation_timestamp),
  }
  return result;
}

export function getTimestampedHashLeo(timestampedHash: TimestampedHash): TimestampedHashLeo {
  const result: TimestampedHashLeo = {
    request_hash: js2leo.u128(timestampedHash.request_hash),
    attestation_timestamp: js2leo.u128(timestampedHash.attestation_timestamp),
  }
  return result;
}

export function getPositionDataLeo(positionData: PositionData): PositionDataLeo {
  const result: PositionDataLeo = {
    block_index: js2leo.u8(positionData.block_index),
    shift_a: js2leo.u8(positionData.shift_a),
    shift_b: js2leo.u8(positionData.shift_b),
    mask_a: js2leo.u128(positionData.mask_a),
    mask_b: js2leo.u128(positionData.mask_b),
  }
  return result;
}

export function getDataChunkLeo(dataChunk: DataChunk): DataChunkLeo {
  const result: DataChunkLeo = {
    f0: js2leo.u128(dataChunk.f0),
    f1: js2leo.u128(dataChunk.f1),
    f2: js2leo.u128(dataChunk.f2),
    f3: js2leo.u128(dataChunk.f3),
    f4: js2leo.u128(dataChunk.f4),
    f5: js2leo.u128(dataChunk.f5),
    f6: js2leo.u128(dataChunk.f6),
    f7: js2leo.u128(dataChunk.f7),
    f8: js2leo.u128(dataChunk.f8),
    f9: js2leo.u128(dataChunk.f9),
    f10: js2leo.u128(dataChunk.f10),
    f11: js2leo.u128(dataChunk.f11),
    f12: js2leo.u128(dataChunk.f12),
    f13: js2leo.u128(dataChunk.f13),
    f14: js2leo.u128(dataChunk.f14),
    f15: js2leo.u128(dataChunk.f15),
    f16: js2leo.u128(dataChunk.f16),
    f17: js2leo.u128(dataChunk.f17),
    f18: js2leo.u128(dataChunk.f18),
    f19: js2leo.u128(dataChunk.f19),
    f20: js2leo.u128(dataChunk.f20),
    f21: js2leo.u128(dataChunk.f21),
    f22: js2leo.u128(dataChunk.f22),
    f23: js2leo.u128(dataChunk.f23),
    f24: js2leo.u128(dataChunk.f24),
    f25: js2leo.u128(dataChunk.f25),
    f26: js2leo.u128(dataChunk.f26),
    f27: js2leo.u128(dataChunk.f27),
    f28: js2leo.u128(dataChunk.f28),
    f29: js2leo.u128(dataChunk.f29),
    f30: js2leo.u128(dataChunk.f30),
    f31: js2leo.u128(dataChunk.f31),
  }
  return result;
}

export function getReportLeo(report: Report): ReportLeo {
  const result: ReportLeo = {
    c0: getDataChunkLeo(report.c0),
    c1: getDataChunkLeo(report.c1),
    c2: getDataChunkLeo(report.c2),
    c3: getDataChunkLeo(report.c3),
    c4: getDataChunkLeo(report.c4),
    c5: getDataChunkLeo(report.c5),
    c6: getDataChunkLeo(report.c6),
    c7: getDataChunkLeo(report.c7),
    c8: getDataChunkLeo(report.c8),
    c9: getDataChunkLeo(report.c9),
  }
  return result;
}

export function getReportDataLeo(reportData: ReportData): ReportDataLeo {
  const result: ReportDataLeo = {
    c0: getDataChunkLeo(reportData.c0),
    c1: getDataChunkLeo(reportData.c1),
    c2: getDataChunkLeo(reportData.c2),
    c3: getDataChunkLeo(reportData.c3),
    c4: getDataChunkLeo(reportData.c4),
    c5: getDataChunkLeo(reportData.c5),
    c6: getDataChunkLeo(reportData.c6),
    c7: getDataChunkLeo(reportData.c7),
  }
  return result;
}