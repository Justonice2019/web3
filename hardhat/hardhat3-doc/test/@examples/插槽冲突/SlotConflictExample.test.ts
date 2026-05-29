import {expect} from 'chai'
import {network  } from 'hardhat'
import * as utils from '../../utils/index.ts'

const {ethers, networkHelpers } = await network.connect({
    chainType: 'l1',
    network: 'localhost',
})
const {provider} = ethers
describe("SlotConflictExample.test", () => {
    it("插槽冲突", async () => {
        const [admin, user] = await ethers.getSigners();

        const Impl = await ethers.getContractFactory("SlotConflictExampleImpl");
        const impl = await Impl.deploy();
        const implAddr = await impl.getAddress()

        const Proxy = await ethers.getContractFactory("SlotConflictExampleProxy");
        const proxy = await Proxy.deploy(implAddr, admin.address);


        const implProxy = await ethers.getContractAt("SlotConflictExampleImpl", await proxy.getAddress());
        console.log("owner impl:", await impl.owner()); // owner impl: 0x0000000000000000000000000000000000000000
        const ownerProxy = await implProxy.owner();
        console.log("owner implProxy:", ownerProxy);  // owner implProxy: 0xcbEAF3BDe82155F56486Fb5a1072cb8baAf547cc
        console.log('implAddr', implAddr) // implAddr 0xcbEAF3BDe82155F56486Fb5a1072cb8baAf547cc


        console.log()

        console.log("count impl:", await impl.count()); // owner impl: 0n
        const proxyCount = await implProxy.count();
        console.log("count implProxy:", proxyCount); // owner proxyImpl: 1390849295786071768276380950238675083608645509734n
        console.log('admin.address', BigInt(admin.address)) // admin.address 1390849295786071768276380950238675083608645509734n
        expect(BigInt(admin.address) === proxyCount).is.true

        console.log('会发现 implProxy读取的实际是代理本身的implementation和admin, 并不是impl的owner, count')


    });
    it("修复插槽冲突", async () => {
        const [admin, user] = await ethers.getSigners();

        const Impl = await ethers.getContractFactory("SlotConflictExampleImpl");
        const impl = await Impl.deploy();
        const implAddr = await impl.getAddress()

        const Proxy = await ethers.getContractFactory("SlotConflictExampleFixedProxy");
        const proxy = await Proxy.deploy(implAddr, admin.address);


        const implProxy = await ethers.getContractAt("SlotConflictExampleImpl", await proxy.getAddress());
        console.log("owner impl:", await impl.owner()); // owner impl: 0x0000000000000000000000000000000000000000
        const ownerProxy = await implProxy.owner();
        console.log("owner implProxy:", ownerProxy);  // owner implProxy: 0xcbEAF3BDe82155F56486Fb5a1072cb8baAf547cc
        console.log('implAddr', implAddr) // implAddr 0xcbEAF3BDe82155F56486Fb5a1072cb8baAf547cc


        console.log()

        console.log("count impl:", await impl.count()); // owner impl: 0n
        const proxyCount = await implProxy.count();
        console.log("count implProxy:", proxyCount); // owner proxyImpl: 1390849295786071768276380950238675083608645509734n
        console.log('admin.address', BigInt(admin.address)) // admin.address 1390849295786071768276380950238675083608645509734n
        expect(BigInt(admin.address) === proxyCount).is.false
    });

    it("升级合约", async () => {
        const [admin, user] = await ethers.getSigners();

        const Impl = await ethers.getContractFactory("SlotConflictExampleImpl");
        const impl = await Impl.deploy();
        const implAddr = await impl.getAddress()

        const Proxy = await ethers.getContractFactory("SlotConflictExampleFixedProxy");
        const proxy = await Proxy.deploy(implAddr, admin.address);
        const addrProxy = await proxy.getAddress()

        const implProxy = await ethers.getContractAt("SlotConflictExampleImpl", addrProxy);
        console.log("owner impl:", await impl.owner()); // owner impl: 0x0000000000000000000000000000000000000000
        const ownerProxy = await implProxy.owner();
        console.log("owner implProxy:", ownerProxy);  // owner implProxy: 0xcbEAF3BDe82155F56486Fb5a1072cb8baAf547cc
        console.log('implAddr', implAddr) // implAddr 0xcbEAF3BDe82155F56486Fb5a1072cb8baAf547cc


        console.log()

        console.log("count impl:", await impl.count()); // owner impl: 0n
        const proxyCount = await implProxy.count();
        console.log("count implProxy:", proxyCount); // owner proxyImpl: 1390849295786071768276380950238675083608645509734n
        console.log('admin.address', BigInt(admin.address)) // admin.address 1390849295786071768276380950238675083608645509734n
        // expect(BigInt(admin.address) === proxyCount).is.false

        console.log()

        await implProxy.init(admin.address)
        await implProxy.add()
        await implProxy.add()
        console.log('count implProxy:', await implProxy.count())

        // 升级合约
        const ImplV2 = await ethers.getContractFactory("SlotConflictExampleImplV2");
        const implV2 = await ImplV2.deploy();
        const addrImplV2 = await implV2.getAddress();

        await proxy.upgradeTo(addrImplV2)

        const implV2Proxy = await ethers.getContractAt("SlotConflictExampleImplV2", addrProxy);
        await implV2Proxy.add()
        await implV2Proxy.add()
        console.log('count implV2Proxy:', await implV2Proxy.count())
    });
});