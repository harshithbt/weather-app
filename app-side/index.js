import { MessageBuilder } from '../shared/message';
const messageBuilder = new MessageBuilder()
const userApikey = settings.settingsStorage.getItem('openWeatherKey');
import { DEFAULT_API_KEY } from '../utils/config/constants'

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
  const appId = userApikey ? userApikey : DEFAULT_API_KEY;
  try {
    const url = 'https://api.openweathermap.org/data/2.5/weather?q='+params.city+'&appid='+appId+'&units=metric';
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


function getSearchList() {
  return settings.settingsStorage.getItem('searchHistory')
    ? JSON.parse(settings.settingsStorage.getItem('searchHistory'))
    : []
}

function removeDuplicates(arr) {
  return arr.filter((item,
      index) => arr.indexOf(item) === index);
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
      } else if (method === 'SAVE_SEARCH') {
        const searchList = getSearchList()
        const newSearchList = [...searchList, params.searchWord]
        const refreshArray = removeDuplicates(newSearchList)
        settings.settingsStorage.setItem('searchHistory', JSON.stringify(refreshArray))
        ctx.response({
          data: { result: refreshArray },
        })
      } else if (method === 'DELETE_SEARCH') {
        const searchList = getSearchList()
        const newSearchList = searchList.filter((_, i) => i !== params.searchIndex)
        const refreshArray = removeDuplicates(newSearchList)
        settings.settingsStorage.setItem('searchHistory', JSON.stringify(refreshArray))
        ctx.response({
          data: { result: refreshArray },
        })
      } else if (method === 'GETALL_SEARCH') {
        const searchList = getSearchList()
        const refreshArray = removeDuplicates(searchList)
        ctx.response({
          data: { result: refreshArray },
        })
      }
    })
  },

  onRun() {
  },

  onDestroy() {
  }
})
