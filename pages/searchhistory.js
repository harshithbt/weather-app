import {
    DEFAULT_COLOR,
    DEFAULT_COLOR_TRANSPARENT,
} from "../utils/config/constants";
import { DEVICE_WIDTH, DEVICE_HEIGHT } from "../utils/config/device";
import { imgLoader } from '../shared/loader'
const logger = DeviceRuntimeCore.HmLogger.getLogger("weather-app");
const { messageBuilder } = getApp()._options.globalData;

Page({
    state: {
        loader: null,
        searchHistory: null,
        scrollList: null
    },
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
            text: 'Search History'
        });
        this.showLoader()

        messageBuilder.request({
            method: "GETALL_SEARCH"
        }).then(({ result }) => {
            this.removeLoader()
            this.state.searchHistory = result
            let backButton = 380
            if (!this.state.searchHistory || this.state.searchHistory.length == 0) {
                hmUI.createWidget(hmUI.widget.TEXT, {
                    x: px(15),
                    y: px(50),
                    w: DEVICE_WIDTH - px(15 * 2),
                    h: DEVICE_HEIGHT - px(80),
                    text: 'No data found',
                    color: 0xffffff,
                    text_size: 32,
                    align_h: hmUI.align.CENTER_H,
                    align_v: hmUI.align.CENTER_V,
                    text_style: hmUI.text_style.WRAP,
                })
            } else {
                this.state.scrollList = hmUI.createWidget(hmUI.widget.GROUP)
                this.state.searchHistory.forEach((data, i) => {
                    const widget = this.state.scrollList.createWidget(hmUI.widget.TEXT, {
                        y: px(DEVICE_HEIGHT * 0.25 + 70 * i),
                        x: 50,
                        w: px(DEVICE_WIDTH),
                        h: px(48),
                        text: data,
                        color: 0xffffff,
                        text_size: px(28),
                        align_h: hmUI.align.LEFT,
                        align_v: hmUI.align.CENTER_V,
                        text_style: hmUI.text_style.ELLIPSIS,
                    });

                    this.state.scrollList.createWidget(hmUI.widget.IMG, {
                        x: DEVICE_WIDTH - 120,
                        y: px(DEVICE_HEIGHT * 0.25 + 70 * i),
                        src: "ic_right_arrow.png",
                    });
                    widget.addEventListener(hmUI.event.CLICK_DOWN, () => {
                        getApp()._options.globalData.searchCity = data
                        hmApp.gotoPage({ url: 'pages/index' })
                    });
                    if (backButton < DEVICE_HEIGHT * 0.25 + 70 * i + 100) {
                        backButton = DEVICE_HEIGHT * 0.25 + 70 * i + 100
                    }
                });
            }
            hmUI.createWidget(hmUI.widget.BUTTON, {
                x: (DEVICE_WIDTH - px(200)) / 2,
                y: px(backButton),
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

            hmUI.createWidget(hmUI.widget.TEXT, {
                x: px(15),
                y: px(backButton + 50),
                w: DEVICE_WIDTH,
                h: px(50),
                text: '',
                color: 0xffffff,
                text_size: 32,
                align_h: hmUI.align.CENTER_H,
                align_v: hmUI.align.CENTER_V,
                text_style: hmUI.text_style.WRAP,
            })

        })
            .catch((res) => { })
    },
    showLoader() {
        this.state.loader = new imgLoader(DEVICE_WIDTH, DEVICE_HEIGHT).loader
        this.state.loader.setProperty(hmUI.prop.ANIM_STATUS, hmUI.anim_status.START)
    },
    removeLoader() {
        this.state.loader.setProperty(hmUI.prop.ANIM_STATUS, hmUI.anim_status.STOP)
        hmUI.deleteWidget(this.state.loader)
    }
});
