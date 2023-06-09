import {
  DEFAULT_COLOR,
  DEFAULT_COLOR_TRANSPARENT,
  DEFAULT_COLOR_APPTEXT,
} from "../utils/config/constants";
import { json2str, str2json, buf2hex, bin2hex, bin2json, str2buf } from '../shared/data'
import { keyboard_gtr3 } from "../shared/keyboard";
import { DEVICE_WIDTH, DEVICE_HEIGHT } from "../utils/config/device";
import { imgLoader } from '../shared/loader'
const logger = DeviceRuntimeCore.HmLogger.getLogger("weather-app");
const { messageBuilder } = getApp()._options.globalData;
const { defaultWeatherApiKey } = getApp()._options.globalData;

let keyboard;
let welcomeIcon;

Page({
  state: {
    loader: null,
  },
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
      x: ((DEVICE_WIDTH - px(100)) / 2) - (px(100 / 2) + 10),
      y: px(380),
      w: px(100),
      h: px(50),
      text_size: px(26),
      radius: px(16),
      normal_color: DEFAULT_COLOR,
      press_color: DEFAULT_COLOR_TRANSPARENT,
      text: 'Search',
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
          this.showLoader()
          messageBuilder.request({
            method: "GET_DATA_WEATHER",
            params: {
              city: cityData,
              apiKey: defaultWeatherApiKey
            }
          })
            .then(data => {
              console.log('receive data console')
              const result = data.result.body;
              console.log(json2str(result))
              if (result && result.cod && (result.cod == 404 || result.cod == '404')) {
                this.removeLoader()
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
              } else if (result && result.cod && (result.cod == 401 || result.cod == '401')) {
                this.removeLoader()
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
                    eMessage: result.message
                  })
                })
              } else if (result && result.cod && (result.cod == 200 || result.cod == '200')) {
                messageBuilder.request({
                  method: "SAVE_SEARCH",
                  params: {
                    searchWord: cityData
                  }
                })
                  .then(data => {
                    this.removeLoader()
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
                        wSealevel: result.main.sea_level ? result.main.sea_level : 'NA',
                        wIcon: result.weather[0].icon,
                        eCode: result.cod,
                        eMessage: ''
                      })
                    })
                  })
              } else {
                this.removeLoader()
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
      welcomeIcon = hmUI.createWidget(hmUI.widget.IMG, {
        x: (DEVICE_WIDTH - px(100)) / 2,
        y: ((DEVICE_HEIGHT - px(100)) / 2) - 5,
        src: '02.png',
      })
      this.showLoader()
      const newLocal = messageBuilder.request({
        method: "GET_DATA_CITY"
      }).then(data => {
        const cityResult = data.result.body;
        console.log(cityResult);
        hmUI.deleteWidget(welcomeIcon);
        this.removeLoader();
        if (!cityResult) {
          hmUI.showToast({
            text: 'Please check\ninternet connection\nin mobile.'
          });
          getApp()._options.globalData.searchCity = '';
          keyboard = new keyboard_gtr3(DEVICE_HEIGHT / 5, DEVICE_WIDTH, getApp()._options.globalData.searchCity);
        } else {
          getApp()._options.globalData.searchCity = cityResult ? cityResult.city : '';
          keyboard = new keyboard_gtr3(DEVICE_HEIGHT / 5, DEVICE_WIDTH, getApp()._options.globalData.searchCity);
        }
      });
    } else {
      keyboard = new keyboard_gtr3(DEVICE_HEIGHT / 5, DEVICE_WIDTH, getApp()._options.globalData.searchCity)
    }
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: ((DEVICE_WIDTH - px(100)) / 2) + (px(100 / 2) + 10),
      y: px(380),
      w: px(100),
      h: px(50),
      text_size: px(26),
      radius: px(16),
      normal_color: DEFAULT_COLOR,
      press_color: DEFAULT_COLOR_TRANSPARENT,
      text: 'About',
      click_func: (button_widget) => {
        hmApp.gotoPage({ url: 'pages/about' })
      },
    });
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
