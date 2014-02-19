test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter spec \
		--timeout 300 \
		--require should \
		--growl \
		test/*.test.js

adminapp:
	cd website/admin/app/editor-app && rm -rf components && rm -rf build && component install && component build -c

.PHONY: adminapp test