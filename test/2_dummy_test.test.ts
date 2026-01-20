import { ExecutionMode, parseJSONLikeString } from '@doko-js/core';
const TIMEOUT = 20000_000;
import data from './new_file.json';
import singleData from './aleo_request.json';
import { getAttestedData, getReport, getReportData, getTimestampedAttestation } from '../artifacts/js/leo2js/veru_oracle_data_v5';
import { Veru_oracle_checksum_v5Contract } from '../artifacts/js/veru_oracle_checksum_v5';
import { AttestedData, TimestampedAttestation } from '../artifacts/js/types/veru_oracle_data_v5';
import { js2leo as js2leoCommon, LeoU128 } from '@doko-js/core';
import { leo2js as leo2jsCommon } from '@doko-js/core';

import { hash } from "aleo-hasher";
import { Veru_oracle_testContract } from '../artifacts/js/veru_oracle_test';
import { u128 } from '@doko-js/core/dist/leo-types/leo2js';
import { Veru_oracle_inter_testContract } from '../artifacts/js/veru_oracle_inter_test';



// Available modes are evaluate | execute (Check README.md for further description)
const mode = ExecutionMode.SnarkExecute;
// Contract class initialization
const oracle_data = new Veru_oracle_testContract({ mode });
const oracle_interface = new Veru_oracle_inter_testContract({ mode });
const checkSum = new Veru_oracle_checksum_v5Contract({ mode });


const [owner, aleoUser2, aleoUser3] = oracle_data.getAccounts();
const OWNER_INDEX = true;
  const STATUS_INDEX = 0;
  const PAUSED_VALUE = true;
  const UNPAUSED_VALUE = false;
  const VALID_HTTP_STATUS = BigInt("200");



  const userData = parseJSONLikeString(data.oracleData.userData);
  const reportData = getReportData(userData);

  const signature = data.oracleData.signature;
  const signer = data.oracleData.address;
  const report = getReport(parseJSONLikeString(data.oracleData.report))

  const single_userData = parseJSONLikeString(singleData.oracleData.report);
  const single_reportData = getReportData(single_userData);
  const single_signature = singleData.oracleData.signature;
  const single_signer = singleData.oracleData.address;

  const single_report = getReport(parseJSONLikeString(singleData.oracleData.report));


describe('deploy test', () => {


    describe("Test Deployment", () => {

    describe.skip("Contract Deployment", () => {

        test('Deployment of Checksum`', async () => {
            const deployTx = await checkSum.deploy();
            await deployTx.wait();
        }, TIMEOUT);

        test('Deployment data', async () => {
            const deployTx = await oracle_data.deploy();
            await deployTx.wait();
        }, TIMEOUT);

        test('Deployment data', async () => {
            const deployTx = await oracle_interface.deploy();
            await deployTx.wait();
        }, TIMEOUT);

        test('initialized by initializer', async () => {
            oracle_data.connect(owner);
            const deployTx = await oracle_data.initialize(owner);
            await deployTx.wait();
            expect(await oracle_data.admin(OWNER_INDEX)).toBe(owner);
        }, TIMEOUT);

        test("owner can unpause", async () => {
            expect(await oracle_data.status(STATUS_INDEX)).toBe(PAUSED_VALUE);
            oracle_data.connect(owner);
            const tx = await oracle_data.unpause();
            await tx.wait();
            expect(await oracle_data.status(STATUS_INDEX)).toBe(UNPAUSED_VALUE);


                    // setting keys
        const setKeysTx = await oracle_data.set_key(signer, true);
        await setKeysTx.wait();

        // set sgx unique id
        const unique_id = {
            chunk_1: report.c0.f8,
            chunk_2: report.c0.f9
        };
        const setUniqueIdTx = await oracle_data.set_unique_id(unique_id);
        await setUniqueIdTx.wait();
        },
            TIMEOUT
        );
        

    });

    test('set data_sgx by owner: Happy Flow', async () => {
        

        oracle_data.connect(owner);

        // setting keys
        const setKeysTx = await oracle_data.set_key(signer, true);
        await setKeysTx.wait();

        // set sgx unique id
        const unique_id = {
            chunk_1: report.c0.f8,
            chunk_2: report.c0.f9
        };
        const setUniqueIdTx = await oracle_data.set_unique_id(unique_id);
        await setUniqueIdTx.wait();

        // call transition all function 
        const setTx1 = await oracle_interface.set_multiple_data_sgx(reportData, report, signature, signer);
        await setTx1.wait();
        console.log("multiple data sgx set successfully");

                // call transition all function 
        const setTx3 = await oracle_interface.set_five_data_sgx(reportData, report, signature, signer);
        await setTx3.wait();
        console.log("multiple 5 data sgx set successfully");


        // // setting keys
        const setKeysTx2 = await oracle_data.set_key(single_signer, true);
        await setKeysTx2.wait();

        // set sgx unique id
        const unique_id2 = {
            chunk_1: single_report.c0.f8,
            chunk_2: single_report.c0.f9
        };
        const setUniqueIdTx2 = await oracle_data.set_unique_id(unique_id2);
        await setUniqueIdTx2.wait();


        const setTx2 = await oracle_interface.set_single_data_sgx(single_reportData, single_report, single_signature, single_signer);
        await setTx2.wait();
        console.log("request data sgx set successfully");
    }, TIMEOUT);




    });
         });


