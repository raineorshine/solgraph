contract Multiple0 {
  uint counter = 0;

  function Count() {
    counter++;
  }

  function CallCount() {
    Count();
  }
}

contract Multiple1 {
  uint counter = 0;

  function Count() {
    counter++;
  }

  function CallCount() {
    Count();
  }
}
