pragma solidity ^0.4.23;

import "./issue14bug_parent.sol";

contract ChildContract is ParentContract{

    function someFunction() public {
        emit anEvent(msg.sender);
    }

}
