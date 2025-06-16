SHELL := /bin/bash

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup-all:## Install Foundry, compile le backend et build le frontend
	make setup-foundry
	make setup-back
	make setup-front

setup-front:## Install et build le frontend (pnpm)
	cd ./front && \
	source .env && \
	pnpm install && \
	pnpm run build

setup-back:## Compile le backend Rust
	cd ./back && \
	cargo build

setup-foundry:## Install les dépendances et compile les smart contracts
	cd ./foundry && \
	forge i &&\
	forge compile

foundry-deploy:## Compile Foundry et prépare au déploiement (TBD)
	echo "start anvil before entering it as network" && \
	forge compile &&\
	echo "TBD"

back-up:## Clean, démarre les services backend et lance l'application
	make back-clean
	cd ./back && \
	source .env && \
	docker compose up -d && sleep 4 &&\
	diesel migration run && \
	cargo run

back-alloy:## Comme back-up mais pour Alloy (identique ici)
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
