import express from "express"
import cors from "cors"
import http from "http"
import dotenv from "dotenv"
import { initWebSocket } from "./websocket/wsServer.js"

import fuelRoutes from "./routes/fuelRoutes.js"
import probeRoutes from "./routes/probeRoutes.js"
import tankRoutes from "./routes/tankRoutes.js"

dotenv.config()

const port = process.env.PORT || 8000
const app = express()
const server = http.createServer(app)

// Middleware
app.use(express.json())
app.use(cors())

// API Routes
app.use("/api/fuel", fuelRoutes)
app.use("/api/probe", probeRoutes)
app.use("/api/tank", tankRoutes)

// WebSocket
initWebSocket(server)

/////////////////////////////////////////////////////////////////////////////////////

// let connected = false
// let probeConfigs = {}
// let probeIdList = []
// let currentIndex = 0

// โหลด probe setting จาก DB
// async function loadProbeConfigs() {
//   const { rows } = await pool.query(`
//     SELECT probe_id, probe_type_id,
//            oil_h_address, oil_h_scale,
//            water_h_address, water_h_scale,
//            temp_address, temp_scale,
//            format, function_code, address_length
//     FROM probe_setting
//     ORDER BY probe_id ASC
//   `)
//   console.log("probesetting: ", rows)

//   probeConfigs = {}
//   probeIdList = []

//   rows.forEach((row) => {
//     probeConfigs[row.probe_id] = row
//     probeIdList.push(row.probe_id)
//   })

//   console.log("✅ Loaded probe configs:", probeConfigs)
// }

// อ่านแบบ safe (split block ไม่เกิน maxLen ต่อครั้ง)
// async function readRegistersSafe(client, func, start, totalLen, maxLen = 20) {
//   let raw = []
//   let addr = start

//   while (addr < start + totalLen) {
//     const len = Math.min(maxLen, start + totalLen - addr)
//     let res
//     if (func === "03") {
//       res = await client.readHoldingRegisters(addr, len)
//     } else if (func === "04") {
//       res = await client.readInputRegisters(addr, len)
//     } else {
//       throw new Error(`Unsupported function code ${func}`)
//     }
//     raw = raw.concat(res.data)
//     addr += len
//   }

//   return raw
// }

// Connect Modbus port
// async function connectPort() {
//   try {
//     await client.connectRTUBuffered(serialPort, { baudRate })
//     client.setTimeout(2000)
//     connected = true
//     console.log("✅ Connected Modbus port")
//   } catch (err) {
//     connected = false
//     console.error("❌ Modbus connect fail:", err.message)
//     setTimeout(connectPort, 2000)
//   }
// }

// ฟังก์ชัน reorder byte
// function reorder(words, format) {
//   let w0_hi = (words[0] >> 8) & 0xff
//   let w0_lo = words[0] & 0xff
//   let w1_hi = (words[1] >> 8) & 0xff
//   let w1_lo = words[1] & 0xff

//   switch (format) {
//     case "AB CD":
//       return Buffer.from([w0_hi, w0_lo, w1_hi, w1_lo])
//     case "CD AB":
//       return Buffer.from([w1_hi, w1_lo, w0_hi, w0_lo])
//     case "BA DC":
//       return Buffer.from([w0_lo, w0_hi, w1_lo, w1_hi])
//     case "DC BA":
//       return Buffer.from([w1_lo, w1_hi, w0_lo, w0_hi])
//     default:
//       return Buffer.from([w0_hi, w0_lo, w1_hi, w1_lo])
//   }
// }

// อ่าน sensor ค่าเดียว (float/word)
// function parseValue(raw, addr, length, scale, format) {
//   if (addr < 0) return null // -1 หมายถึงไม่ได้ใช้
//   if (length === 2) {
//     const buf = reorder(raw.slice(addr, addr + 2), format)
//     return buf.readFloatBE(0) * scale
//   } else {
//     return raw[addr] * scale
//   }
// }

// async function readProbe(probe_id) {
//   if (!connected) return null
//   const config = probeConfigs[probe_id]
//   if (!config) return null

//   try {
//     client.setID(probe_id)

//     // 👉 หาว่าต้องอ่านถึง address ไหน
//     const maxAddr = Math.max(
//       config.oil_h_address,
//       config.water_h_address,
//       config.temp_address
//     )
//     const totalLength = (maxAddr >= 0 ? maxAddr : 0) + config.address_length

//     // ใช้ safe reader แทนการอ่านตรง
//     const raw = await readRegistersSafe(
//       client,
//       config.function_code,
//       0,
//       totalLength,
//       20
//     )

//     const oil_h = parseValue(
//       raw,
//       config.oil_h_address,
//       config.address_length,
//       config.oil_h_scale,
//       config.format
//     )
//     const water_h = parseValue(
//       raw,
//       config.water_h_address,
//       config.address_length,
//       config.water_h_scale,
//       config.format
//     )
//     const temp = parseValue(
//       raw,
//       config.temp_address,
//       config.address_length,
//       config.temp_scale,
//       config.format
//     )

//     const data = { probe_id, oil_h, water_h, temp, timestamp: new Date() }

//     broadcastData(data)
//     return data
//   } catch (err) {
//     console.error(`🚨 Read probe ${probe_id} error:`, err.message)
//     return null
//   }
// }

// broadcast ไป client ทั้งหมด
// function broadcastData(data) {
//   wss.clients.forEach((ws) => {
//     if (ws.readyState === WebSocket.OPEN) {
//       ws.send(JSON.stringify(data))
//     }
//   })
// }

// Loop polling ทุก 1s (round-robin)
// async function scheduleNext() {
//   if (probeIdList.length === 0) {
//     setTimeout(scheduleNext, 1000)
//     return
//   }

//   const id = probeIdList[currentIndex]
//   await readProbe(id)

//   currentIndex = (currentIndex + 1) % probeIdList.length
//   setTimeout(scheduleNext, 1000)
// }

// WebSocket
// wss.on("connection", (ws) => {
//   console.log("🔗 WebSocket client connected")
//   ws.on("close", () => console.log("❌ Client disconnected"))
// })

// Start server
// ;(async () => {
//   await connectPort()
//   await loadProbeConfigs()
//   scheduleNext()
// })()

////////////////////////////////////////////////////////////////////////

server.listen(port, () => {
  console.log(`Server + WebSocket running at http://localhost:${port}`)
})
