include $(THEOS)/makefiles/common.mk

BUNDLE_NAME = RedPreferences

RedPreferences_FILES = REDRootListController.m
RedPreferences_INSTALL_PATH = /Library/PreferenceBundles
RedPreferences_FRAMEWORKS = UIKit
RedPreferences_PRIVATE_FRAMEWORKS = Preferences
RedPreferences_CFLAGS = -fobjc-arc

include $(THEOS_MAKE_PATH)/bundle.mk

internal-stage::
	$(ECHO_NOTHING)mkdir -p $(THEOS_STAGING_DIR)/Library/PreferenceLoader/Preferences$(ECHO_END)
	$(ECHO_NOTHING)cp entry.plist $(THEOS_STAGING_DIR)/Library/PreferenceLoader/Preferences/RedPreferences.plist$(ECHO_END)
