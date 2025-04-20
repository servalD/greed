SHELL := /bin/bash

back-up:
	make back-down
	cd ./back && \
	source .env && \
	cargo build && \
	docker compose up -d && sleep 4 &&\
	diesel migration run && \
	cargo run

back-down:
	cd ./back && \
	docker compose down --volumes

back-add-migration:
	cd ./back && \
	read -p "Entrez le nom de la migration(snack case): " mig_name && \
	diesel migration generate $$mig_name && \
	read -p "Validez quand les scripts sont complété." &&\
	diesel migration run && \
	diesel print-schema > src/schema.rs
