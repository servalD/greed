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

