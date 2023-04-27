import { MessageBuilder } from '../shared/message'
const messageBuilder = new MessageBuilder()
const apiKey = '0e1a319212607124edaedb8e119b1936'

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
  try {
    const url = 'https://api.openweathermap.org/data/2.5/weather?q='+params.city+'&appid='+apiKey+'&units=metric';
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
