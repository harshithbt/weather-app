import './shared/device-polyfill'
import { MessageBuilder } from './shared/message';
import { DEFAULT_API_KEY } from './utils/config/constants'

const appId = 1014171;
const messageBuilder = new MessageBuilder({ appId })

App({
  globalData: {
    messageBuilder: messageBuilder,
    searchCity: '',
    defaultWeatherApiKey: DEFAULT_API_KEY
  },
  onCreate(options) {
    console.log('app on create invoke')
    messageBuilder.connect()
  },

  onDestroy(options) {
    console.log('app on destroy invoke')
    messageBuilder.disConnect()
  }
})