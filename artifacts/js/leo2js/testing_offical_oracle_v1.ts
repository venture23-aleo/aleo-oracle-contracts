import {
  DataChunk,
  DataChunkLeo,
  Report,
  ReportLeo,
  ReportData,
  ReportDataLeo,
  AttestedData,
  AttestedDataLeo,
  TimestampedHash,
  TimestampedHashLeo,
  UniqueID,
  UniqueIDLeo
} from "../types/testing_offical_oracle_v1";
import {
  leo2js,
  tx,
  parseJSONLikeString
} from "@doko-js/core";
import {
  PrivateKey
} from "@provablehq/sdk"


export function getDataChunk(dataChunk: DataChunkLeo): DataChunk {
  const result: DataChunk = {
    f0: leo2js.u128(dataChunk.f0),
    f1: leo2js.u128(dataChunk.f1),
    f2: leo2js.u128(dataChunk.f2),
    f3: leo2js.u128(dataChunk.f3),
    f4: leo2js.u128(dataChunk.f4),
    f5: leo2js.u128(dataChunk.f5),
    f6: leo2js.u128(dataChunk.f6),
    f7: leo2js.u128(dataChunk.f7),
    f8: leo2js.u128(dataChunk.f8),
    f9: leo2js.u128(dataChunk.f9),
    f10: leo2js.u128(dataChunk.f10),
    f11: leo2js.u128(dataChunk.f11),
    f12: leo2js.u128(dataChunk.f12),
    f13: leo2js.u128(dataChunk.f13),
    f14: leo2js.u128(dataChunk.f14),
    f15: leo2js.u128(dataChunk.f15),
    f16: leo2js.u128(dataChunk.f16),
    f17: leo2js.u128(dataChunk.f17),
    f18: leo2js.u128(dataChunk.f18),
    f19: leo2js.u128(dataChunk.f19),
    f20: leo2js.u128(dataChunk.f20),
    f21: leo2js.u128(dataChunk.f21),
    f22: leo2js.u128(dataChunk.f22),
    f23: leo2js.u128(dataChunk.f23),
    f24: leo2js.u128(dataChunk.f24),
    f25: leo2js.u128(dataChunk.f25),
    f26: leo2js.u128(dataChunk.f26),
    f27: leo2js.u128(dataChunk.f27),
    f28: leo2js.u128(dataChunk.f28),
    f29: leo2js.u128(dataChunk.f29),
    f30: leo2js.u128(dataChunk.f30),
    f31: leo2js.u128(dataChunk.f31),
  }
  return result;
}

export function getReport(report: ReportLeo): Report {
  const result: Report = {
    c0: getDataChunk(report.c0),
    c1: getDataChunk(report.c1),
    c2: getDataChunk(report.c2),
    c3: getDataChunk(report.c3),
    c4: getDataChunk(report.c4),
    c5: getDataChunk(report.c5),
    c6: getDataChunk(report.c6),
    c7: getDataChunk(report.c7),
    c8: getDataChunk(report.c8),
    c9: getDataChunk(report.c9),
  }
  return result;
}

export function getReportData(reportData: ReportDataLeo): ReportData {
  const result: ReportData = {
    c0: getDataChunk(reportData.c0),
    c1: getDataChunk(reportData.c1),
    c2: getDataChunk(reportData.c2),
    c3: getDataChunk(reportData.c3),
    c4: getDataChunk(reportData.c4),
    c5: getDataChunk(reportData.c5),
    c6: getDataChunk(reportData.c6),
    c7: getDataChunk(reportData.c7),
  }
  return result;
}

export function getAttestedData(attestedData: AttestedDataLeo): AttestedData {
  const result: AttestedData = {
    data: leo2js.u128(attestedData.data),
    attestation_timestamp: leo2js.u128(attestedData.attestation_timestamp),
  }
  return result;
}

export function getTimestampedHash(timestampedHash: TimestampedHashLeo): TimestampedHash {
  const result: TimestampedHash = {
    request_hash: leo2js.u128(timestampedHash.request_hash),
    attestation_timestamp: leo2js.u128(timestampedHash.attestation_timestamp),
  }
  return result;
}

export function getUniqueID(uniqueID: UniqueIDLeo): UniqueID {
  const result: UniqueID = {
    chunk_1: leo2js.u128(uniqueID.chunk_1),
    chunk_2: leo2js.u128(uniqueID.chunk_2),
  }
  return result;
}