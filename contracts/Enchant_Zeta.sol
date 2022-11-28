// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Spells.sol";

contract Enchant_Zeta is ERC1155, Ownable{

    uint256 public constant ENCHANTER=0; 
    uint256 public constant TUNASS=1; 
    uint256 public Enchanters_ID_COUNT;
    mapping (address => Enchanter ) TheArcanicBook;

    constructor() ERC1155(""){
        Enchanters_ID_COUNT=0;
        _mint(owner(), TUNASS,10**18,"");
    }

    struct Enchanter{
        address enchanter_address;
        uint256 enchanter_ID;
        string  enchanter_email;
        string  enchanter_denomination;
        bool    enchanter_isOnline;
        uint256 enchanter_lvl;
        string  enchanter_chosenDeity;
    }
    
    function Ascension(string memory emailParam,string memory denominationParam,string memory chosenDeityParam)  public returns (Enchanter memory) {
        TheArcanicBook[msg.sender] = Enchanter(msg.sender, Enchanters_ID_COUNT,emailParam,denominationParam,true,1,chosenDeityParam);
        _mint(msg.sender,ENCHANTER,1,"");
        Enchanters_ID_COUNT=Enchanters_ID_COUNT+1;
        _safeTransferFrom(owner(),msg.sender,TUNASS,100,"");
        return TheArcanicBook[msg.sender];
    }
    function getEnchanter(address enchanter_address)public view returns (Enchanter memory) {
        if(isMessageSenderAnEnchanter()){
            return TheArcanicBook[enchanter_address];
        }else{
            return Enchanter(msg.sender,0,"","",false,1,"" );
        }
    }
    function isMessageSenderAnEnchanter() public view returns (bool){
        return TheArcanicBook[msg.sender].enchanter_lvl != 0;
    }
    
    function getEnchant_id() public view returns (uint256){
        return Enchanters_ID_COUNT;
    }

}