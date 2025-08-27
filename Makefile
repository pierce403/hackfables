SHELL := /usr/bin/bash

.PHONY: all clean install html pdf epub site preview

NODE_BIN := ./node_modules/.bin
BUILD_DIR := build
SITE_DIR := $(BUILD_DIR)/site
DOCS_DIR := book
BOOK_FILE := $(DOCS_DIR)/book.adoc

all: site pdf epub

install:
	npm ci || npm install

site:
	$(NODE_BIN)/antora antora-playbook.yml || npx antora antora-playbook.yml

html: site

pdf:
	npm run build:pdf

epub:
	npm run build:epub

preview: site
	npx http-server $(SITE_DIR) -p 8080 -c-1

clean:
	rm -rf $(BUILD_DIR)
