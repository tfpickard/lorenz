# Lorenz Attractor Screensaver Makefile

SCREENSAVER_NAME = LorenzAttractor
BUNDLE_DIR = $(SCREENSAVER_NAME).saver
CONTENTS_DIR = $(BUNDLE_DIR)/Contents
MACOS_DIR = $(CONTENTS_DIR)/MacOS
RESOURCES_DIR = $(CONTENTS_DIR)/Resources

SWIFT_SOURCE = LorenzAttractorView.swift
INFO_PLIST = Info.plist

# Build settings
SWIFTC = swiftc
SWIFT_FLAGS = -framework ScreenSaver -framework AppKit -framework Foundation
SDK = $(shell xcrun --show-sdk-path)
TARGET = -target x86_64-apple-macosx10.13

.PHONY: all clean install uninstall

all: $(BUNDLE_DIR)

$(BUNDLE_DIR): $(SWIFT_SOURCE) $(INFO_PLIST)
	@echo "Building $(SCREENSAVER_NAME) screensaver..."

	# Create bundle directory structure
	@mkdir -p $(MACOS_DIR)
	@mkdir -p $(RESOURCES_DIR)

	# Compile Swift source
	$(SWIFTC) $(SWIFT_FLAGS) $(TARGET) -sdk $(SDK) \
		-module-name $(SCREENSAVER_NAME) \
		-emit-executable $(SWIFT_SOURCE) \
		-o $(MACOS_DIR)/$(SCREENSAVER_NAME)

	# Copy Info.plist
	@cp $(INFO_PLIST) $(CONTENTS_DIR)/Info.plist

	@echo "Build complete: $(BUNDLE_DIR)"

install: $(BUNDLE_DIR)
	@echo "Installing $(SCREENSAVER_NAME).saver..."
	@mkdir -p ~/Library/Screen\ Savers
	@cp -R $(BUNDLE_DIR) ~/Library/Screen\ Savers/
	@echo "Installed to ~/Library/Screen Savers/$(BUNDLE_DIR)"
	@echo "You can now select '$(SCREENSAVER_NAME)' in System Preferences > Desktop & Screen Saver"

uninstall:
	@echo "Uninstalling $(SCREENSAVER_NAME).saver..."
	@rm -rf ~/Library/Screen\ Savers/$(BUNDLE_DIR)
	@echo "Uninstalled"

clean:
	@echo "Cleaning build artifacts..."
	@rm -rf $(BUNDLE_DIR)
	@rm -rf *.swiftmodule *.swiftdoc
	@echo "Clean complete"
