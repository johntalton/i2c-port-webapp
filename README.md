# I²C Port / Websocket App
Web App and Service for I²C over `MessagePort` / `WebSocket` with `Workers`

## Background
This is a use-case app for [@johntalton/i2c-port](https://github.com/johntalton/i2c-port) module, extending its `MessagePort` I²C abstraction over a `WebSocket`.

### Service
An `express` application that exposes a `WebSocket` for the given workers:

- `i2c-bus` (native)
- MCP2221 Bus (via usb)
- `ScriptBus` (mock)

Each service implementation complies with the `I2CBus` interface in [@johntalton/and-other-delights]().

A `Worker` is create both for isolation and abstraction form the main nodejs/express thread.


### Web Application

A static frontend to access `WebSocket` I²C Bus implementations, providing the `I2CWebBus` abstraction.

`I2CWebBus` implements the `I2CBus` interface, providing a transparent abstraction into the browser context.

## Goals

This `I2CBus` abstraction allows for Device/Sensor implementation that comply with the `I2CBus` interface, to run in / migrate to both the browser and nodejs.

A remote I²C access allows for development and design flexibility and experimentation.
