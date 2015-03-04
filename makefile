BUNDLE = ./node_modules/.bin/browserify
MINIFY = ./node_modules/.bin/uglifyjs
LINT = ./node_modules/.bin/jshint
STYLE = ./node_modules/.bin/jscs
RUNNER = ./node_modules/karma/bin/karma

NAME = localq
SRC = ./src/index.js
DEST = ./dist/localq.js
MIN = ./dist/localq.min.js

# Build
build:
	$(BUNDLE) -s $(NAME) -e $(SRC) > $(DEST)
	$(MINIFY) $(DEST) > $(MIN)

# Test
lint:
	$(LINT) ./src/*.js
	$(STYLE) ./src/*.js

unit:
	$(RUNNER) start --single-run --browsers PhantomJS karma.js

test:
	@make lint
	@make unit

.PHONY: build, lint, unit, test
