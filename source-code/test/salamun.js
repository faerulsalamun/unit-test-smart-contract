const { expect } = require('chai');
const { ethers } = require('hardhat');
const { utils } = require('ethers');

describe('Salamun Contract', () =>{
    const PRICE = 0.003;

    beforeEach(async() => {
        const Salamun = await ethers.getContractFactory('Salamun');
        [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

        const users = [
            {address: owner.address},
            {address: addr1.address},
            {address: addr2.address},
            {address: addr3.address},
        ];

        salamun = await Salamun.deploy();
    });

    describe('Mint', () => {
        it('should call a function mint correctly with 5 token', async() =>{
            await salamun.mint(5,{value:ethers.utils.parseEther(`${5 * PRICE}`)});
        });

        it('should call a function mint with 5+5+5+6 token and return error Max supply sudah terpenuhi', async() =>{
            await salamun.connect(addr1).mint(5,{value:ethers.utils.parseEther(`${5 * PRICE}`)});
            await salamun.connect(addr2).mint(5,{value:ethers.utils.parseEther(`${5 * PRICE}`)});
            await salamun.connect(addr3).mint(5,{value:ethers.utils.parseEther(`${5 * PRICE}`)});

            await expect(salamun.mint(6,{value:ethers.utils.parseEther(`${6 * PRICE}`)})).to.be.revertedWith('Max supply sudah terpenuhi');
        });

        it('should call a function mint with 6 token and return error Max TX sudah terpenuhi', async() =>{
            await expect(salamun.mint(6,{value:ethers.utils.parseEther(`${6 * PRICE}`)})).to.be.revertedWith('Max TX sudah terpenuhi');
        });

        it('should call a function mint with 5+5+1 token and return error Max per wallet sudah terpenuhi', async() =>{
            await salamun.mint(5,{value:ethers.utils.parseEther(`${5 * PRICE}`)});
            await salamun.mint(5,{value:ethers.utils.parseEther(`${5 * PRICE}`)});

            await expect(salamun.mint(1,{value:ethers.utils.parseEther(`${1 * PRICE}`)})).to.be.revertedWith('Max per wallet sudah terpenuhi');
        });

        it('should call a function mint with 1 token and return error Wrong value!', async() =>{
            await expect(salamun.mint(1,{value:ethers.utils.parseEther(`${6 * PRICE}`)})).to.be.revertedWith('Wrong value!');
        });
    });
});