import { ExecutionMode, parseJSONLikeString } from '@doko-js/core';
const TIMEOUT = 20000_000;
import data from './new_file.json';
import { getReport, getReportData } from '../artifacts/js/leo2js/veru_oracle_data_v3';
import { Veru_oracle_interface_v3Contract } from '../artifacts/js/veru_oracle_interface_v3';
import { Veru_oracle_data_v3Contract } from '../artifacts/js/veru_oracle_data_v3';
import { Veru_oracle_checksum_v3Contract } from '../artifacts/js/veru_oracle_checksum_v3';


// Available modes are evaluate | execute (Check README.md for further description)
const mode = ExecutionMode.SnarkExecute;
// Contract class initialization
const oracle_interface = new Veru_oracle_interface_v3Contract({ mode });
const oracle_data = new Veru_oracle_data_v3Contract({ mode });
const checkSum = new Veru_oracle_checksum_v3Contract({ mode });


const [owner, aleoUser2, aleoUser3] = oracle_interface.getAccounts();
const OWNER_INDEX = true;
  const STATUS_INDEX = 0;
  const PAUSED_VALUE = true;
  const UNPAUSED_VALUE = false;
  const VALID_HTTP_STATUS = BigInt("200");

describe('deploy test', () => {


    describe("Test Deployment", () => {

    describe("Contract Deployment", () => {

        test('Deployment of Checksum`', async () => {
            const deployTx = await checkSum.deploy();
            await deployTx.wait();
        }, TIMEOUT);

        test('Deployment data', async () => {
            const deployTx = await oracle_data.deploy();
            await deployTx.wait();
        }, TIMEOUT);

        test('Deployment interface', async () => {
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
        },
            TIMEOUT
        );

    });

        test('set data_sgx by owner: Happy Flow', async () => {
        
            const userData = parseJSONLikeString(data.oracleData.userData);
            const reportData = getReportData(userData);

            let report = getReport(parseJSONLikeString(data.oracleData.report))


            let signature = data.oracleData.signature;
            let signer = data.oracleData.address;

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


            const setTx = await oracle_interface.set_data_sgx(reportData, report, signature, signer);
            await setTx.wait();
            }, TIMEOUT);


    });

    });


