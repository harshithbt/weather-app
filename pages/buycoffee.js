import {
    DEFAULT_COLOR,
    DEFAULT_COLOR_TRANSPARENT,
} from "../utils/config/constants";
import { DEVICE_WIDTH } from "../utils/config/device";

const logger = DeviceRuntimeCore.HmLogger.getLogger("weather-app");

Page({
    state: {},
    build() {
        hmUI.createWidget(hmUI.widget.TEXT, {
            x: (DEVICE_WIDTH - px(288)) / 2,
            y: px(50),
            w: px(288),
            h: px(40),
            color: 0xffffff,
            text_size: px(30),
            align_h: hmUI.align.CENTER_H,
            align_v: hmUI.align.CENTER_V,
            text_style: hmUI.text_style.NONE,
            text: 'buymeacoffee'
        });
        hmUI.createWidget(hmUI.widget.QRCODE, {
            content: 'https://www.buymeacoffee.com/harshithbtw',
            x: (DEVICE_WIDTH - px(200)) / 2,
            y: px(120),
            w: px(200),
            h: px(200),
            bg_x: (DEVICE_WIDTH - px(240)) / 2,
            bg_y: px(100),
            bg_w: px(240),
            bg_h: px(240)
          })
        hmUI.createWidget(hmUI.widget.BUTTON, {
            x: (DEVICE_WIDTH - px(200)) / 2,
            y: px(380),
            w: px(200),
            h: px(50),
            text_size: px(26),
            radius: px(16),
            normal_color: DEFAULT_COLOR,
            press_color: DEFAULT_COLOR_TRANSPARENT,
            text: "Back",
            click_func: (button_widget) => {
                hmApp.goBack();
            },
        });
    },
});
