import { ExecutionMode, parseJSONLikeString } from '@doko-js/core';
import { getDataChunk, getReportData, getReport, getUniqueID } from '../artifacts/js/leo2js/veru_oracle_data_v3';
import { Veru_oracle_data_v3Contract } from '../artifacts/js/veru_oracle_data_v3';
import { AttestedData } from '../artifacts/js/types/veru_oracle_data_v3';
import { Veru_oracle_checksum_v3Contract } from '../artifacts/js/veru_oracle_checksum_v3';
import { Veru_oracle_interface_v3Contract } from '../artifacts/js/veru_oracle_interface_v3';
const TIMEOUT = 20000_000;
import data from './new_file.json';
import singleData from './aleo_request.json';

// Available modes are evaluate | execute (Check README.md for further description)
const mode = ExecutionMode.SnarkExecute;
// Contract class initialization
const oracle_data = new Veru_oracle_data_v3Contract({ mode });
const oracle_interface = new Veru_oracle_interface_v3Contract({ mode });
const checkSum = new Veru_oracle_checksum_v3Contract({ mode });

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




describe('deploy test', () => {

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

        test.failing('cannot initialized by non-initializer', async () => {
            oracle_data.connect(aleoUser3);
            const deployTx = await oracle_data.initialize(owner);
            await deployTx.wait();
        }, TIMEOUT);

        test('initialized by initializer', async () => {
            oracle_data.connect(owner);
            const deployTx = await oracle_data.initialize(owner);
            await deployTx.wait();
            expect(await oracle_data.admin(OWNER_INDEX)).toBe(owner);
        }, TIMEOUT);

        test('cannot initialize twice', async () => {
            oracle_data.connect(owner);
            const deployTx = await oracle_data.initialize(owner);
            expect(await deployTx.wait()).rejects.toThrow();
        }, TIMEOUT);
    });

    describe("Pausability", () => {
        test.failing("should not unpause by non-owner", async () => {
            oracle_data.connect(aleoUser3);
            const tx = await oracle_data.unpause();
            expect(await oracle_data.status(STATUS_INDEX)).toBe(PAUSED_VALUE);
            await tx.wait();
        }, TIMEOUT);

        test("owner can unpause", async () => {
            oracle_data.connect(owner);
            const tx = await oracle_data.unpause();
            await tx.wait();
            expect(await oracle_data.status(STATUS_INDEX)).toBe(UNPAUSED_VALUE);
        },
            TIMEOUT
        );

        test.failing("should not pause by non-owner", async () => {
            oracle_data.connect(aleoUser3);
            const tx = await oracle_data.pause();
            expect(await oracle_data.status(STATUS_INDEX)).toBe(UNPAUSED_VALUE);
            await tx.wait();
        }, TIMEOUT);

        test("owner can pause", async () => {
            oracle_data.connect(owner);
            const tx = await oracle_data.pause();
            await tx.wait();
            expect(await oracle_data.status(STATUS_INDEX)).toBe(PAUSED_VALUE);
        }, TIMEOUT);
    });

    describe("Set unique id", () => {
        const unique_id = {
            chunk_1: BigInt(123),
            chunk_2: BigInt(456)
        };
        test('cannot set unique_id by non-owner', async () => {
            oracle_data.connect(aleoUser3);
            const setTx = await oracle_data.set_unique_id(unique_id);
            expect(await setTx.wait()).rejects.toThrow();
        }, TIMEOUT);

        test('set unique_id by owner', async () => {
            oracle_data.connect(owner);
            const setTx = await oracle_data.set_unique_id(unique_id);
            await setTx.wait();
            expect(await oracle_data.sgx_unique_id(0)).toStrictEqual(unique_id);
        }, TIMEOUT);
    })

    describe("Set key", () => {
        test('cannot set keys by non-owner', async () => {
            oracle_data.connect(aleoUser3);
            const setTx = await oracle_data.set_key(aleoUser3, true);
            expect(await setTx.wait()).rejects.toThrow();
        }, TIMEOUT);

        test('set keys by owner', async () => {
            oracle_data.connect(owner);
            const setTx = await oracle_data.set_key(aleoUser3, true);
            await setTx.wait();
            expect(await oracle_data.allowed_keys(aleoUser3)).toBeTruthy;
        }, TIMEOUT);
    });



});