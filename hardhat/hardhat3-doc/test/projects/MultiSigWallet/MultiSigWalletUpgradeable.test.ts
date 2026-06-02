import {expect} from 'chai'
import {network  } from 'hardhat'

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

        // 4. 从存储槽读取 ProxyAdmin 地址并验证
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
        console.log("ProxyAdmin Owner:", adminAddr);
        console.log("Owners:", walletOwners.length);
        console.log("Threshold:", threshold.toString());

        console.log()

        /////////////////////// 合约升级 ///////////////////////
        // 1. 根据代理合约的地址 获取当前实现合约地址
        const ERC1967_PROXY_STORAGE_SLOT = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
        const currentImplementationStorage = await ethers.provider.getStorage(
            proxyAddress,
            ERC1967_PROXY_STORAGE_SLOT
        );
        const implStorageHex = currentImplementationStorage.startsWith("0x")
            ? currentImplementationStorage.slice(2)
            : currentImplementationStorage;
        const currentImpl = ethers.getAddress("0x" + implStorageHex.slice(-40).padStart(40, '0'));
        console.log("Current Implementation:", currentImpl);

        // 2. 根据代理合约的地址 获取 ProxyAdmin 地址
        const adminStorage2 = await ethers.provider.getStorage(
            proxyAddress,
            ERC1967_ADMIN_STORAGE_SLOT
        );
        const adminStorageHex2 = adminStorage2.startsWith("0x") ? adminStorage2.slice(2) : adminStorage2;
        const proxyAdminAddress2 = ethers.getAddress("0x" + adminStorageHex2.slice(-40).padStart(40, '0'));
        console.log("ProxyAdmin Address:", proxyAdminAddress2);

        const MultiSigWalletV2 = await ethers.getContractFactory("MultiSigWalletV2");
        const newImplementation = await MultiSigWalletV2.deploy();
        await newImplementation.waitForDeployment();
        const newImplementationAddress = await newImplementation.getAddress();
        console.log("New Implementation:", newImplementationAddress);

        const ProxyAdmin2 = await ethers.getContractFactory("ProxyAdmin");
        const proxyAdmin2 = ProxyAdmin2.attach(proxyAdminAddress2);
        const adminOwner2 = await proxyAdmin2.owner();
        console.log("ProxyAdmin Owner:", adminOwner2);

        const upgradeTx = await proxyAdmin2.upgradeAndCall(
            proxyAddress,
            newImplementationAddress,
            "0x"
        );
        await upgradeTx.wait()

        // 验证新实现地址
        const newImplStorage = await ethers.provider.getStorage(
            proxyAddress,
            ERC1967_PROXY_STORAGE_SLOT
        );
        const newImplStorageHex = newImplStorage.startsWith("0x")
            ? newImplStorage.slice(2)
            : newImplStorage;
        const verifiedNewImpl = ethers.getAddress("0x" + newImplStorageHex.slice(-40).padStart(40, '0'));
        console.log('verifiedNewImpl', verifiedNewImpl)

        const wallet2 = await ethers.getContractAt("MultiSigWalletV2", proxyAddress);
        console.log("Initializing V2...");
        const initTx = await wallet2.initializeV2(2);
        await initTx.wait();
        console.log('version:', await wallet2.version())

    });
});