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
            text: 'Weather App'
        });
        hmUI.createWidget(hmUI.widget.TEXT, {
            x: (DEVICE_WIDTH - px(350)) / 2,
            y: px(100),
            w: px(350),
            h: px(30),
            color: 0xffffff,
            text_size: px(26),
            align_h: hmUI.align.CENTER_H,
            align_v: hmUI.align.CENTER_V,
            text_style: hmUI.text_style.WRAP,
            text: 'Developed By: Harshith B T'
        });
        hmUI.createWidget(hmUI.widget.TEXT, {
            x: (DEVICE_WIDTH - px(350)) / 2,
            y: px(150),
            w: px(350),
            h: px(100),
            color: 0xffffff,
            text_size: px(26),
            align_h: hmUI.align.CENTER_H,
            align_v: hmUI.align.CENTER_V,
            text_style: hmUI.text_style.WRAP,
            text: 'Fetch city weather details\n using openweathermap api.'
        });
        const buyCoffee = hmUI.createWidget(hmUI.widget.IMG, {
            x: (DEVICE_WIDTH - px(50)) / 2,
            y: px(300),
            src: "coffee.png",
        });
        buyCoffee.addEventListener(hmUI.event.CLICK_DOWN, () => {
            hmApp.gotoPage({ url: 'pages/buycoffee' })
        });
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
