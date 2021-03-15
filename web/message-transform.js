function arrayBufferToBinaryString(ab) {
  return String.fromCharCode(...new Uint8Array(ab))
}

function binaryStringToArrayBuffer(binaryString) {
  const bytes = Uint8Array.from([...binaryString].map(c => c.charCodeAt(0)))
  return bytes.buffer
}

export class MessageTransform {
  /**
   * @param message {Message}
   * @returns {string} encoded message
   */
  static encodeMessage(message) {
    if(message.buffer === undefined) { return JSON.stringify(message) }

    const buffer = btoa(arrayBufferToBinaryString(message.buffer))
    return JSON.stringify({ ...message, buffer })
  }

  /**
   * @param encodedMessage {string} a valid encoded `ReadWWrite` message
   * @returns {Message} decoded message
   */
  static decodeMessage(encodedMessage) {
    const message = JSON.parse(encodedMessage)
    if(message.buffer === undefined) { return message }

    const binaryString = atob(message.buffer)
    const buffer = binaryStringToArrayBuffer(binaryString)

    return { ...message, buffer }
  }
}
