// Databases
import pool from "../db.js"

// Tank Setting
export const getTankSettings = async (req, res) => {
  try {
    const result = await pool.query(`
         SELECT p.*, s.fuel_name
         FROM tank_setting p
         JOIN fuel_names s ON p.fuel_code = s.fuel_code
         ORDER BY p.code ASC
      `)
    res.status(200).send(result.rows)
  } catch (err) {
    console.error(err)
    res
      .status(500)
      .json({ message: "Read Tank setting Error", error: err.message })
  }
}

export const addTankSettings = async (req, res) => {
  try {
    const {
      code,
      name,
      probe_id,
      fuel_code,
      capacity,
      tank_type,
      vertical,
      horizontal,
      tank_length,
      cal_capacity,
      comp_oil,
      comp_water,
      high_alarm,
      high_alert,
      low_alarm,
      water_alarm,
    } = req.body

    const { rows } = await pool.query(
      `INSERT INTO tank_setting (code,tank_name,probe_id,fuel_code,capacity_l,tank_type,vertical_mm,horizontal_mm,length_mm,cal_capacity_l,comp_oil_mm,comp_water_mm,high_alarm_l,high_alert_l,low_alarm_l,water_high_alarm_l)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
          RETURNING *`,
      [
        code,
        name,
        probe_id,
        fuel_code,
        Number(capacity),
        Number(tank_type),
        Number(vertical),
        Number(horizontal),
        Number(tank_length),
        Number(cal_capacity),
        Number(comp_oil),
        Number(comp_water),
        Number(high_alarm),
        Number(high_alert),
        Number(low_alarm),
        Number(water_alarm),
      ]
    )
    res
      .status(201)
      .json({ message: "Fuel Name created successfully", data: rows[0] })
  } catch (err) {
    console.error(err)
    res
      .status(500)
      .json({ message: "Write Tank setting error", error: err.message })
  }
}
