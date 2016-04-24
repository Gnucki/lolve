MOCHA_OPTS = --check-leaks --delay --globals async
REPORTER = dot

check: test

test: test-app

test-app:
	# App
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--timeout 5000 \
		--recursive \
		$(MOCHA_OPTS) \
		test/unit/*