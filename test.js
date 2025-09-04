var express = require('express')
var cors = require('cors')
//const mariadb = require('mariadb');


/*
const pool = mariadb.createPool({
  host: 'localhost', 
  user: 'root', 
  password: '', 
  database: 'stms',
  connectionLimit: 5
});

async function testConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT 1 as val");
    console.log("DB Connected ✅ Test Query Result:", rows);
  } catch (err) {
    console.error("DB Connection Error ❌:", err);
  } finally {
    if (conn) conn.release();
  }
}
testConnection(); // เรียกครั้งแรกตอนเริ่ม server

*/

var app = express()

app.use(cors())
app.use(express.json()); // รองรับ JSON body


// 🔹 API ทดสอบเชื่อม DB
app.get('/users', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM users"); // เปลี่ยนเป็น table ของคุณ
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// 🔹 API เพิ่มข้อมูล
app.post('/users', async (req, res) => {
  let conn;
  try {
    const { name, email } = req.body;
    conn = await pool.getConnection();
    const result = await conn.query(
      "INSERT INTO users(name, email) VALUES(?, ?)", 
      [name, email]
    );
    res.json({ insertedId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});


app.listen(5000, function () {
  console.log('CORS-enabled web server listening on port 5000')
})
