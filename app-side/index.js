import { MessageBuilder } from '../shared/message';
const messageBuilder = new MessageBuilder()
const userApikey = settings.settingsStorage.getItem('openWeatherKey');

// Simulating an asynchronous network request using Promise
const mockAPI = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        body: {
          data: 'HELLO WEATHER'
        }
      })
    }, 1000)
  })
}

const fetchData = async (ctx) => {
  try {
    const res = await mockAPI()
    const resBody = typeof res.body === 'string' ?  JSON.parse(res.body) : res.body
    ctx.response({
      data: { result: resBody.data },
    })

  } catch (error) {
    ctx.response({
      data: { result: 'ERROR' },
    })
  }
}

const fetchDataWeather = async (ctx, params) => {
  let apiId = ''
  if (userApikey && userApikey != '' && userApikey != undefined && userApikey != null) {
    apiId = userApikey
  } else {
    apiId = params.apiKey
  }
  console.log('apiId-',apiId);
  try {
    const url = 'https://api.openweathermap.org/data/2.5/weather?q='+params.city+'&appid='+params.apiKey+'&units=metric';
    await fetch(url)
      .then(data => {
        ctx.response({
          data: { result: data },
        })
      })
  } catch (error) {
    ctx.response({
      data: { result: 'ERROR' },
    })
  }
}

const fetchCity = async (ctx) => {
  try {
    const url = 'https://ip-api.io/json';
    await fetch(url)
      .then(data => {
        ctx.response({
          data: { result: data },
        })
      })
  } catch (error) {
    ctx.response({
      data: { result: 'ERROR' },
    })
  }
}

AppSideService({
  onInit() {
    messageBuilder.listen(() => {})

    messageBuilder.on('request', (ctx) => {
      const jsonRpc = messageBuilder.buf2Json(ctx.request.payload)
      console.log(jsonRpc);
      const { method, params } = jsonRpc
      if (method === 'GET_DATA') {
        return fetchData(ctx)
      } else if (method === 'GET_DATA_WEATHER') {
        return fetchDataWeather(ctx, params)
      } else if (method === 'GET_DATA_CITY') {
        return fetchCity(ctx)
      }
    })
  },

  onRun() {
  },

  onDestroy() {
  }
})
