use std::env;

use alloy::network::NetworkWallet;
use alloy::providers::{ProviderBuilder, WalletProvider};
use crate::contracts::contract_interfaces::{IAgency, IManager};
use alloy::signers::local::PrivateKeySigner;
use alloy::primitives::{
  Address,
  U256
};


// pub async fn deployPlatform() -> Result<(), Box<dyn std::error::Error>> {
//   let private_key = env::var("ANVIL_PK_1").expect(&format!("{} must be set", "ANVIL_PK_1".to_string()));
//   let signer: PrivateKeySigner = private_key.parse()?;
//   let provider = ProviderBuilder::new().wallet(signer).connect("http://localhost:8545").await?;

//   let agent = address!("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");

//   let admin = provider.signer_addresses().next().expect("No signer address found");

//   let manager = IManager::deploy(&provider, admin).await?;
//   manager.addAgent(agent);
//   println!("Manager deployed at: {:?}", manager.address());

//   // let agency = IAgency::deploy(&provider, &client, (manager.address(), safe_address)).send().await?;
//   // println!("Agency deployed at: {:?}", agency.address());

//   // agency.hire_agent(agent_address).send().await?;
//   // println!("Agent hired: {:?}", agent_address);

//   Ok(())
// }
