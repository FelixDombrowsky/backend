const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();
const axios = require('axios');

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
        client.setTimeout(500); // ตั้ง timeout 500ms
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
        const val = await client.readHoldingRegisters(1, 20);
        console.log(`📈 Meter ${id}:`, val.data);

        const oil_h = val.data[3];
        const temp = (val.data[19])/10;

        // ส่งเข้า API
        await axios.post("http://localhost:8800/fuel_level", {
            timestamp: new Date().toISOString(),
            tank_id: id,
            oil_h: oil_h,
            oil_v: null,
            oil_p: null,
            water_h: null,
            water_v: null,
            water_p: null,
            ullage: null,
            temp: temp,
            status: 1
        });

        console.log(`✅ ส่งข้อมูล tank_id=${id} ไปยัง API สำเร็จ`);

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

// ฟังก์ชันวนอ่านทีละตัว (round-robin)
const scheduleNext = () => {
    const id = metersIdList[currentIndex];
    getMeterValue(id);
    currentIndex = (currentIndex + 1) % metersIdList.length;
    setTimeout(scheduleNext, intervalPerMeter);
};

// เริ่มโปรแกรม
connectPort(); // initial connect
scheduleNext(); // start polling
