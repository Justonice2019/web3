const { ethers } = require('hardhat')

async function main() {
    const [signer] = await ethers.getSigners();
    const bankContract = await ethers.getContractAt("Bank", '0x01fC441BeFb115906e3D27d39C2155fF106e80B2', signer);

    const data = await bankContract.getBalance()
    console.log(data)
}
main().then(() => process.exit(0)).catch(error => {
    console.error(error.message);
    process.exit(1);
});
