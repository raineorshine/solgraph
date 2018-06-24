pragma solidity ^0.4.24;

contract MyContract {
  uint counter = 0;

  function Count() {
    counter++;
  }

  function CallCount() {
    Count();
  }
}
