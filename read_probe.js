const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();
const axios = require("axios");

const port = process.platform === "win32" ? "COM12" : "/dev/ttyUSB0";
const baudRate = 9600;

// รายชื่อ slave IDs
//const slave_ids = Array.from({length: 256}, (_, i) => i );
const metersIdList = [3];

// เวลาครบ 1 รอบ (ms)
const cycleTime = 1000; // 1 วิ
// เวลาระหว่างแต่ละตัว (ms)
const intervalPerMeter = cycleTime / metersIdList.length;

let currentIndex = 0;
let connected = false;

// ฟังก์ชันเชื่อมต่อพอร์ต
const connectPort = async () => {
   try {
      console.log("🔌 Trying to connect to port...");
      await client.connectRTUBuffered(port, { baudRate });
      client.setTimeout(2000); // ตั้ง timeout 500ms
      connected = true;
      console.log("✅ Connected to port!");
   } catch (e) {
      connected = false;
      console.log("❌ Connection failed, retrying in 2s...", e.message);
      setTimeout(connectPort, 2000); // retry
   }
};

// ฟังก์ชันอ่านค่าเซนเซอร์
const getMeterValue = async (id) => {
   if (!connected) {
      console.log(`⚠️  Meter ${id}: ยังไม่ได้เชื่อมต่อพอร์ต`);
      return;
   }
   try {
      await client.setID(id);

      //   let data = await client.readHoldingRegisters(0x0000, 2);
      const val = await client.readHoldingRegisters(0, 2);
      console.log(`📈 Meter ${id}:`, val.data);

      let word0 = val.data[0];
      let word1 = val.data[1];
   } catch (e) {
      console.log(`🚨 Meter ${id}: อ่านค่าไม่ได้ (${e.message})`);
      if (
         e.message.includes("Port Not Open") ||
         e.message.includes("ECONNRESET")
      ) {
         connected = false;
         console.log("🔄 Lost connection, will try to reconnect...");
         connectPort(); // trigger reconnect
      }
   }
};
let raw = [];
async function testRegisters(id) {
   await client.setID(id);
   try {
      let h = await client.readHoldingRegisters(0x0024, 2);
      console.log("HoldingRegisters:", h.data);

      let buf = reorderToCDAB(h.data);
      console.log("buf:", buf);

      // ถ้าเป็น float IEEE754
      let value = buf.readFloatBE(0);
      console.log("🌡️ Pressure:", value);
   } catch (e) {
      console.log("❌ HoldingRegisters:", e.message);
   }
}

function reorderToCDAB(raw) {
   // raw = [word0, word1] เช่น [0x0E45, 0xB249]

   // แยกแต่ละ word ออกมาเป็น byte (ตัวเลขจริง)
   let word0_hi = (raw[0] >> 8) & 0xff; // 0E
   let word0_lo = raw[0] & 0xff; // 45
   let word1_hi = (raw[1] >> 8) & 0xff; // B2
   let word1_lo = raw[1] & 0xff; // 49

   // จัดเรียงใหม่ -> CDAB (45 0E 49 B2)
   return Buffer.from([word1_hi, word1_lo, word0_hi, word0_lo]);
}

// ฟังก์ชันวนอ่านทีละตัว (round-robin)
const scheduleNext = () => {
   const id = metersIdList[currentIndex];
   //    getMeterValue(id);
   testRegisters(id);
   //    reorderTo450E49B2(raw);
   currentIndex = (currentIndex + 1) % metersIdList.length;
   setTimeout(scheduleNext, intervalPerMeter);
};

// เริ่มโปรแกรม
connectPort(); // initial connect
scheduleNext(); // start polling
