// Databases
import pool from "../db.js"
import { levenbergMarquardt } from "ml-levenberg-marquardt"

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
      .json({ message: "Tank created successfully", data: rows[0] })
  } catch (err) {
    console.error(err)
    res
      .status(500)
      .json({ message: "Write Tank setting error", error: err.message })
  }
}

export const updateTankSettings = async (req, res) => {
  const { code } = req.params
  try {
    const {
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

    if (!code || code.trim() === "") {
      return res.status(400).json({ message: "Invalid tank code." })
    }

    const result = await pool.query(
      `UPDATE tank_setting 
      SET tank_name = $2,
          probe_id = $3,
          fuel_code = $4,
          capacity_l = $5,
          tank_type = $6,
          vertical_mm = $7,
          horizontal_mm = $8,
          length_mm = $9,
          cal_capacity_l = $10,
          comp_oil_mm = $11,
          comp_water_mm = $12,
          high_alarm_l = $13,
          high_alert_l = $14,
          low_alarm_l = $15,
          water_high_alarm_l = $16
          WHERE code = $1
          RETURNING *`,
      [
        code.trim(),
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

    // ไม่พบ code ที่จะ update
    if (result.rowCount === 0) {
      return res
        .status(400)
        .json({ mesesage: `Tank with code ${code} not found.` })
    }

    //success
    return res
      .status(200)
      .json({ message: "Tank update successfully", data: result.rows[0] })
  } catch (err) {
    console.error("Update Tank Error:", err)
    res.status(500).json({ message: "Update Tank error", error: err.message })
  }
}

export const deleteTankSettings = async (req, res) => {
  try {
    const { code } = req.params

    if (!code || code.trim() === "") {
      return res.status(400).json({ message: "Invalid Tank Code" })
    }
    const result = await pool.query(
      `
      DELETE FROM tank_setting 
      WHERE code = $1
      RETURNING *
    `,
      [code.trim()]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: `Tank with code ${code} not found.`,
      })
    }

    return res.status(200).json({
      message: `Tank with code ${code} deleted successfully.`,
    })
  } catch (err) {
    console.error("Delete Tank Error:", err)
    res.status(500).json({ message: "Delete Tank error", error: err.message })
  }
}

// Tank Guide Chart
export const trainTankGuide = async (req, res) => {
  try {
    const {
      real_data,
      tank_code,
      horizontal,
      vertical,
      tank_length,
      tank_type,
    } = req.body

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!real_data || real_data.length === 0) {
      return res.status(400).json({ error: "Missing real_data" })
    }

    // ✅ ค่าพารามิเตอร์เริ่มต้น
    const a_old = Number(horizontal)
    const b_old = Number(vertical)
    const L_old = Number(tank_length)

    // ✅ เตรียมข้อมูลสำหรับ model
    const data = {
      x: real_data.map((p) => Number(p.height)),
      y: real_data.map((p) => Number(p.volume)),
    }

    // ✅ ฟังก์ชันคำนวณพื้นที่วงรีแนวนอน
    const A = (a, b, h) => {
      const ry = b / 2
      const rx = a / 2
      const u = h / ry - 1
      if (u < -1) return 0
      if (u > 1) return Math.PI * rx * ry
      const sqrtTerm = Math.sqrt(1 - u * u)
      return rx * ry * (u * sqrtTerm + Math.asin(u) + Math.PI / 2)
    }

    // ✅ ฟังก์ชัน fitting สำหรับ Levenberg-Marquardt
    const fittingFunction = (params) => {
      const [a, b, L] = params
      return (h) => (L * A(a, b, h)) / 1_000_000 // mm³ → L
    }

    // ✅ กำหนดค่าพารามิเตอร์เริ่มต้นและ options
    const initialParams = [a_old, b_old, L_old]
    const options = {
      initialValues: initialParams,
      damping: 0.01,
      maxIterations: 500,
      gradientDifference: 1e-3,
      errorTolerance: 1e-8,
    }

    // ✅ เริ่ม train model
    console.log(`🚀 Training model for Tank ${tank_code}...`)
    const result = levenbergMarquardt(data, fittingFunction, options)

    const [a_new, b_new, L_new] = result.parameterValues

    // ✅ คำนวณค่า Volume ที่ได้จาก model เดิมและ model ใหม่
    const predict = fittingFunction(result.parameterValues)
    const vNew = data.x.map((h) => predict(h))
    const vOld = data.x.map((h) => fittingFunction(initialParams)(h))

    // ✅ คำนวณค่า R²
    const yMean = data.y.reduce((sum, val) => sum + val, 0) / data.y.length
    const ssTot = data.y.reduce((sum, val) => sum + (val - yMean) ** 2, 0)
    const ssRes = data.y.reduce((sum, val, i) => sum + (val - vNew[i]) ** 2, 0)
    const R2 = 1 - ssRes / ssTot

    console.log("tank Code :", tank_code)
    console.log("a_old :", a_old)
    console.log("b_old :", b_old)
    console.log("L_old :", L_old)
    console.log("a_new :", a_new)
    console.log("b_new :", b_new)
    console.log("L_new :", L_new)
    console.log("R2 :", R2)
    console.log("parameterError :", result.parameterError)
    console.log("iterations :", result.iterations)
    console.log("h :", data.x)
    console.log("vTrue :", data.y)
    console.log("vOld :", vOld)
    console.log("vNew :", vNew)
    console.log("Training Model Finished !!!")
    // ✅ ตอบกลับไปยัง Frontend
    return res.json({
      tank_code,
      a_old,
      b_old,
      L_old,
      a_new,
      b_new,
      L_new,
      R2,
      parameterError: result.parameterError,
      iterations: result.iterations,
      h: data.x,
      vTrue: data.y,
      vOld,
      vNew,
    })
  } catch (err) {
    console.error("❌ Train error:", err)
    res.status(500).json({ error: "Training failed", details: err.message })
  }
}
