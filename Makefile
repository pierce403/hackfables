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
	bundle install || true

site:
	$(NODE_BIN)/antora antora-playbook.yml || npx antora antora-playbook.yml

html: site

pdf:
	bundle exec asciidoctor-pdf -r asciidoctor-pdf -D $(BUILD_DIR) $(BOOK_FILE) || asciidoctor-pdf -D $(BUILD_DIR) $(BOOK_FILE)

epub:
	bundle exec asciidoctor-epub3 -D $(BUILD_DIR) $(BOOK_FILE) || asciidoctor-epub3 -D $(BUILD_DIR) $(BOOK_FILE)

preview: site
	npx http-server $(SITE_DIR) -p 8080 -c-1

clean:
	rm -rf $(BUILD_DIR)
