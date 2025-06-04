import {
  ReportData,
  Report,
  UniqueID,
  AttestedData
} from "./types/testing_vlink_oracle_v1";
import {
  getReportDataLeo,
  getReportLeo,
  getUniqueIDLeo,
  getAttestedDataLeo
} from "./js2leo/testing_vlink_oracle_v1";
import {
  getReportData,
  getReport,
  getUniqueID,
  getAttestedData
} from "./leo2js/testing_vlink_oracle_v1";
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
  TransactionModel
} from "@provablehq/sdk";
import * as receipt from "./transitions/testing_vlink_oracle_v1";

export class Testing_vlink_oracle_v1Contract extends BaseContract {

  constructor(config: Partial < ContractConfig > = {
    mode: ExecutionMode.LeoRun
  }) {
    super({
      ...config,
      appName: 'testing_vlink_oracle_v1',
      fee: '0.01',
      contractPath: 'artifacts/leo/testing_vlink_oracle_v1',
      isImportedAleo: false
    });
  }
  async set_data_sgx(r0: ReportData, r1: Report, r2: string, r3: LeoAddress, r4: UniqueID): Promise < TransactionResponse < TransactionModel & receipt.Testing_vlink_oracle_v1Set_data_sgxTransition, [bigint, bigint, AttestedData, bigint, bigint, LeoAddress] >> {
    const r0Leo = js2leo.json(getReportDataLeo(r0));
    const r1Leo = js2leo.json(getReportLeo(r1));
    const r2Leo = js2leo.signature(r2);
    const r3Leo = js2leo.address(r3);
    const r4Leo = js2leo.json(getUniqueIDLeo(r4));

    const params = [r0Leo, r1Leo, r2Leo, r3Leo, r4Leo]
    const result = await this.ctx.execute('set_data_sgx', params);
    result.set_converter_fn([leo2js.u128, leo2js.u128, getAttestedData, leo2js.u128, leo2js.u128, leo2js.address]);
    return result
  }


}