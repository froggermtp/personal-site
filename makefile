.POSIX:
.SUFFIXES:

NODE_ENV=production
ELEVENTY_ENV=production

watch:
	npm install --no-audit --no-fund
	NODE_ENV=development ELEVENTY_ENV=development npx eleventy --serve

build: clean
	npm ci --no-audit --no-fund
	NODE_ENV=$(NODE_ENV) ELEVENTY_ENV=$(ELEVENTY_ENV) npx eleventy

clean:
	rm -rf ./dist node_modules