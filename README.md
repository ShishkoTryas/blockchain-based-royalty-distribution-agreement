# Royalty Distribution Contract - Test Task

This project includes a Solidity smart contract called "RoyaltyDistribution" that implements a simple royalty distribution system among multiple addresses. The contract allows for deposits and distributions, with certain restrictions. The contract ensures that only the contract owner can deposit funds and perform the royalty distribution. Additionally, the distribution can occur only once every 24 hours.

## Installation

1. Clone the repository to your local machine:
   ```
   git clone https://github.com/ShishkoTryas/blockchain-based-royalty-distribution-agreement
   cd blockchain-based-royalty-distribution-agreement
   ```

2. Install the necessary dependencies:
   ```
   npm install --save-dev hardhat@2.14.0
   npm install --save-dev @nomicfoundation/hardhat-toolbox@2.0.2
   ```

3. Compile the contract:
   ```
   npx hardhat compile
   ```

## Testing

After the contract is deployed, you can run tests to validate the functionality of the contract:

```
npx hardhat test
```

## Test Coverage

To check the test coverage, make sure you have installed the `solidity-coverage` plugin:

```
npm install --save-dev solidity-coverage
```

You can then run the coverage analysis using the following command:

```
npx hardhat coverage
```

## Project Details

- `RoyaltyDistribution.sol` contains the Solidity code for the smart contract.
- The `test/` directory contains test scripts written using the Mocha test framework and Chai assertions.
