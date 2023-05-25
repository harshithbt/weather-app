import {
    DEFAULT_COLOR,
    DEFAULT_COLOR_TRANSPARENT,
} from "../utils/config/constants";
import { DEVICE_WIDTH } from "../utils/config/device";
import { json2str, str2json, buf2hex, bin2hex, bin2json, str2buf } from '../shared/data'

const logger = DeviceRuntimeCore.HmLogger.getLogger("weather-app");
let weatherInfo = '';

Page({
    state: {
        weatherIcon: '02.png'
    },
    onInit(params) {
        const paramsObj = str2json(params)
        console.log(params);
        const { eCode, eMessage, wLocation, wDescription, wTemp, wTempMin, wTempMax, wPressure, whumidity, wSealevel, wIcon} = paramsObj
        weatherInfo = wDescription;
        if (eCode == 404) {
            weatherInfo = eMessage;
        } else if (eCode == 200) {
            weatherInfo = wLocation+'\n'+wDescription+'\nTemp- '+wTemp+'°c\n'+wTempMin+'/'+wTempMax+'°c\nHumidity- '+whumidity+'%\nPressure- '+wPressure+'mbar\nSealevel- '+wSealevel;
            this.state.weatherIcon = wIcon ? wIcon.slice(0, 2)+'.png' : '02.png';
        } else {
            weatherInfo = eMessage;
        }
        weatherInfo = weatherInfo.trim();
    },
    build() {
        hmUI.createWidget(hmUI.widget.IMG, {
            x: (DEVICE_WIDTH - px(100)) / 2,
            y: px(10),
            src: this.state.weatherIcon,
        })
        hmUI.createWidget(hmUI.widget.TEXT, {
            x: (DEVICE_WIDTH - px(350)) / 2,
            y: px(60),
            w: px(350),
            h: px(350),
            color: 0xffffff,
            text_size: px(28),
            align_h: hmUI.align.CENTER_H,
            align_v: hmUI.align.CENTER_V,
            text_style: hmUI.text_style.WRAP,
            text: weatherInfo
        });
        hmUI.createWidget(hmUI.widget.BUTTON, {
            x: ((DEVICE_WIDTH - px(100)) / 2) - (px(100/2) + 10),
            y: px(400),
            w: px(100),
            h: px(50),
            text_size: px(26),
            radius: px(16),
            normal_color: DEFAULT_COLOR,
            press_color: DEFAULT_COLOR_TRANSPARENT,
            text: "Home",
            click_func: (button_widget) => {
                hmApp.goBack();
            },
        });
        hmUI.createWidget(hmUI.widget.BUTTON, {
            x: ((DEVICE_WIDTH - px(100)) / 2) + (px(100/2) + 10),
            y: px(400),
            w: px(100),
            h: px(50),
            text_size: px(26),
            radius: px(16),
            normal_color: DEFAULT_COLOR,
            press_color: DEFAULT_COLOR_TRANSPARENT,
            text: "About",
            click_func: (button_widget) => {
                hmApp.gotoPage({ url: 'pages/about' });
            },
        });
    },
});
