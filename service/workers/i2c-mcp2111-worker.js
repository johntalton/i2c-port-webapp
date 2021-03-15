import { parentPort } from 'worker_threads'

import HID from 'node-hid'

import { i2cMultiPortService } from './service.js'

import { MCP2221 } from '@johntalton/mcp2221'
import {  I2CBusMCP2221 } from '@johntalton/i2c-bus-mcp2111'


const devices = HID.devices()
  .filter(d => d.vendorId === 0x04d8 && d.productId === 0x00dd)
  .map(d => ({
    manufacturer: d.manufacturer,
    product: d.product,

    hid: new HID.HID( d.path )
  }))

if(devices.length <= 0) { throw new Error('no devices found') }

const hid = devices[0].hid
// const lastData = new Map()

// hid.on('data', data => {
//   console.log('** data', data)
//   const dv = new DataView(data.buffer)
//   const firstByte = dv.getUint8(0)
//   console.log({ firstByte })
//   lastData.set(data.buffer)
// })
// hid.on('error', e => console.log('** error', e))

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


const device = MCP2221.from(usb)

console.log('>>>>>', await device.common.status({ }))
console.log('>>>>>', await device.flash.read({ subCommand: 0x00 }))
console.log('>>>>>', await device.sram.get({ }))

console.log('>>>>>', await device.sram.set({

  gp: {},

  gpio0: {
    designation: 'Gpio',
    direction: 'in',
    outputValue: 1

  }
}))
console.log('>>>>>', await device.sram.get({ }))

const bus = I2CBusMCP2221.from(device)

i2cMultiPortService(parentPort, bus)
