// contracts/SPTC.sol
// Copyright (C) 2020, 2021, 2022 Swap.Pet@pm.me
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
// import "@openzeppelin/contracts-ethereum-package/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/presets/ERC721PresetMinterPauserAutoId.sol";


// Make SPTC inherit from the Ownable contract 
contract SPTCv2 is Initializable, ERC721PresetMinterPauserAutoIdUpgradeSafe { 
    uint256 private value;

    function initialize() public initializer {
        ERC721PresetMinterPauserAutoIdUpgradeSafe.initialize(
            "SwapPet Token of Coop", // name
            "SPTC", // symbol
            "https://sptc.swap.pet/" // baseURI
        );
    }

    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);

    // Stores a new value in the contract
    // The onlyOwner modifier restricts who can call the store function
    function store(uint256 newValue) public {
        value += newValue;
        emit ValueChanged(newValue);
    }

    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }
}