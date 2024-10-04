// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LudoGame {
    address[4] public players; 
    uint256 public firstPlayer; 
    uint8 public lastRoll; 
    bool public start;

    mapping(address => bool) public isPlayer; 
    mapping(address => uint256) public playerPosition; 

    modifier onlyPlayers() {
        require(isPlayer[msg.sender], "You are not a player in this game.");
        _;
    }

    modifier turn() {
        require(players[firstPlayer] == msg.sender, "It's not your turn.");
        _;
    }

    modifier gameInPlay() {
        require(start, "The game has not started yet.");
        _;
    }

    constructor(address[4] memory _players) {
        players = _players;
        for (uint256 i = 0; i < 4; i++) {
            isPlayer[players[i]] = true;
        }
        firstPlayer = 0; 
        start = true;
    }

    function rollDice() public onlyPlayers turn gameInPlay returns (uint256) {
        lastRoll = uint8(uint256(keccak256(abi.encodePacked(block.timestamp, block.number, msg.sender))) % 6) + 1;
        playerPosition[msg.sender] += lastRoll; 
        
        firstPlayer = (firstPlayer + 1) % 4;

        return lastRoll;
    }

    function getCurrentPlayer() public view returns (address) {
        return players[firstPlayer];
    }

    function getPlayerPosition(address player) public view returns (uint256) {
        return playerPosition[player];
    }
}
