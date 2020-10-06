// contracts/SPTC.sol
// Copyright (C) 2020, 2021, 2022 Swap.Pet@pm.me
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

// Import Ownable from the OpenZeppelin Contracts library
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Make SPTC inherit from the Ownable contract 
contract SPTC is Ownable,ERC20 {

    constructor(
        string memory name, //代币名称
        string memory symbol, //代币缩写
        uint256 totalSupply //发行总量
    ) public ERC20(name, symbol) {
        _mint(msg.sender, totalSupply * (10**uint256(18)));
    }

    uint256 private value;

    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);

    // Stores a new value in the contract
    // The onlyOwner modifier restricts who can call the store function
    function store(uint256 newValue) public onlyOwner {
        value = newValue;
        emit ValueChanged(newValue);
    }

    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }
}