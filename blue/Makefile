include $(THEOS)/makefiles/common.mk

BUNDLE_NAME = BluePreferences

BluePreferences_FILES = BLUERootListController.m
BluePreferences_INSTALL_PATH = /Library/PreferenceBundles
BluePreferences_FRAMEWORKS = UIKit
BluePreferences_PRIVATE_FRAMEWORKS = Preferences
BluePreferences_CFLAGS = -fobjc-arc

include $(THEOS_MAKE_PATH)/bundle.mk

internal-stage::
	$(ECHO_NOTHING)mkdir -p $(THEOS_STAGING_DIR)/Library/PreferenceLoader/Preferences$(ECHO_END)
	$(ECHO_NOTHING)cp entry.plist $(THEOS_STAGING_DIR)/Library/PreferenceLoader/Preferences/BluePreferences.plist$(ECHO_END)
