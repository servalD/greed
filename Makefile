SHELL := /bin/bash

setup-all:
	make setup-foundry
	make setup-back
	make setup-front

setup-front:
	cd ./front && \
	source .env && \
	pnpm install && \
	pnpm run build

setup-back:
	cd ./back && \
	cargo build

setup-foundry:
	cd ./foundry && \
	forge i &&\
	forge compile

foundry-deploy:
	echo "start anvil before entering it as network" && \
	forge compile &&\
	echo "TBD"

back-up:
	make back-clean
	cd ./back && \
	source .env && \
	docker compose up -d && sleep 4 &&\
	diesel migration run && \
	cargo run

back-clean:
	cd ./back && \
	docker compose down --volumes

back-add-migration:
	cd ./back && \
	read -p "Entrez le nom de la migration(snack case): " mig_name && \
	diesel migration generate $$mig_name && \
	read -p "Validez quand les scripts sont complété." &&\
	diesel migration run && \
	diesel print-schema > src/schema.rs
