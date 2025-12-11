import {
  UniqueID,
  PcrValues,
  ReportData,
  Report,
  PositionData,
  AttestedData
} from "./types/vlink_oracle_v0001";
import {
  getUniqueIDLeo,
  getPcrValuesLeo,
  getReportDataLeo,
  getReportLeo,
  getPositionDataLeo,
  getAttestedDataLeo
} from "./js2leo/vlink_oracle_v0001";
import {
  getUniqueID,
  getPcrValues,
  getReportData,
  getReport,
  getPositionData,
  getAttestedData
} from "./leo2js/vlink_oracle_v0001";
import {
  ContractConfig,
  zkGetMapping,
  LeoAddress,
  LeoRecord,
  js2leo,
  leo2js,
  ExternalRecord,
  ExecutionMode,
  ExecutionContext,
  CreateExecutionContext,
  TransactionResponse
} from "@doko-js/core";
import {
  BaseContract
} from "../../contract/base-contract";
import {
  Transaction
} from "@provablehq/sdk";
import * as receipt from "./transitions/vlink_oracle_v0001";

export class Vlink_oracle_v0001Contract extends BaseContract {

  constructor(config: Partial < ContractConfig > = {
    mode: ExecutionMode.LeoRun
  }) {
    super({
      ...config,
      appName: 'vlink_oracle_v0001',
      fee: '0.01',
      contractPath: 'artifacts/leo/vlink_oracle_v0001',
      isImportedAleo: false
    });
  }
  async set_unique_id(r0: UniqueID): Promise < TransactionResponse < Transaction & receipt.Vlink_oracle_v0001Set_unique_idTransition, [] >> {
    const r0Leo = js2leo.json(getUniqueIDLeo(r0));

    const params = [r0Leo]
    const result = await this.ctx.execute('set_unique_id', params);
    return result
  }

  async set_pcr_values(r0: PcrValues): Promise < TransactionResponse < Transaction & receipt.Vlink_oracle_v0001Set_pcr_valuesTransition, [] >> {
    const r0Leo = js2leo.json(getPcrValuesLeo(r0));

    const params = [r0Leo]
    const result = await this.ctx.execute('set_pcr_values', params);
    return result
  }

  async set_key(r0: LeoAddress, r1: boolean): Promise < TransactionResponse < Transaction & receipt.Vlink_oracle_v0001Set_keyTransition, [] >> {
    const r0Leo = js2leo.address(r0);
    const r1Leo = js2leo.boolean(r1);

    const params = [r0Leo, r1Leo]
    const result = await this.ctx.execute('set_key', params);
    return result
  }

  async set_data_sgx(r0: ReportData, r1: Report, r2: string, r3: LeoAddress): Promise < TransactionResponse < Transaction & receipt.Vlink_oracle_v0001Set_data_sgxTransition, [] >> {
    const r0Leo = js2leo.json(getReportDataLeo(r0));
    const r1Leo = js2leo.json(getReportLeo(r1));
    const r2Leo = js2leo.signature(r2);
    const r3Leo = js2leo.address(r3);

    const params = [r0Leo, r1Leo, r2Leo, r3Leo]
    const result = await this.ctx.execute('set_data_sgx', params);
    return result
  }

  async set_data_nitro(r0: ReportData, r1: Report, r2: string, r3: LeoAddress, r4: PositionData, r5: PositionData, r6: PositionData, r7: PositionData): Promise < TransactionResponse < Transaction & receipt.Vlink_oracle_v0001Set_data_nitroTransition, [] >> {
    const r0Leo = js2leo.json(getReportDataLeo(r0));
    const r1Leo = js2leo.json(getReportLeo(r1));
    const r2Leo = js2leo.signature(r2);
    const r3Leo = js2leo.address(r3);
    const r4Leo = js2leo.json(getPositionDataLeo(r4));
    const r5Leo = js2leo.json(getPositionDataLeo(r5));
    const r6Leo = js2leo.json(getPositionDataLeo(r6));
    const r7Leo = js2leo.json(getPositionDataLeo(r7));

    const params = [r0Leo, r1Leo, r2Leo, r3Leo, r4Leo, r5Leo, r6Leo, r7Leo]
    const result = await this.ctx.execute('set_data_nitro', params);
    return result
  }

  async sgx_unique_id(key: number, defaultValue ? : UniqueID): Promise < UniqueID > {
    const keyLeo = js2leo.u8(key);

    const params = [keyLeo]
    const result = await zkGetMapping(
      this.config,
      'sgx_unique_id',
      params[0],
    );

    if (result != null)
      return getUniqueID(result);
    else {
      if (defaultValue != undefined) return defaultValue;
      throw new Error(`sgx_unique_id returned invalid value[input: ${key}, output: ${result}`);
    }
  }

  async nitro_pcr_values(key: number, defaultValue ? : PcrValues): Promise < PcrValues > {
    const keyLeo = js2leo.u8(key);

    const params = [keyLeo]
    const result = await zkGetMapping(
      this.config,
      'nitro_pcr_values',
      params[0],
    );

    if (result != null)
      return getPcrValues(result);
    else {
      if (defaultValue != undefined) return defaultValue;
      throw new Error(`nitro_pcr_values returned invalid value[input: ${key}, output: ${result}`);
    }
  }

  async allowed_keys(key: LeoAddress, defaultValue ? : boolean): Promise < boolean > {
    const keyLeo = js2leo.address(key);

    const params = [keyLeo]
    const result = await zkGetMapping(
      this.config,
      'allowed_keys',
      params[0],
    );

    if (result != null)
      return leo2js.boolean(result);
    else {
      if (defaultValue != undefined) return defaultValue;
      throw new Error(`allowed_keys returned invalid value[input: ${key}, output: ${result}`);
    }
  }

  async sgx_attested_data(key: bigint, defaultValue ? : AttestedData): Promise < AttestedData > {
    const keyLeo = js2leo.u128(key);

    const params = [keyLeo]
    const result = await zkGetMapping(
      this.config,
      'sgx_attested_data',
      params[0],
    );

    if (result != null)
      return getAttestedData(result);
    else {
      if (defaultValue != undefined) return defaultValue;
      throw new Error(`sgx_attested_data returned invalid value[input: ${key}, output: ${result}`);
    }
  }

  async nitro_attested_data(key: bigint, defaultValue ? : AttestedData): Promise < AttestedData > {
    const keyLeo = js2leo.u128(key);

    const params = [keyLeo]
    const result = await zkGetMapping(
      this.config,
      'nitro_attested_data',
      params[0],
    );

    if (result != null)
      return getAttestedData(result);
    else {
      if (defaultValue != undefined) return defaultValue;
      throw new Error(`nitro_attested_data returned invalid value[input: ${key}, output: ${result}`);
    }
  }


}