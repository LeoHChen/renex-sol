const BN = require("bn.js");

// Dependencies
const DarknodeRegistryStore = artifacts.require("DarknodeRegistryStore");
const DarknodeRegistry = artifacts.require("DarknodeRegistry");
const DarknodeRewardVault = artifacts.require("DarknodeRewardVault");
const Orderbook = artifacts.require("Orderbook");
const DarknodeSlasher = artifacts.require("DarknodeSlasher");

// Contracts
const RenExBalances = artifacts.require("RenExBalances");
const RenExTokens = artifacts.require("RenExTokens");
const RenExSettlement = artifacts.require("RenExSettlement");
const RenExBrokerVerifier = artifacts.require("RenExBrokerVerifier");
const SettlementRegistry = artifacts.require("SettlementRegistry");

// Tokens
const RepublicToken = artifacts.require("RepublicToken");

const RenExAtomicSwapper = artifacts.require("RenExAtomicSwapper");

const config = require("./config.js");

const assertAddress = (left, right) => {
    console.assert(left.toLowerCase() === right.toLowerCase());
}

module.exports = async function (deployer, network, accounts) {
    // Network is "development", "nightly", "falcon" or "f0"

    await deployer.then(async () => {

        const darknodeRegistryStore = await DarknodeRegistryStore.at(DarknodeRegistryStore.address);
        const darknodeRegistry = await DarknodeRegistry.at(DarknodeRegistry.address);
        const settlementRegistry = await SettlementRegistry.at(SettlementRegistry.address);
        const orderbook = await Orderbook.at(Orderbook.address);
        const darknodeRewardVault = await DarknodeRewardVault.at(DarknodeRewardVault.address);
        const darknodeSlasher = await DarknodeSlasher.at(DarknodeSlasher.address);
        const renExTokens = await RenExTokens.at(RenExTokens.address);
        const renExBrokerVerifier = await RenExBrokerVerifier.at(RenExBrokerVerifier.address);
        const renExBalances = await RenExBalances.at(RenExBalances.address);
        const renExSettlement = await RenExSettlement.at(RenExSettlement.address);
        const renExAtomicSwapper = await RenExAtomicSwapper.at(RenExAtomicSwapper.address);

        let contracOwnerAddress = accounts[0];
        if (network === "mainnet") {
            contracOwnerAddress = config.OWNER_ADDRESS;
        }

        // DarknodeRegistryStore
        console.log(`Verifying DarknodeRegistryStore...`);
        console.assert((await darknodeRegistryStore.VERSION()).match(network));
        assertAddress(await darknodeRegistryStore.owner(), DarknodeRegistry.address);
        assertAddress(await darknodeRegistryStore.ren(), RepublicToken.address);

        // DarknodeRegistry
        console.log(`Verifying DarknodeRegistry...`);
        console.assert((await darknodeRegistry.VERSION()).match(network));
        assertAddress(await darknodeRegistry.ren(), RepublicToken.address);
        assertAddress(await darknodeRegistry.store(), DarknodeRegistryStore.address);
        assertAddress(await darknodeRegistry.owner(), contracOwnerAddress);

        // SettlementRegistry
        console.log(`Verifying SettlementRegistry...`);
        console.assert((await settlementRegistry.VERSION()).match(network));
        assertAddress(await settlementRegistry.owner(), contracOwnerAddress);

        // Orderbook
        console.log(`Verifying Orderbook...`);
        console.assert((await orderbook.VERSION()).match(network));
        assertAddress(await orderbook.owner(), contracOwnerAddress);
        assertAddress(await orderbook.darknodeRegistry(), DarknodeRegistry.address);
        assertAddress(await orderbook.settlementRegistry(), SettlementRegistry.address);

        // DarknodeRewardVault
        console.log(`Verifying DarknodeRewardVault...`);
        console.assert((await darknodeRewardVault.VERSION()).match(network));
        assertAddress(await darknodeRewardVault.owner(), contracOwnerAddress);
        assertAddress(await darknodeRewardVault.darknodeRegistry(), DarknodeRegistry.address);

        // DarknodeSlasher
        console.log(`Verifying DarknodeSlasher...`);
        console.assert((await darknodeSlasher.VERSION()).match(network));
        assertAddress(await darknodeSlasher.owner(), contracOwnerAddress);
        assertAddress(await darknodeSlasher.trustedDarknodeRegistry(), DarknodeRegistry.address);
        assertAddress(await darknodeSlasher.trustedOrderbook(), Orderbook.address);

        // RenExTokens
        console.log(`Verifying RenExTokens...`);
        console.assert((await renExTokens.VERSION()).match(network));
        assertAddress(await renExTokens.owner(), contracOwnerAddress);

        // RenExBrokerVerifier
        console.log(`Verifying RenExBrokerVerifier...`);
        console.assert((await renExBrokerVerifier.VERSION()).match(network));
        assertAddress(await renExBrokerVerifier.owner(), contracOwnerAddress);
        assertAddress(await renExBrokerVerifier.balancesContract(), RenExBalances.address);

        // RenExBalances
        console.log(`Verifying RenExBalances...`);
        console.assert((await renExBalances.VERSION()).match(network));
        assertAddress(await renExBalances.owner(), contracOwnerAddress);
        assertAddress(await renExBalances.settlementContract(), RenExSettlement.address);
        assertAddress(await renExBalances.brokerVerifierContract(), RenExBrokerVerifier.address);
        assertAddress(await renExBalances.rewardVaultContract(), DarknodeRewardVault.address);

        // RenExSettlement
        console.log(`Verifying RenExSettlement...`);
        console.assert((await renExSettlement.VERSION()).match(network));
        assertAddress(await renExSettlement.owner(), contracOwnerAddress);
        assertAddress(await renExSettlement.orderbookContract(), Orderbook.address);
        assertAddress(await renExSettlement.renExTokensContract(), RenExTokens.address);
        assertAddress(await renExSettlement.renExBalancesContract(), RenExBalances.address);
        console.assert(((await renExSettlement.slasherAddress()).toLowerCase()) === config.SLASHER_ADDRESS.toLowerCase());
        console.assert(new BN(await renExSettlement.submissionGasPriceLimit()).eq(new BN(config.SUBMIT_ORDER_GAS_LIMIT)), `Expected submission gas price limit to be ${config.SUBMIT_ORDER_GAS_LIMIT}`);

        // RenExAtomicSwapper
        console.log(`Verifying RenExAtomicSwapper...`);
        console.assert((await renExAtomicSwapper.VERSION()).match(network));
    });
};