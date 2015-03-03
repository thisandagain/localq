BUNDLE = ./node_modules/.bin/browserify
MINIFY = ./node_modules/.bin/uglifyjs
LINT = ./node_modules/.bin/jshint
STYLE = ./node_modules/.bin/jscs
RUNNER = ./node_modules/.bin/tape

NAME = localq
SRC = ./index.js
DEST = ./dist/localq.js
MIN = ./dist/localq.min.js

# Build
build:
	$(BUNDLE) -s $(NAME) -e $(SRC) > $(DEST)
	$(MINIFY) $(DEST) > $(MIN)

# Test
lint:
	$(LINT) {lib,.}/*.js
	$(STYLE) {lib,.}/*.js

unit:
	$(RUNNER) test/*.js

test:
	@make lint
	@echo "------------------------------------"
	@make unit

.PHONY: build, lint, unit, test
