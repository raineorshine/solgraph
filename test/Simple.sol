contract MyContract {
  uint counter = 0;

  function Count() {
    counter++;
  }

  function CallCount() {
    Count();
  }
}
