import {expect} from 'chai'
import {network  } from 'hardhat'
import * as utils from '../../utils/index.ts'

const {ethers, networkHelpers } = await network.connect({
    chainType: 'l1',
    network: 'localhost',
})
const {provider} = ethers

describe("MultiSigWallet 升级测试", () => {
    it("部署V1并升级到V2", async () => {

        const [admin, a2, a3, a4, a5] = await ethers.getSigners()
        const adminAddr = admin.address
        const owners = [adminAddr, a2.address, a3.address]

        // 1. 部署实现合约 MultiSigWalletUpgradeable
        const MultiSigWalletUpgradeable = await ethers.getContractFactory('MultiSigWalletUpgradeable')
        const impl = await MultiSigWalletUpgradeable.deploy()
        await impl.waitForDeployment()
        const implAddr = await impl.getAddress()

        // 2. 准备初始化数据
        const initializeInterface = new ethers.Interface([
            'function initialize( address[] memory _owners, uint256 _numConfirmationsRequired)'
        ])
        const initData = initializeInterface.encodeFunctionData('initialize', [
            owners,
            2n
        ])
        // const initData = impl.interface.encodeFunctionData("initialize", [owners, 2n])
        console.log(initData)

        // 3. 部署 TransparentUpgradeableProxy
        const TransparentUpgradeableProxy = await ethers.getContractFactory(
            "TransparentUpgradeableProxy"
        );
        const proxy = await TransparentUpgradeableProxy.deploy(
            implAddr,
            adminAddr,
            initData
        );
        await proxy.waitForDeployment();
        const proxyAddress = await proxy.getAddress();

        // 从存储槽读取 ProxyAdmin 地址并验证
        const ERC1967_ADMIN_STORAGE_SLOT = "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103";
        const adminStorage = await ethers.provider.getStorage(
            proxyAddress,
            ERC1967_ADMIN_STORAGE_SLOT
        );
        const adminStorageHex = adminStorage.startsWith("0x") ? adminStorage.slice(2) : adminStorage;
        const actualProxyAdminAddress = ethers.getAddress("0x" + adminStorageHex.slice(-40).padStart(40, '0'));

        const ProxyAdmin = await ethers.getContractFactory("ProxyAdmin");
        const proxyAdmin = ProxyAdmin.attach(actualProxyAdminAddress);
        // const proxyAdmin = ethers.getContractAt('ProxyAdmin', actualProxyAdminAddress);
        const actualProxyAdminOwner = await proxyAdmin.owner();
        console.log(actualProxyAdminOwner === adminAddr)

        const wallet = await ethers.getContractAt("MultiSigWalletUpgradeable", proxyAddress);
        const walletOwners = await wallet.getOwners()
        const threshold = await wallet.getThreshold()

        console.log("Proxy Address:", proxyAddress);
        console.log("Implementation Address:", implAddr);
        console.log("ProxyAdmin Address:", actualProxyAdminAddress);
        console.log("ProxyAdmin Owner:", admin);
        console.log("Owners:", walletOwners.length);
        console.log("Threshold:", threshold.toString());
    });
});