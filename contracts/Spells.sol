// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Spells is ERC721 , Ownable {


    uint256 public Spell_ID;
    
    // Optional mapping for token URIs
    mapping (uint256 => string) public Grimoire;

    constructor () ERC721("SPELLS","SPL"){
        Spell_ID = 0;
    }
    //OUR MINT Deal
    function _setTokenURI(uint256 SpellID, string memory SpellURI) internal virtual {
        require(_exists(SpellID), "ERC721Metadata: URI set of nonexistent token");
        Grimoire[SpellID] = SpellURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return Grimoire[tokenId];
    }
    function Spellcraft(string memory SpellURI) public returns (uint256) {
        uint256 newSpellID = Spell_ID;
        _safeMint(msg.sender, newSpellID);
        _setTokenURI(Spell_ID, SpellURI);
        Spell_ID = Spell_ID +1;

        return Spell_ID-1;
    }

    function getSpell_ID() public view returns (uint256){
        return Spell_ID;
    }
}
