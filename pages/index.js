import {
  DEFAULT_COLOR,
  DEFAULT_COLOR_TRANSPARENT,
  DEFAULT_COLOR_APPTEXT,
} from "../utils/config/constants";
import { json2str, str2json, buf2hex, bin2hex, bin2json, str2buf } from '../shared/data'
import { keyboard_gtr3 } from "../shared/keyboard";
import { DEVICE_WIDTH, DEVICE_HEIGHT } from "../utils/config/device";

const logger = DeviceRuntimeCore.HmLogger.getLogger("fetch_api");
const { messageBuilder } = getApp()._options.globalData

const buttonWidth = 100;
const buttonWidthMargin = 102;
const buttonHeight = 60;
const buttonHeightMargin = 62;
const groupHeight = 5 * buttonHeightMargin;
const margin = 15;
let keyboard;
let welcomeText;

Page({
  state: {},
  build() {
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: (DEVICE_WIDTH - px(200)) / 2,
      y: px(30),
      w: px(200),
      h: px(46),
      color: DEFAULT_COLOR_APPTEXT,
      text_size: px(28),
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: 'Weather App'
    })
    const searchbt = hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 100,
      y: px(365),
      w: px(150),
      h: px(50),
      text_size: px(26),
      radius: px(16),
      normal_color: DEFAULT_COLOR,
      press_color: DEFAULT_COLOR_TRANSPARENT,
      text: 'Search City',
      click_func: (button_widget) => {
        const cityData = keyboard.text_value.trim();
        getApp()._options.globalData.searchCity = cityData;
        console.log(cityData)
        if (!cityData) {
          hmUI.showToast({
            text: 'Please Enter City'
          })
        } else {
          console.log(cityData)
          searchbt.setProperty(hmUI.prop.TEXT, 'Searching..');
          messageBuilder.request({
            method: "GET_DATA_WEATHER",
            params: {
              city: cityData
            }
          })
            .then(data => {
              console.log('receive data console')
              searchbt.setProperty(hmUI.prop.TEXT, 'Search City');
              const result = data.result.body;
              console.log(json2str(result))
              // console.log(result.cod)
              if (result && result.cod && (result.cod == 404 || result.cod == '404')) {
                console.log('if');
                hmApp.gotoPage({
                  url: 'pages/weather',
                  param: json2str({
                    wLocation: '',
                    wDescription: '',
                    wTemp: '',
                    wTempMin: '',
                    wTempMax: '',
                    wPressure: '',
                    whumidity: '',
                    wSealevel: '',
                    wIcon: '',
                    eCode: result.cod,
                    eMessage: result.message ? result.message + '\ntry with other\ncity' : ''
                  })
                })
              } else if (result && result.cod && (result.cod == 200 || result.cod == '200')) {
                console.log('else if');
                hmApp.gotoPage({
                  url: 'pages/weather',
                  param: json2str({
                    wLocation: result.name ? result.name : '',
                    wDescription: result.weather[0].description,
                    wTemp: result.main.temp ? result.main.temp : '',
                    wTempMin: result.main.temp_min ? result.main.temp_min : '',
                    wTempMax: result.main.temp_max ? result.main.temp_max : '',
                    wPressure: result.main.pressure ? result.main.pressure : '',
                    whumidity: result.main.humidity ? result.main.humidity : '',
                    wSealevel: result.main.sea_level ? result.main.sea_level : '',
                    wIcon: result.weather[0].icon,
                    eCode: result.cod,
                    eMessage: ''
                  })
                })
              } else {
                console.log('else');
                hmApp.gotoPage({
                  url: 'pages/weather',
                  param: json2str({
                    wLocation: '',
                    wDescription: '',
                    wTemp: '',
                    wTempMin: '',
                    wTempMax: '',
                    wPressure: '',
                    whumidity: '',
                    wSealevel: '',
                    wIcon: '',
                    eCode: 500,
                    eMessage: 'Error-try after\nsome time\n or \n check internet\n connection.'
                  })
                })
              }
            })
        }
      },
    });
    if (getApp()._options.globalData.searchCity == '') {
      searchbt.setProperty(hmUI.prop.TEXT, 'Loading..');
      welcomeText = hmUI.createWidget(hmUI.widget.TEXT, {
        x: (DEVICE_WIDTH - px(350)) / 2,
        y: px(30),
        w: px(350),
        h: px(350),
        color: 0xffffff,
        text_size: px(32),
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.CENTER_V,
        text_style: hmUI.text_style.NONE,
        text: 'Welcome'
      });
      messageBuilder.request({
        method: "GET_DATA_CITY"
      }).then(data => {
        const cityResult = data.result.body;
        console.log(cityResult);
        hmUI.deleteWidget(welcomeText);
        searchbt.setProperty(hmUI.prop.TEXT, 'Search City');
        if (!cityResult) {
          hmUI.showToast({
            text: 'Please check\ninternet connection\nin mobile.'
          })
          getApp()._options.globalData.searchCity = ''
          keyboard = new keyboard_gtr3(100, DEVICE_WIDTH, getApp()._options.globalData.searchCity)
        } else {
          getApp()._options.globalData.searchCity = cityResult ? cityResult.city : ''
          keyboard = new keyboard_gtr3(100, DEVICE_WIDTH, getApp()._options.globalData.searchCity)
        }
      })
    } else {
      keyboard = new keyboard_gtr3(100, DEVICE_WIDTH, getApp()._options.globalData.searchCity)
    }
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 255,
      y: px(365),
      w: px(100),
      h: px(50),
      text_size: px(26),
      radius: px(16),
      normal_color: DEFAULT_COLOR,
      press_color: DEFAULT_COLOR_TRANSPARENT,
      text: 'about',
      click_func: (button_widget) => {
        hmApp.gotoPage({ url: 'pages/about' })
      },
    });
  },
});
