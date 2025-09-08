const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();

const port = process.platform === "win32" ? "COM12" : "/dev/ttyUSB0";


async function connectModbus() {
  await client.connectRTUBuffered(port, { baudRate: 9600 });
  client.setID(3);
  console.log("Connected to Modbus RTU");


  try {
    // เขียนค่า 0x0008 (8 decimal) ไปที่ Register Address 0x0002 (2 decimal)
    const data1 = await client.readHoldingRegisters(2, 1);
    console.log("before:", data1.data[0]);

    await client.writeRegister(2, 8); // adress 2 <- value : 8
    console.log("Write success: Register 0x0002 = 0x0008");
    await client.writeRegister(31, 31); // save
    // อ่านกลับมาเช็ค
    const data2 = await client.readHoldingRegisters(2, 1);
    console.log("after Read:", data2.data[0]);
  } catch (err) {
    console.error("Write Error:", err);
  }
}

connectModbus();


