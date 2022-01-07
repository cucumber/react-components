FEATURE_FILES = $(sort $(wildcard node_modules/@cucumber/compatibility-kit/javascript/features/**/*.ndjson))
TS_MESSAGE_FILES = $(patsubst node_modules/@cucumber/compatibility-kit/javascript/features/%.ndjson,acceptance/%.ts,$(FEATURE_FILES))

default: .codegen .tested

.codegen: $(TS_MESSAGE_FILES)

# Convert an .ndjson file to a .ts file with Envelope objects that can be imported
acceptance/%.ts: node_modules/@cucumber/compatibility-kit/javascript/features/%.ndjson Makefile
	mkdir -p $(@D)
	echo "// Generated file. Do not edit." > $@
	echo "export default [" >> $@
	cat $< | sed "s/$$/,/" >> $@
	echo "]" >> $@

.tested: .tested-storybook

.tested-storybook:
	npm run build-storybook
	touch $@
