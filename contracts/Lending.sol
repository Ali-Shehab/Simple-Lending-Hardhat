

pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Lending {

    mapping(address => uint256) public borrowedAmount;
    mapping(address => uint256) public balanceOfTokens;

    ERC20 private tokenA;
    ERC20 private tokenB;
    constructor(address _tokenA,address _tokenB)
    {
        tokenA = ERC20(_tokenA);
        tokenB = ERC20(_tokenB);
    }

    function deposit() public payable {
        require(msg.value > 0,"Amount deposited must be greater than 0");
        // for every 1 ether transfer 100 token
        uint256 amountToken = ((100*10**18) * (1*10**18))/(msg.value);
        balanceOfTokens[msg.sender] += amountToken;
        tokenA.approve(msg.sender, amountToken);
        tokenA.transfer(msg.sender, amountToken );

    }

    function borrow(uint256 _amount) public {
        require(_amount > 0,"You cannot borrow 0");
        uint256 _balance = balanceOfTokens[msg.sender];
        require(_balance >= _amount * 2,"You must deposit twice");
        borrowedAmount[msg.sender] += _amount;
        balanceOfTokens[msg.sender] -=_amount;
        tokenA.transferFrom(msg.sender, address(this), _amount);
        tokenB.transfer(msg.sender, _amount);
    }


    function getTokenABack() public {
        require(borrowedAmount[msg.sender] >0,"You have not borrowed anything");
        //how many eth he should recieve
        uint256 amount = ((100*10**18) * (1*10**18))/borrowedAmount[msg.sender];
        uint256 borrowed = borrowedAmount[msg.sender];
        tokenB.transferFrom(msg.sender,address(this),borrowedAmount[msg.sender]);
        require(tokenB.balanceOf(msg.sender) == 0,"You should have 0 tokens");
        borrowedAmount[msg.sender] = 0;
        balanceOfTokens[msg.sender] += borrowed ;
        tokenA.transfer(msg.sender, borrowed);
    }

    function getEthBack() public {
        require(borrowedAmount[msg.sender] == 0 ,"You cannot get back your eth when you have a loan");
        require(balanceOfTokens[msg.sender] > 0,"You do not have token to get back eth");
        uint256 balanceOfTokenA = balanceOfTokens[msg.sender];
        uint256 amount = ((100 * 10 ** 18) * (1 *10 **18))/balanceOfTokenA;
        balanceOfTokens[msg.sender] = 0;
        tokenA.transferFrom(msg.sender, address(this), balanceOfTokenA);
        (payable(msg.sender)).transfer(amount);
    }
    

    function getBalanceDeposited(address _depositor) public view returns(uint256)
    {
        return balanceOfTokens[_depositor];
    } 
    function getBalanceBorrowed(address _borrower) public view returns(uint256)
    {
        return borrowedAmount[_borrower];
    } 

    function getContractBalance() public view returns(uint256)
    {
        return address(this).balance;
    }
}