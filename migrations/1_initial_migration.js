const Metadium = artifacts.require('Metadium.sol')
const MetadiumVesting = artifacts.require('MetadiumVesting.sol')
module.exports = deployer => {
  const args = process.argv.slice()
  if (args[3] == 'metadium') {
    deployer.deploy(Metadium);
  } else if (args[3] == 'metadiumVesting') {
    deployer.deploy(MetadiumVesting, args[4],args[5],args[6],args[7],args[8]);
  }
}
