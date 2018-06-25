pragma solidity ^0.4.23;

contract MyContract {
  uint balance;

  constructor () public {
    Mint(1000000);
  }

  function Mint(uint amount) internal {
    balance = amount;
  }

  function Withdraw() public {
    msg.sender.transfer(balance);
  }

  function GetBalance() public constant returns(uint) {
    return balance;
  }
}
