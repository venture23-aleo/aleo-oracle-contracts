import { InterfaceContract } from "../artifacts/js/interface";
import {
    Call1Contract
} from "../artifacts/js/call1";
import { Call2Contract } from "../artifacts/js/call2";
import { ExecutionMode } from "@doko-js/core";


const call1 = new Call1Contract({ mode: ExecutionMode.SnarkExecute })
const call2 = new Call2Contract({ mode: ExecutionMode.SnarkExecute })
const interfaceContract = new InterfaceContract({ mode: ExecutionMode.SnarkExecute })
const TIMEOUT = 1000000
const [aleou1] = interfaceContract.getAccounts();
describe("Interface Contract", () => {
    test("Deploy", async () => {
        const deploy_call1 = await call1.deploy()
        const deploy_call2 = await call2.deploy()
        const deploy_interface = await interfaceContract.deploy()
        await deploy_call1.wait()
        await deploy_call2.wait()
        await deploy_interface.wait()
    }, TIMEOUT)

    test("Initialize call1", async () => {
        const tx = await call1.initialize(aleou1)
        const receipt = await tx.wait()
    }, TIMEOUT)

    test("Initialize call2", async () => {
        const tx = await call2.initialize(aleou1)
        const receipt = await tx.wait()
    }, TIMEOUT)

    test("Interface initialize", async () => {
        const tx = await interfaceContract.initialize(aleou1)
        const receipt = await tx.wait()
    }, TIMEOUT)

}
)