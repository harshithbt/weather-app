import './shared/device-polyfill'
import { MessageBuilder } from './shared/message'

const appId = 1014171;
const weatherApiKey = '0e1a319212607124edaedb8e119b1936';
const messageBuilder = new MessageBuilder({ appId })

App({
  globalData: {
    messageBuilder: messageBuilder,
    searchCity: '',
    weatherApiKey: weatherApiKey
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