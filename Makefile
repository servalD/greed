SHELL := /bin/bash

back-up:
	make back-down
	cd ./back && \
	source .env && \
	docker compose up -d && \
	cargo run

back-down:
	cd ./back && \
	docker compose down && \
  command || docker volume rm back_pgdata
