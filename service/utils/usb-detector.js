import usbDetect from 'usb-detection'

// setTimeout(() => usbDetect.stopMonitoring(), 15 * 1000)

export class USBDetection {
  /**
   * @param port {MessagePort} on which to send usb add/remove events
   */
  static detectOnPort(port, vid, pid) {
    const addPattern = ['add', vid, vid].join(':')
    const removePattern = ['remove', pid, pid].join(':')

    usbDetect.on(addPattern, device => {
      port.postMessage({ type: 'add', device })
    })
    usbDetect.on(removePattern, device => {
      port.postMessage({ type: 'remove', device })
    })
    // // usbDetect.on('change', device => console.log({ type: 'change', device }))

    port.on('message', message => {
      const { type } = message
      if(type === 'find') {
        usbDetect.find(vid, pid, (err, device) => {
          if(err) { return }
          port.postMessage({ type: 'found', device })
        })
        //console.log({ type: 'find', devices: devicesX })
      }
    })

    port.on('close', err => {
      console.log('USBDetector port closed', err)
      usbDetect.stopMonitoring()
    })

    console.log('starting usb monitoring for', pid, vid)
    usbDetect.startMonitoring()
  }
}