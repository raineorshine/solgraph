pragma solidity ^0.4.24;

contract MyContract {
  function Foo() {
    msg.sender.send(1);
  }
}
