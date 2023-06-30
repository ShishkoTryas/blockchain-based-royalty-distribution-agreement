// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;


contract RoyaltyDistribution {
    address public owner;
    uint96 public dailyDistribution;
    uint256 private lastDistributionTime;

    uint public totalDeposits;

    event Deposits(uint indexed value);
    event Distribute(address indexed to, uint indexed value);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not Owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        dailyDistribution = 0.001 ether;
        lastDistributionTime = block.timestamp;
    }

    function deposits() external payable onlyOwner {
        totalDeposits += msg.value;
        emit Deposits(msg.value);
    }

    function distribute(address[] memory adresses) external onlyOwner {
        require(block.timestamp >= (lastDistributionTime + 24 hours), "24 hours have not yet passed");
        uint256 amountPerRecipient = dailyDistribution / adresses.length;
        require(totalDeposits >= amountPerRecipient * adresses.length, "Not enough balance");
        for(uint i = 0; i < adresses.length; i++) {
            require(adresses[i] != address(0));
            payable(adresses[i]).transfer(amountPerRecipient);
            emit Distribute(adresses[i], amountPerRecipient);
        }

        totalDeposits -= dailyDistribution;

        lastDistributionTime = block.timestamp;
    }
}