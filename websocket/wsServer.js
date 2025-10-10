import { WebSocketServer } from "ws"

export const initWebSocket = (server) => {
  const wss = new WebSocketServer({ server })

  // 1.Connection -> ทำงานเมื่อ client เชื่อมต่อเข้ามาครั้งแรก
  wss.on("connection", (ws) => {
    console.log("Client Connected")
    //ส่งให้ client คนที่เชื่อมต่อเท่านั้น
    ws.send(JSON.stringify({ type: "WELCOME", message: "Hi new client" }))

    // 2.ทำงานเมื่อ Client ส่งข้อความมาหา server
    ws.on("message", (data) => {
      const msg = JSON.parse(data)
      console.log("Received:", msg)

      // ส่งกลับเฉพาะคนที่ส่งมา
      ws.send(JSON.stringify({ type: "REPLY", message: "Got your message" }))

      // ส่งประกาศให้ทุกคนรู้ว่ามีข้อความใหม่
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({ type: "BROADCAST", message: msg }))
        }
      })
    })

    // 3.ทำงงานเมื่อ Client ปิดการเชื่อมต่อ (เปลี่ยนหน้าเว็บ)
    ws.on("close", () => {
      console.log("Client disconnected")
    })
  })
}
