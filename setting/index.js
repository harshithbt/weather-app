import { gettext } from 'i18n'
import { DEFAULT_API_KEY } from '../utils/config/constants'
AppSettingsPage({
  state: {
    apiKey: '',
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
    console.log('openWeatherKey: ', this.state.apiKey)
  },
  build(props) {
    this.setState(props)
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
        }, 'github'),
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
        }, 'Developed By Harshith B T'),
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
        apiCreateInfo,
        aboutInfo,
        developer
      ],
    )
  },
})
