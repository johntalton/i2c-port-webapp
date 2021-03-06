import { I2CAddressedBus } from '@johntalton/and-other-delights'
import { Tca9548a } from '@johntalton/tca9548a'
import { BoschIEU } from '@johntalton/boschieu'

import { I2CWebBus } from './i2c-web-bus.js'

async function connect() {
  const ws = new WebSocket('ws://localhost:9000/bus/1', [ 'i2c', 'json' ])
  ws.onerror = event => console.warn('webSocket error', event)
  ws.onclose = event => console.log('webSocket close', event.code, event.reason)
  //ws.onopen = event => sendTestScript(ws)
  //ws.onmessage = event => ui_insert(MessageTransform.stringMessageToMessage(event.data))

  const bus = I2CWebBus.from(ws)

  ws.onopen = event => connectToBus(bus)
  ws.onmessage = event => I2CWebBus.onMessage(bus, event.data)
}

async function connectToBus(bus) {
  ui_setScan(async () => {
    const sensor = await BoschIEU.detect(I2CAddressedBus.from(bus, 0x77))
    console.log('0x77', sensor.chip.name)
  })
  /*ui_setScan(async () => {
    const ab = new I2CAddressedBus(bus, 0x70)
    const tca = await Tca9548a.from(ab)

    for(const channel of [2, 5, 6]) {
      try {
        const initialChannels = await tca.getChannels()
        console.log('Current Channels', initialChannels)

        await tca.setChannels([ channel ])

        const channels = await tca.getChannels()
        console.log('New Channel Selection', channels)


        const sensor1 = await BoschIEU.detect(I2CAddressedBus.from(bus, 0x76))
        console.log('0x76', sensor1.chip.name)

        const sensor = await BoschIEU.detect(I2CAddressedBus.from(bus, 0x77))
        console.log('0x77', sensor.chip.name)


      } catch(e) {
        console.warn('tca exception', e)
      }
    }
  })*/
}

// const uiScriptElem = document.querySelector('script[src = "./ui.js"]')
// uiScriptElem.onload = event => console.log('ui Load', event)

document.addEventListener("DOMContentLoaded", () => { console.log('DOM Content Loaded');  })

connect()