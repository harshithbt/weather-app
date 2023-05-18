import { gettext } from 'i18n'
import { DEFAULT_API_KEY } from '../utils/config/constants'
AppSettingsPage({
  state: {
    apiKey: '',
    searchList: [],
    props: {},
  },
  addEditApiKey(val) {
    this.state.apiKey = val
    this.setItem()
  },
  deleteApiKey() {
    this.state.apiKey = ''
    this.setItem()
  },
  setItem() {
    const newString = this.state.apiKey
    this.state.props.settingsStorage.setItem('openWeatherKey', newString)
  },
  setState(props) {
    this.state.props = props
    if (props.settingsStorage.getItem('openWeatherKey')) {
      this.state.apiKey = props.settingsStorage.getItem('openWeatherKey')
    } else {
      this.state.apiKey = ''
    }
    if (props.settingsStorage.getItem('searchHistory')) {
      this.state.searchList = JSON.parse(
        props.settingsStorage.getItem('searchHistory'),
      )
    } else {
      this.state.searchList = []
    }
  },
  addSearchList(val) {
    const freshArray = [...this.state.searchList, val]
    this.state.searchList = this.removeDuplicates(freshArray)
    this.setSearchItem()
  },
  removeDuplicates(arr) {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
  },
  editSearchList(val, index) {
    this.state.searchList[index] = val
    this.setSearchItem()
  },
  deleteSearchList(index) {
    this.state.searchList = this.state.searchList.filter((_, ind) => {
      return ind !== index
    })
    this.setSearchItem()
  },
  setSearchItem() {
    const newString = JSON.stringify(this.state.searchList)
    this.state.props.settingsStorage.setItem('searchHistory', newString)
  },
  build(props) {
    this.setState(props)
    const contentItems = []
    const addBTN = View(
      {
        style: {
          fontSize: '12px',
          lineHeight: '30px',
          borderRadius: '30px',
          background: '#409EFF',
          color: 'white',
          textAlign: 'center',
          padding: '0 15px',
          width: '30%',
        },
      },
      [
        TextInput({
          label: 'Add ApiKey',
          onChange: (val) => {
            this.addEditApiKey(val)
          },
        }),
      ],
    )
    const editApiKey =
      View(
        {
          style: {
            borderBottom: '1px solid #eaeaea',
            padding: '6px 0',
            marginBottom: '6px',
            display: 'flex',
            flexDirection: 'row',
          },
        },
        [
          View(
            {
              style: {
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                justfyContent: 'center',
                alignItems: 'center',
              },
            },
            [
              TextInput({
                label: '',
                bold: true,
                value: this.state.apiKey,
                subStyle: {
                  color: '#333',
                  fontSize: '14px',
                },
                maxLength: 200,
                onChange: (val) => {
                  if (val.length > 0 && val.length <= 200) {
                    this.addEditApiKey(val)
                  } else {
                    console.log("ApiKey can't be empty")
                  }
                },
              }),
            ],
          ),
          Button({
            label: 'Delete',
            style: {
              fontSize: '12px',
              borderRadius: '30px',
              background: '#D85E33',
              color: 'white',

            },
            onClick: () => {
              this.deleteApiKey()
            },
          }),
        ],
      )
      const addSearchBTN = View(
        {
          style: {
            fontSize: '12px',
            lineHeight: '30px',
            borderRadius: '30px',
            background: '#409EFF',
            color: 'white',
            textAlign: 'center',
            marginTop: '10px',
            padding: '0 15px',
            width: '30%',
          },
        },
        [
          TextInput({
            label: 'Add Search',
            onChange: (val) => {
              this.addSearchList(val)
            },
          }),
        ],
      )
      this.state.searchList.forEach((item, index) => {
        contentItems.push(
          View(
            {
              style: {
                borderBottom: '1px solid #eaeaea',
                padding: '6px 0',
                marginBottom: '6px',
                display: 'flex',
                flexDirection: 'row',
              },
            },
            [
              View(
                {
                  style: {
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    justfyContent: 'center',
                    alignItems: 'center',
                  },
                },
                [
                  TextInput({
                    label: '',
                    bold: true,
                    value: item,
                    subStyle: {
                      color: '#333',
                      fontSize: '14px',
                    },
                    maxLength: 200,
                    onChange: (val) => {
                      if (val.length > 0 && val.length <= 200) {
                        this.editSearchList(val, index)
                      } else {
                        console.log("Search word can't be empty or too long!")
                      }
                    },
                  }),
                ],
              ),
              Button({
                label: 'Delete',
                style: {
                  fontSize: '12px',
                  borderRadius: '30px',
                  background: '#D85E33',
                  color: 'white',
                },
                onClick: () => {
                  this.deleteSearchList(index)
                },
              }),
            ],
          ),
        )
      })
    const aboutInfo = View(
      {
        style: {
          border: '1px solid #eaeaea',
          padding: '10px',
          margin: '6px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justfyContent: 'center',
          alignItems: 'center',
        },
      },
      [
        Text({
          align: 'center',
          paragraph: true,
          italic: false
        }, 'Check out source code in'),
        Link({
          source: 'https://github.com/harshithbt/weather-app',
        }, 'Github'),
      ],
    )
    const developer = View(
      {
        style: {
          border: '1px solid #eaeaea',
          padding: '10px',
          margin: '6px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justfyContent: 'center',
          alignItems: 'center',
        },
      },
      [
        Text({
          align: 'center',
          paragraph: true,
          bold: true
        }, 'Developed By\n'),
        Link({
          source: 'https://www.buymeacoffee.com/harshithbtw',
        }, 'Harshith B T'),
        Image({
          style: {
            borderRadius: '30px',
          },
          src: 'https://www.buymeacoffee.com/assets/img/guidelines/logo-mark-3.svg',
          width: '50px',
          height: '50px',
          alt: 'buymeacoffee'
        }),
      ],
    )
    const apiCreateInfo = View(
      {
        style: {
          border: '1px solid #eaeaea',
          padding: '10px',
          margin: '6px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justfyContent: 'center',
          alignItems: 'center',
        },
      },
      [
        Text({
          align: 'center',
          paragraph: true,
          italic: false
        }, 'To create your own Api Key Please visit the below link.'),
        Link({
          source: 'https://openweathermap.org/api',
        }, 'https://openweathermap.org/api'),
      ],
    )
    return View(
      {
        style: {
          padding: '12px 20px',
        },
      },
      [
        !this.state.apiKey && addBTN,
        this.state.apiKey &&
        View(
          {
            style: {
              marginTop: '12px',
              padding: '10px',
              border: '1px solid #eaeaea',
              borderRadius: '6px',
              backgroundColor: 'white',
            },
          },
          editApiKey,
        ),
        addSearchBTN,
        contentItems.length > 0 &&
          View(
            {
              style: {
                marginTop: '12px',
                padding: '10px',
                border: '1px solid #eaeaea',
                borderRadius: '6px',
                backgroundColor: 'white',
              },
            },
            [...contentItems],
          ),
        apiCreateInfo,
        aboutInfo,
        developer
      ],
    )
  },
})
