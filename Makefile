SHELL := /bin/bash

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup-all:## Install Foundry, compile le backend et build le frontend
	make setup-foundry
	make setup-back
	make setup-front

setup-front:## Install, genere les wagmi hooks et build le frontend (pnpm)
	cd ./front && \
	source .env && \
	pnpm install && \
	pnpm wagmi generate --config wagmi.config.ts && \
	pnpm run build

setup-back:## Compile le backend Rust
	cd ./back && \
	cargo build

setup-foundry:## Install les dépendances et compile les smart contracts
	cd ./foundry && \
	forge i &&\
	forge compile

foundry-deploy:## Compile, deploie sur Sepolia
	cd ./foundry && \
	source .env && \
	forge script script/deploy.s.sol:DemoScript --optimize --rpc-url $$SEPOLIA_RPC_URL --private-key $$ADMIN_PRIVATE_KEY --broadcast

foundry-verify:## Vérifie le contrat Manager, Agency et Copro sur Etherscan Sepolia
	cd ./foundry && \
	source .env && \
	forge verify-contract --watch --chain sepolia $$NEXT_PUBLIC_MANAGER src/Manager.sol:Manager --verifier etherscan --etherscan-api-key $$ETHERSCAN_API_KEY --num-of-optimizations 200 --compiler-version 0.8.25+commit.b61c2a91 --evm-version cancun --guess-constructor-args --rpc-url $$SEPOLIA_RPC_URL &&\
	forge verify-contract --watch --chain sepolia $$NEXT_PUBLIC_AGENCY src/Agency.sol:Agency --verifier etherscan --etherscan-api-key $$ETHERSCAN_API_KEY --num-of-optimizations 200 --compiler-version 0.8.25+commit.b61c2a91 --evm-version cancun --guess-constructor-args --rpc-url $$SEPOLIA_RPC_URL

back-up:## Clean, démarre les services backend et lance l'application
	make back-clean
	cd ./back && \
	source .env && \
	docker compose up -d && sleep 4 &&\
	diesel migration run && \
	cargo run

back-clean:## Stoppe les conteneurs et supprime les volumes
	cd ./back && \
	docker compose down --volumes

back-add-migration:## Crée, valide et exécute une nouvelle migration Diesel
	cd ./back && \
	read -p "Entrez le nom de la migration(snack case): " mig_name && \
	diesel migration generate $$mig_name && \
	read -p "Validez quand les scripts sont complété." &&\
	diesel migration run && \
	diesel print-schema > src/schema.rs

front-up:## Démarre le frontend
	cd ./front && \
	source .env && \
	pnpm run dev
