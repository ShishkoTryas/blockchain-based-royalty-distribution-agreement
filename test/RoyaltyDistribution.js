const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RoyaltyDistribution", function () {
    let RoyaltyDistribution;
    let contract;
    let owner;
    let addr1;

    beforeEach(async function () {
        RoyaltyDistribution = await ethers.getContractFactory("RoyaltyDistribution");
        [owner, addr1, ...addrs] = await ethers.getSigners();

        contract = await RoyaltyDistribution.deploy();
        await contract.deployed();
    });
    it('Should set the right daily distribution', async function() {
        const distributionAmount = ethers.utils.parseEther('0.001');
        expect(await contract.dailyDistribution()).to.equal(distributionAmount);
    });

    it("Should set correct owner and balance on initialization", async function () {
        expect(await contract.owner()).to.equal(owner.address);
        console.log("Contract owner: ", await contract.owner());
        expect(await ethers.provider.getBalance(contract.address)).to.equal(ethers.utils.parseEther('0.0'));
        console.log("Init balance: ", await ethers.provider.getBalance(contract.address));
    });

    it("Should deposit successfully", async function () {
        await contract.connect(owner).deposits({value: ethers.utils.parseEther("1.0")});
        console.log("Contract balance: ", await ethers.provider.getBalance(contract.address));
        expect(await ethers.provider.getBalance(contract.address)).to.equal(ethers.utils.parseEther("1.0"));
    });

    it("Should fail if depositing is not done by owner", async function () {
        await expect(contract.connect(addr1).deposits({value: ethers.utils.parseEther("0.5")})).to.be.revertedWith("Not Owner");
        console.log("Owner address: ", owner.address, "depositer address: ", addr1.address);
    });

    it("Should distribute correctly", async function () {
        await contract.connect(owner).deposits({value: ethers.utils.parseEther("1.0")});
        await ethers.provider.send('evm_increaseTime', [24 * 3600]);
        await ethers.provider.send('evm_mine');

        const recipients = [addrs[0].address, addrs[1].address, addrs[2].address, addrs[3].address, addrs[4].address];
        let balancesBefore = [];
        for (let i = 0; i < 5; i++) {
            balancesBefore.push(await ethers.provider.getBalance(recipients[i]));
        }

        await contract.distribute(recipients);

        for (let i = 0; i < 5; i++) {
            const actualBalance = await ethers.provider.getBalance(recipients[i]);
            expect(actualBalance).to.equal(balancesBefore[i].add(ethers.utils.parseEther('0.001').div(5)));
        }
    });

    it("Should fail if not enough time has passed since last distribution", async function () {
        const recipients = [addrs[0].address, addrs[1].address, addrs[2].address, addrs[3].address, addrs[4].address];
        await expect(contract.distribute(recipients)).to.be.revertedWith("24 hours have not yet passed");
    });

    it("Should fail if not enough balance to distribute", async function () {
        await ethers.provider.send('evm_increaseTime', [24 * 3600]);
        await ethers.provider.send('evm_mine');
        await contract.deposits({ value: ethers.utils.parseEther('0.0001') });

        const recipients = [addrs[0].address, addrs[1].address, addrs[2].address, addrs[3].address, addrs[4].address, addrs[5].address];
        await expect(contract.distribute(recipients)).to.be.revertedWith("Not enough balance");
    });
});
