// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Hello{
    //Cela contiendra notre mot de salutation
    string greeting;


    function getGreeting() public view returns (string memory) {
        //return the greeting
        return greeting;        
    }

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }
}