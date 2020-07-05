include $(THEOS)/makefiles/common.mk

BUNDLE_NAME = GreenPreferences

GreenPreferences_FILES = GREENRootListController.m
GreenPreferences_INSTALL_PATH = /Library/PreferenceBundles
GreenPreferences_FRAMEWORKS = UIKit
GreenPreferences_PRIVATE_FRAMEWORKS = Preferences
GreenPreferences_CFLAGS = -fobjc-arc

include $(THEOS_MAKE_PATH)/bundle.mk

internal-stage::
	$(ECHO_NOTHING)mkdir -p $(THEOS_STAGING_DIR)/Library/PreferenceLoader/Preferences$(ECHO_END)
	$(ECHO_NOTHING)cp entry.plist $(THEOS_STAGING_DIR)/Library/PreferenceLoader/Preferences/GreenPreferences.plist$(ECHO_END)
