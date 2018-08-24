const Metadium = artifacts.require('Metadium.sol')
const MetadiumVesting = artifacts.require('MetadiumVesting.sol')
// truffle migrate metadium --reset
module.exports = deployer => {
  const args = process.argv.slice()
  if (args[3] == 'metadium') {
    deployer.deploy(Metadium);
  } else if (args[3] == 'metadiumVesting') {
    //console.log(args[4].split(","))
    // truffle migrate metadiumVesting 0x6f0f5673d69b4608ac9be5887b2f71f20d0c3587 1523867000 300 300 "true" --reset
    // truffle migrate metadiumVesting 0x6f0f5673d69b4608ac9be5887b2f71f20d0c3587 1523867000 300 300 '' --reset  : false 로 할 때
    deployer.deploy(MetadiumVesting, args[4],args[5],args[6],args[7],args[8]);
  }
}
