pragma solidity 0.4.24;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title Metadium
 * @dev ERC20 Token, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `StandardToken` functions.
 */
contract Metadium is StandardToken, Ownable {

  string public constant name = "Metadium";
  string public constant symbol = "META";
  uint8 public constant decimals = 18; 

  uint256 public constant INITIAL_SUPPLY = 2000000000 * (10 ** uint256(decimals));

  bool public transferEnabled = false;
  
  event Burn(address burner, uint256 value);
  event TransferEnabled(address owner);
  event TransferDisabled(address owner);

  modifier isTradable(){
    require(transferEnabled || msg.sender == owner);
    _;
  }
  /**
   * @dev Constructor that gives msg.sender all of existing tokens.
   */
  function Metadium() public {
    totalSupply_ = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
    Transfer(0x0, msg.sender, INITIAL_SUPPLY);
  }

  function enableTransfer() external onlyOwner {
    transferEnabled = true;
    TransferEnabled(owner);
  }
  
  function disableTransfer() external onlyOwner {
    transferEnabled = false;
    TransferDisabled(owner);
  }

  function transfer(address to, uint256 value) public isTradable returns (bool) {
    return super.transfer(to, value);
  }
    
  function transferFrom(address from, address to, uint256 value) public isTradable returns (bool) {
    return super.transferFrom(from, to, value);
  }

  /**
   * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
   * Metadium specific require() is added to defence attack of race condition
   * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
   * @param _spender The address which will spend the funds.
   * @param _value The amount of tokens to be spent.
   */
  function approve(address _spender, uint256 _value) public returns (bool) {
    require(allowed[msg.sender][_spender] == 0);
    allowed[msg.sender][_spender] = _value;
    Approval(msg.sender, _spender, _value);
    return true;
  }
  
  /**
   * @dev Burns a specific amount of tokens.
   * @param _value The amount of token to be burned.
   */
  function burn(uint256 _value) external onlyOwner {
    require(_value <= balances[msg.sender]);
    require(_value <= totalSupply_);
    balances[msg.sender] = balances[msg.sender].sub(_value);
    totalSupply_ = totalSupply_.sub(_value);
    Burn(msg.sender, _value);
    Transfer(msg.sender, address(0), _value);
  }

}