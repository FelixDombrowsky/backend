// app.js
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const app = express();
require('dotenv').config()
const port = 8800;

// ตั้งค่าการเชื่อมต่อ TimescaleDB
const pool = new Pool({
  user: process.env.DB_USER,       
  host: process.env.DB_HOST,      
  database: process.env.DB_DATABASE,      
  password: process.env.DB_PASSWORD,  
  port: 5432,             
});

app.use(express.json());
app.use(cors());


app.get("/admin", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT username, pass
      FROM admin
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
});

app.get("/branches", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, branch_name, branch_code
      FROM branches
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
});

// fuel level ต้องทำเป็น websocket
app.get("/fuel_level", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, timestamp, tank_id, oil_h, oil_v,oil_p,water_h,water_v,water_p,ullage,temp,status
      FROM fuel_level
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
});

// Fuel Loding ======================================== 
app.get("/fuel_loading", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, timestamp, tank_id,start_time,end_time,start_h,end_h,start_v,end_v,load_v
      FROM fuel_loading
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
});

app.post("/fuel_loading", async (req, res) => {
  const {
    timestamp,tank_id,start_time,end_time,start_h,
    end_h,start_v,end_v,load_v
  } = req.body;

  try{
    const { rows } = await pool.query(
      `INSERT INTO fuel_loading (timestamp,tank_id,start_time,end_time,start_h,end_h,start_v,end_v,load_v)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [timestamp,tank_id,start_time,end_time,start_h,end_h,start_v,end_v,load_v]
    );
    res.status(201).json(rows[0]);

  }catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  };

});


// Leak Testing =======================================
app.get("/leak_test", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, timestamp, tank_id,start_time,end_time,start_h,end_h,start_v,end_v,flow_rate
      FROM leak_test
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
});

app.post("/leak_test", async (req, res) => {
  const {
    timestamp,tank_id,start_time,end_time,start_h,
    end_h,start_v,end_v,flow_rate
  } = req.body;

  try{
    const { rows } = await pool.query(
      `INSERT INTO leak_test (timestamp,tank_id,start_time,end_time,start_h,end_h,start_v,end_v,flow_rate)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [timestamp,tank_id,start_time,end_time,start_h,end_h,start_v,end_v,flow_rate]
    );
    res.status(201).json(rows[0]);

  }catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  };

});

// Probe ==============================================
app.get("/probes", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT probe_id, probe_type
      FROM probes
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
});


// tanks ==============================================
app.get("/tanks", async (req, res) => {
  try {
    const {rows} = await pool.query(`
      SELECT tank_id,probe_id,fuel_name,capacity,fuel_density,tank_length,hori_diameter,verti_diameter,
      level_comp, tank_type, unit, high_alarm, high_alert, low_alarm, tank_colors, branch_code
      FROM tanks
    `);
    console.log(rows)
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
});

app.post("/tanks", async (req, res) => {
  const {
    probe_id, fuel_name, capacity, fuel_density, tank_length,
    hori_diameter, verti_diameter, level_comp, tank_type, unit,
    high_alarm, high_alert, low_alarm, tank_colors, branch_code
  } = req.body;

  try{
    const { rows } = await pool.query(
      `INSERT INTO tanks (probe_id, fuel_name, capacity, fuel_density, tank_length, hori_diameter, verti_diameter,
        level_comp, tank_type, unit, high_alarm, high_alert, low_alarm, tank_colors, branch_code)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING *`,
      [probe_id, fuel_name, capacity, fuel_density, tank_length, hori_diameter, verti_diameter,
       level_comp, tank_type, unit, high_alarm, high_alert, low_alarm, tank_colors, branch_code]
    );
    res.status(201).json(rows[0]);

  }catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  };

});

app.put("/tanks/:id", async (req, res) => {
  const {id} = req.params;
  const {
    probe_id, fuel_name, capacity, fuel_density, tank_length,
    hori_diameter, verti_diameter, level_comp, tank_type, unit,
    high_alarm, high_alert, low_alarm, tank_colors, branch_code
  } = req.body;

  try{
    const {rows} = await pool.query(
      `UPDATE tanks
       SET probe_id = $1,
           fuel_name = $2,
           capacity = $3,
           fuel_density = $4,
           tank_length = $5,
           hori_diameter = $6,
           verti_diameter = $7,
           level_comp = $8,
           tank_type = $9,
           unit = $10,
           high_alarm = $11,
           high_alert = $12,
           low_alarm = $13,
           tank_colors = $14,
           branch_code = $15
        WHERE tank_id = $16
        RETURNING *`,
        [probe_id, fuel_name, capacity, fuel_density, tank_length, hori_diameter, verti_diameter,
         level_comp, tank_type, unit, high_alarm, high_alert, low_alarm, tank_colors, branch_code, id]
    );
    if(rows.length === 0){
      return res.status(404).json({ message: "Tank not found" });
    }
    res.json(rows[0]);

  }catch(err){
    console.log(err);
    res.status(500).send("DB Error");
  };
})

app.delete("/tanks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      `DELETE FROM tanks
       WHERE tank_id = $1
       RETURNING *`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Tank not found" });
    }

    res.json({ message: "Tank deleted successfully", tank: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
});







app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
