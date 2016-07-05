contract MyContract {
  function Foo() {
    msg.sender.send(1);
  }
}
