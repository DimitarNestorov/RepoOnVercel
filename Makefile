INSTALL_TARGET_PROCESSES = SpringBoard

include $(THEOS)/makefiles/common.mk

TWEAK_NAME = Blue

Blue_FILES = Tweak.x
Blue_CFLAGS = -fobjc-arc

include $(THEOS_MAKE_PATH)/tweak.mk
SUBPROJECTS += blue
include $(THEOS_MAKE_PATH)/aggregate.mk
