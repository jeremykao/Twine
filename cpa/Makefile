BOOTSTRAP = bootstrap
JAVASCRIPTS = js
LESS = less
CSS = css
CHECK=\033[32m✔\033[39m
HR=\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#

build:
	@echo "\n${HR}"
	@echo "Building Bootstrap..."
	@echo "${HR}\n"
#	@jshint js/*.js --config js/.jshintrc
#	@jshint js/tests/unit/*.js --config js/.jshintrc
#	@echo "Running JSHint on javascript...             ${CHECK} Done"
	@recess --compile ${LESS}/flat-ui.less > ${CSS}/flat-ui.css
	@recess --compile ${LESS}/twine.less > ${CSS}/twine.css
	@echo "Compiling LESS with Recess...               ${CHECK} Done"
#	@uglifyjs \
#		> ${JAVASCRIPTS}/ng.min.js
#	@echo "Compiling JS with UglifyJS...               ${CHECK} Done"
