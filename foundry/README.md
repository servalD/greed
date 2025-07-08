## Greed contracts

1. **Local network**

    The `.env` file template is setup with anvil default private keys so we can simply use it.

    After starting `anvil`, run:
    ```bash
    source .env.template
    forge script ./script/deploy.s.sol --rpc-url $ANVIL_RPC_URL --broadcast
    ```
2. **Sepolia**

    Fund each of the interacting accounts (basically those in the `.env` template) or ask the team for test private keys.
    ```bash
    source .env.template
    forge script ./script/deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --private-key $ADMIN_PRIVATE_KEY --broadcast
    ```
    #### Cast commands

    ```bash
     # Check roles
     cast call --rpc-url $SEPOLIA_RPC_URL 0x0Ec41ED26c8184e25E59bdFF0E65483205C4Eb4C 'hasRole(uint64,address)(bool,uint32)' <roleId> <address>

     # List guests
     cast call --rpc-url $SEPOLIA_RPC_URL 0xA662Ed93e6960a3cfd878cF58206fa71f93efe75 'guests()(address[])'

     # Accept guest as client
     cast send --rpc-url $SEPOLIA_RPC_URL --private-key $AGENT_PRIVATE_KEY 0xA662Ed93e6960a3cfd878cF58206fa71f93efe75 'acceptClient(address)' <address>

     # Hire agent
     cast send --rpc-url $SEPOLIA_RPC_URL --private-key $AGENT_PRIVATE_KEY 0xA662Ed93e6960a3cfd878cF58206fa71f93efe75 'hireAgent(address)' <address>
    ```
