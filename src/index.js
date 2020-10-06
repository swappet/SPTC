// src/index.js 
// Copyright (C) 2020, 2021, 2022 Swap.Pet@pm.me
// SPDX-License-Identifier: MIT

const Web3 = require('web3'); 
const { setupLoader } = require('@openzeppelin/contract-loader');

// Set up web3 object, connected to the local development network
const web3 = new Web3('http://localhost:8545');
// // Set up a contract loader
const loader = setupLoader({ provider: web3 }).web3;


async function main() {
    // Our code will go here

    // Retrieve accounts from the local node
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);

    // Set up a web3 contract, representing deployed instance
    const address = '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab';
    // load contact using the contract loader
    const sptc = loader.fromArtifact('SPTC', address);

    // Send a transaction to store() a new value in the SPTC
    await sptc.methods.store(218).send({ from: accounts[0], gas: 50000, gasPrice: 1e6 });

    // Call the retrieve() function of the deployed contract
    const value = await sptc.methods.retrieve().call();
    console.log("SPTC value is", value);


}

main();