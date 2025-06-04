import {
  z
} from "zod";
import {
  leoAddressSchema,
  leoPrivateKeySchema,
  leoViewKeySchema,
  leoTxIdSchema,
  leoScalarSchema,
  leoFieldSchema,
  leoBooleanSchema,
  leoU8Schema,
  leoU16Schema,
  leoU32Schema,
  leoU64Schema,
  leoU128Schema,
  leoGroupSchema,
  leoRecordSchema,
  leoTxSchema,
  leoSignatureSchema,
  LeoArray,
  LeoAddress,
  ExternalRecord,
  tx
} from "@doko-js/core";

export interface UniqueID {
  chunk_1: bigint;
  chunk_2: bigint;
}

export const leoUniqueIDSchema = z.object({
  chunk_1: leoU128Schema,
  chunk_2: leoU128Schema,
});
export type UniqueIDLeo = z.infer < typeof leoUniqueIDSchema > ;

export interface PcrValues {
  pcr_0_chunk_1: bigint;
  pcr_0_chunk_2: bigint;
  pcr_0_chunk_3: bigint;
  pcr_1_chunk_1: bigint;
  pcr_1_chunk_2: bigint;
  pcr_1_chunk_3: bigint;
  pcr_2_chunk_1: bigint;
  pcr_2_chunk_2: bigint;
  pcr_2_chunk_3: bigint;
}

export const leoPcrValuesSchema = z.object({
  pcr_0_chunk_1: leoU128Schema,
  pcr_0_chunk_2: leoU128Schema,
  pcr_0_chunk_3: leoU128Schema,
  pcr_1_chunk_1: leoU128Schema,
  pcr_1_chunk_2: leoU128Schema,
  pcr_1_chunk_3: leoU128Schema,
  pcr_2_chunk_1: leoU128Schema,
  pcr_2_chunk_2: leoU128Schema,
  pcr_2_chunk_3: leoU128Schema,
});
export type PcrValuesLeo = z.infer < typeof leoPcrValuesSchema > ;

export interface AttestedData {
  data: bigint;
  attestation_timestamp: bigint;
}

export const leoAttestedDataSchema = z.object({
  data: leoU128Schema,
  attestation_timestamp: leoU128Schema,
});
export type AttestedDataLeo = z.infer < typeof leoAttestedDataSchema > ;

export interface TimestampedHash {
  request_hash: bigint;
  attestation_timestamp: bigint;
}

export const leoTimestampedHashSchema = z.object({
  request_hash: leoU128Schema,
  attestation_timestamp: leoU128Schema,
});
export type TimestampedHashLeo = z.infer < typeof leoTimestampedHashSchema > ;

export interface PositionData {
  block_index: number;
  shift_a: number;
  shift_b: number;
  mask_a: bigint;
  mask_b: bigint;
}

export const leoPositionDataSchema = z.object({
  block_index: leoU8Schema,
  shift_a: leoU8Schema,
  shift_b: leoU8Schema,
  mask_a: leoU128Schema,
  mask_b: leoU128Schema,
});
export type PositionDataLeo = z.infer < typeof leoPositionDataSchema > ;

export interface DataChunk {
  f0: bigint;
  f1: bigint;
  f2: bigint;
  f3: bigint;
  f4: bigint;
  f5: bigint;
  f6: bigint;
  f7: bigint;
  f8: bigint;
  f9: bigint;
  f10: bigint;
  f11: bigint;
  f12: bigint;
  f13: bigint;
  f14: bigint;
  f15: bigint;
  f16: bigint;
  f17: bigint;
  f18: bigint;
  f19: bigint;
  f20: bigint;
  f21: bigint;
  f22: bigint;
  f23: bigint;
  f24: bigint;
  f25: bigint;
  f26: bigint;
  f27: bigint;
  f28: bigint;
  f29: bigint;
  f30: bigint;
  f31: bigint;
}

export const leoDataChunkSchema = z.object({
  f0: leoU128Schema,
  f1: leoU128Schema,
  f2: leoU128Schema,
  f3: leoU128Schema,
  f4: leoU128Schema,
  f5: leoU128Schema,
  f6: leoU128Schema,
  f7: leoU128Schema,
  f8: leoU128Schema,
  f9: leoU128Schema,
  f10: leoU128Schema,
  f11: leoU128Schema,
  f12: leoU128Schema,
  f13: leoU128Schema,
  f14: leoU128Schema,
  f15: leoU128Schema,
  f16: leoU128Schema,
  f17: leoU128Schema,
  f18: leoU128Schema,
  f19: leoU128Schema,
  f20: leoU128Schema,
  f21: leoU128Schema,
  f22: leoU128Schema,
  f23: leoU128Schema,
  f24: leoU128Schema,
  f25: leoU128Schema,
  f26: leoU128Schema,
  f27: leoU128Schema,
  f28: leoU128Schema,
  f29: leoU128Schema,
  f30: leoU128Schema,
  f31: leoU128Schema,
});
export type DataChunkLeo = z.infer < typeof leoDataChunkSchema > ;

export interface Report {
  c0: DataChunk;
  c1: DataChunk;
  c2: DataChunk;
  c3: DataChunk;
  c4: DataChunk;
  c5: DataChunk;
  c6: DataChunk;
  c7: DataChunk;
  c8: DataChunk;
  c9: DataChunk;
}

export const leoReportSchema = z.object({
  c0: leoDataChunkSchema,
  c1: leoDataChunkSchema,
  c2: leoDataChunkSchema,
  c3: leoDataChunkSchema,
  c4: leoDataChunkSchema,
  c5: leoDataChunkSchema,
  c6: leoDataChunkSchema,
  c7: leoDataChunkSchema,
  c8: leoDataChunkSchema,
  c9: leoDataChunkSchema,
});
export type ReportLeo = z.infer < typeof leoReportSchema > ;

export interface ReportData {
  c0: DataChunk;
  c1: DataChunk;
  c2: DataChunk;
  c3: DataChunk;
  c4: DataChunk;
  c5: DataChunk;
  c6: DataChunk;
  c7: DataChunk;
}

export const leoReportDataSchema = z.object({
  c0: leoDataChunkSchema,
  c1: leoDataChunkSchema,
  c2: leoDataChunkSchema,
  c3: leoDataChunkSchema,
  c4: leoDataChunkSchema,
  c5: leoDataChunkSchema,
  c6: leoDataChunkSchema,
  c7: leoDataChunkSchema,
});
export type ReportDataLeo = z.infer < typeof leoReportDataSchema > ;