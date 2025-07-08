use alloy::sol;

// Codegen from ABI file to interact with the contract.
sol!(
    #[allow(missing_docs)]
    #[sol(rpc)]
    IAgency,
    "../foundry/out/Agency.sol/Agency.json"
);

sol!(
    #[allow(missing_docs)]
    #[sol(rpc)]
    ICopro,
    "../foundry/out/Copro.sol/Copro.json"
);

sol!(
    #[allow(missing_docs)]
    #[sol(rpc)]
    IFractionalToken,
    "../foundry/out/FractionalToken.sol/FractionalToken.json"
);

sol!(
    #[allow(missing_docs)]
    #[sol(rpc)]
    IManager,
    "../foundry/out/Manager.sol/Manager.json"
);
