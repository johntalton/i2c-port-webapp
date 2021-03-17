import { parentPort } from 'worker_threads'

import HID from 'node-hid'

import { I2CPortService } from '@johntalton/i2c-port'

import { MCP2221 } from '@johntalton/mcp2221'
import { I2CBusMCP2221 } from '@johntalton/i2c-bus-mcp2111'

// enumerate devices
const devices = HID.devices()
  .filter(d => d.vendorId === 0x04d8 && d.productId === 0x00dd)
  .map(d => ({
    manufacturer: d.manufacturer,
    product: d.product,

    hid: new HID.HID( d.path )
  }))

if(devices.length <= 0) { throw new Error('no devices found') }

//
const hid = devices[0].hid
//

// create a {Binding} for mcp2221
const usb = {
  read: async byteLength => {
    return new Promise((resolve, reject) => hid.read((err, data) => {
      console.log(' ** read', err, data)
      if(err) { reject(err); return }
      resolve(Uint8Array.from(data))
    }))
  },
  write: async bufferSource => { console.log(' ** write', bufferSource); hid.write(Buffer.from(bufferSource)) }
}

async function deviceUpScript(device) {
  //
  // console.log('>>>>> FLASH (power-on)', await device.flash.read({ subCommand: 0x00 }))
  // console.log('>>>>> SRAM (runtime)', await device.sram.get({ }))
  setInterval(async () => console.log('>>>>> STATUS', await device.common.status({ })), 15 * 1000)
  // setup
  // console.log('>>>>>', await device.sram.set({

  //   gp: {},

  //   gpio0: {
  //     designation: 'Gpio',
  //     direction: 'in',
  //     outputValue: 1

  //   }
  // }))
  // console.log('>>>>> SRAN (runtime - after set)', await device.sram.get({ }))
}

//
const device = MCP2221.from(usb)
await deviceUpScript(device)

const bus = I2CBusMCP2221.from(device)
I2CPortService.from(parentPort, bus)
