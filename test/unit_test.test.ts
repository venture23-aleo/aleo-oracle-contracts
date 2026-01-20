import { ExecutionMode, parseJSONLikeString } from '@doko-js/core';
import { getReportData, getReport } from '../artifacts/js/leo2js/veru_oracle_interface_v5';
import { Veru_oracle_data_v5Contract } from '../artifacts/js/veru_oracle_data_v5';
import { Veru_oracle_checksum_v5Contract } from '../artifacts/js/veru_oracle_checksum_v5';
import { Veru_oracle_interface_v5Contract } from '../artifacts/js/veru_oracle_interface_v5';
const TIMEOUT = 20000_000;
import data from './new_file.json';
import singleData from './aleo_request.json';

// Available modes are evaluate | execute (Check README.md for further description)
const mode = ExecutionMode.SnarkExecute;
// Contract class initialization
const oracle_data = new Veru_oracle_data_v5Contract({ mode });
const oracle_interface = new Veru_oracle_interface_v5Contract({ mode });
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




describe('deploy test', () => {

    describe.skip("Contract Deployment", () => {

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

        test.failing('cannot initialize twice', async () => {
            oracle_data.connect(owner);
            const deployTx = await oracle_data.initialize(owner);
            await deployTx.wait();
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
        test.failing('cannot set unique_id by non-owner', async () => {
            oracle_data.connect(aleoUser3);
            const setTx = await oracle_data.set_unique_id(unique_id);
            await setTx.wait();
        }, TIMEOUT);

        test('set unique_id by owner', async () => {
            oracle_data.connect(owner);
            const setTx = await oracle_data.set_unique_id(unique_id);
            await setTx.wait();
            expect(await oracle_data.sgx_unique_id(0)).toStrictEqual(unique_id);
        }, TIMEOUT);
    })

    describe("Set key", () => {
        test.failing('cannot set keys by non-owner', async () => {
            oracle_data.connect(aleoUser3);
            const setTx = await oracle_data.set_key(aleoUser3, true);
            await setTx.wait();
        }, TIMEOUT);

        test('set keys by owner', async () => {
            oracle_data.connect(owner);
            const setTx = await oracle_data.set_key(aleoUser3, true);
            await setTx.wait();
            expect(await oracle_data.allowed_keys(aleoUser3)).toBeTruthy;
        }, TIMEOUT);
    });

    describe("Set mutiple data sgx", () => {

        test.failing('enclave flags is incorrect', async () => {

            let wrong_enclave_flags_report = structuredClone(report);
            wrong_enclave_flags_report.c0.f7 = BigInt("0");
            oracle_interface.connect(owner);
            const setTx = await oracle_interface.set_multiple_data_sgx(reportData, wrong_enclave_flags_report, signature, signer);
            await expect(setTx.wait()).rejects.toThrow();
            console.log("2", report.c0.f7);
        }, TIMEOUT);

        test.failing('wrong data hash of report is generated', async () => {
        
            let wrong_hash_report = structuredClone(report);
            wrong_hash_report.c0.f24 = BigInt("0");
            oracle_interface.connect(owner);
            const setTx = await oracle_interface.set_multiple_data_sgx(reportData, wrong_hash_report, signature, signer);
            await expect(setTx.wait()).rejects.toThrow();
        }, TIMEOUT);

        test.failing('report not correct', async () => {
        let wrong_report = structuredClone(report);
        wrong_report.c0.f25 = BigInt("1");
        oracle_interface.connect(owner);
        const setTx = await oracle_interface.set_multiple_data_sgx(reportData, wrong_report, signature, signer);
        await expect(setTx.wait()).rejects.toThrow();
        }, TIMEOUT);

        test.failing('signature is not matched', async () => {
            const wrong_signature = "sign1c0ts7e6mem08l62fgxpqexfjk742kxus6ffe7d8apd7vxdeduyq828yzl43wc35g6nl4h2l58lk72pesp57msqmxwe3l3xhw2hnvwqhy7pztupfz6yycl4k9gqaf2450q2e4p2knyst63uuqagnu2w2xpcm9hkflwsrm4gq2a8eduhv8fs434lhehu7gwg80apn6l35wjkw3z8jpgcb";
            oracle_interface.connect(owner);
            const setTx = await oracle_interface.set_multiple_data_sgx(reportData, report, wrong_signature, signer);
            await expect(setTx.wait()).rejects.toThrow();
        }, TIMEOUT);

        test.failing('failed when TEE public key is not allowed', async () => {
            const unregistered_signer = data.oracleData.address; // signer not set yet
            oracle_interface.connect(owner);
            const setTx = await oracle_interface.set_multiple_data_sgx(reportData, report, signature, unregistered_signer);
            expect(await setTx.wait()).rejects.toThrow();
        }, TIMEOUT);

        test.failing('cannot set data_sgx by owner if contract is paused', async () => {
            oracle_data.connect(owner);
            // setting keys
            const setKeysTx = await oracle_data.set_key(signer, true);
            await setKeysTx.wait();

            const setTx = await oracle_interface.set_multiple_data_sgx(reportData, report, signature, signer);
            expect(await setTx.wait()).rejects.toThrow();
        }, TIMEOUT);

        test("unpause for testing", async () => {
            oracle_data.connect(owner);
            const tx = await oracle_data.unpause();
            await tx.wait();
        },
            TIMEOUT
        );

        test.failing('failed when unique id from the TEE report is not set', async () => {
            oracle_interface.connect(owner);
            const setTx = await oracle_interface.set_multiple_data_sgx(reportData, report, signature, signer);
            expect(await setTx.wait()).rejects.toThrow();
        }, TIMEOUT);

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

            const setTx = await oracle_interface.set_multiple_data_sgx(reportData, report, signature, signer);
            await setTx.wait();
        }, TIMEOUT);

    });

    // describe("Update Historic data", () => {

    //     const request_hash = BigInt("295112419408573232705047733941974061637");
    //     const AttestedData: AttestedData = {
    //             data: request_hash,
    //             attestation_timestamp: reportData.c0.f3
    //     };

    //     const hashStruct = (struct: any): bigint => {
    //         const structString = js2leo.json(struct)
    //         console.log(structString);
    //         const structHash = hash("bhp256", structString, "field");
    //         const hashBigInt = leo2js.field(structHash);
    //         return hashBigInt
    //     }
        
    //     const timestamped_hash = hashStruct(AttestedData);

    //     test.failing("should not update Historic data", async () => {
    //         oracle_data.connect(aleoUser3);
    //         const tx = await oracle_data.update_historic_data(timestamp, AttestedData);
    //         await tx.wait();
    //         },
    //         TIMEOUT
    //     );

    //     test("should update Historic data by admin", async () => {
    //         oracle_data.connect(owner);
    //         const tx = await oracle_data.update_historic_data(timestamp, AttestedData);
    //         await tx.wait();
    //         expect(await oracle_data.sgx_attested_data(timestamp)).toEqual(AttestedData);
    //         },
    //         TIMEOUT
    //     );

    // });

    describe("Set single data sgx", () => {

        test('set data_sgx by owner: Happy Flow', async () => {
        
            const userData = parseJSONLikeString(singleData.oracleData.userData);
            const reportData = getReportData(userData);

            let report = getReport(parseJSONLikeString(singleData.oracleData.report))


            let signature = singleData.oracleData.signature;
            let signer = singleData.oracleData.address;

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


            const setTx = await oracle_interface.set_single_data_sgx(reportData, report, signature, signer);
            await setTx.wait();
        }, TIMEOUT);

    });

    describe("Transfer Ownership", () => {
        test.failing("should not transfer ownership by non-admin", async () => {
            const prevOwner = await oracle_data.admin(OWNER_INDEX);
            oracle_data.connect(aleoUser3);
            const tx = await oracle_data.transfer_ownership(aleoUser3);
            const newOwner = await oracle_data.admin(OWNER_INDEX);
            expect(prevOwner).toBe(newOwner)
            await tx.wait();
            },
            TIMEOUT
        );

        test("Current owner can transfer ownership", async () => {
            oracle_data.connect(owner);
            const transferOwnershipTx = await oracle_data.transfer_ownership(aleoUser3);
            await transferOwnershipTx.wait();

            const newOwner = await oracle_data.admin(OWNER_INDEX);
            expect(newOwner).toBe(aleoUser3);
            },
            TIMEOUT
        );
    });

});
