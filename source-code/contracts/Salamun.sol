// contract/Salamun.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Salamun is ERC721Enumerable, Ownable{
    uint256 public constant MAX_SUPPLY = 20;
    uint256 public constant PRICE = 0.003 ether;
    uint256 public constant MAX_PER_WALLET = 10;
    uint256 public constant MAX_TX = 5;
    string private _baseTokenURI;

    mapping(address => uint256) public addressWallet;

    constructor() ERC721("Salamun","SAL"){

    }

    function _baseURI() internal view virtual override returns(string memory){
        return _baseTokenURI;
    }

    function setBaseURI(string calldata baseURI_) external onlyOwner {
        _baseTokenURI = baseURI_;
    }

    function mint(uint256 quantity_) external payable {
        require(totalSupply() + quantity_ <= MAX_SUPPLY, 'Max supply sudah terpenuhi');
        require(quantity_ <= MAX_TX,"Max TX sudah terpenuhi");
        require(addressWallet[msg.sender] + quantity_ <= MAX_PER_WALLET,"Max per wallet sudah terpenuhi");
        require(msg.value == PRICE * quantity_,"Wrong value!");

        for(uint256 i = 1;i <= quantity_;i ++){
            _safeMint(msg.sender, totalSupply() + 1);
        }

        addressWallet[msg.sender] += quantity_;
    }
}