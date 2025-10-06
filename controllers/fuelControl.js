// Databases
import pool from "../db.js"

// Fuel Types
export const getFuelTypes = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT * FROM fuel_types
        ORDER BY fuel_type_code ASC 
      `)
    res.send(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Read FuelType Error", error: err.message })
  }
}

export const addFuelTypes = async (req, res) => {
  try {
    const { fuel_type_code, fuel_type, density } = req.body

    if (!fuel_type_code || !fuel_type) {
      return res
        .status(400)
        .json({ message: "fuel_type_code and fuel_type are required" })
    }

    const { rows } = await pool.query(
      `
        INSERT INTO fuel_types (fuel_type_code, fuel_type, density) 
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [fuel_type_code, fuel_type, density]
    )

    res.status(201).json({
      message: "Fuel Type created successfully",
      data: rows[0],
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Post FuelType Error", error: err.message })
  }
}

export const deleteFuelTypes = async (req, res) => {
  const { code } = req.params
  try {
    const { rows } = await pool.query(
      `DELETE FROM fuel_types
         WHERE fuel_type_code = $1
         RETURNING *`,
      [code]
    )
    if (rows.length === 0) {
      return res.status(404).json({ message: "Fuel type code not found" })
    }
    // await loadProbeConfigsFromDB()
    res.json({
      message: "Fuel type deleted successfully",
      data: rows[0],
    })
  } catch (err) {
    console.error(err)
    res
      .status(500)
      .json({ message: "Delete FuelType Error", error: err.message })
  }
}

export const updateFuelTypes = async (req, res) => {
  const { code } = req.params
  try {
    const { fuel_type, density } = req.body

    if (!fuel_type) {
      return res.status(400).json({ message: "fuel_type are required" })
    }

    const { rows } = await pool.query(
      `
        UPDATE fuel_types
        SET fuel_type = $2,
            density = $3 
        WHERE fuel_type_code = $1
        RETURNING *
      `,
      [code, fuel_type, density]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: "Fuel type code not found" })
    }

    res.status(200).json({
      message: "Fuel Type updated successfully",
      data: rows[0],
    })
  } catch (err) {
    console.error(err)
    res
      .status(500)
      .json({ message: "Update FuelType Error", error: err.message })
  }
}

// Fuel Names
export const getFuelNames = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT f.fuel_code,f.fuel_name,f.description,f.fuel_color ,ft.fuel_type_code, ft.fuel_type
        FROM fuel_names f
        JOIN fuel_types ft
        ON f.fuel_type = ft.fuel_type_code
        ORDER BY f.fuel_code ASC 
      `)
    res.send(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Read FuelType Error", error: err.message })
  }
}

export const addFuelNames = async (req, res) => {
  const { fuel_code, fuel_name, description, fuel_type, fuel_color } = req.body
  try {
    if (!fuel_code || !fuel_name || !fuel_type) {
      return res
        .status(400)
        .json({ message: "fuel_code, fule_name, fuel_type are required" })
    }

    const { rows } = await pool.query(
      `  INSERT INTO fuel_names (fuel_code, fuel_name, description, fuel_type, fuel_color)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
      [fuel_code, fuel_name, description, fuel_type, fuel_color]
    )

    res
      .status(201)
      .json({ message: "Fuel Name created successfully", data: rows[0] })
  } catch (err) {
    console.error(err)
    res
      .status(500)
      .json({ message: "Write Fuel Name Error", error: err.message })
  }
}

export const updateFuelNames = async (req, res) => {
  const { code } = req.params
  try {
    const { fuel_name, description, fuel_type, fuel_color } = req.body
    if (!fuel_name || !fuel_type) {
      return res
        .status(400)
        .json({ message: "fuel_code, fuel_name, fuel_type are required" })
    }

    const { rows } = await pool.query(
      `  UPDATE fuel_names
         SET fuel_name = $2,
         description = $3,
             fuel_type = $4,
             fuel_color = $5

         WHERE fuel_code = $1
         RETURNING *`,
      [code, fuel_name, description, fuel_type, fuel_color]
    )

    res
      .status(200)
      .json({ message: "Fuel Name updated successfully", data: rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Update Name Error", error: err.message })
  }
}

export const deleteFuelNames = async (req, res) => {
  const { code } = req.params
  try {
    const { rows } = await pool.query(
      `DELETE FROM fuel_names
         WHERE fuel_code = $1
         RETURNING *`,
      [code]
    )
    if (rows.length === 0) {
      return res.status(404).json({ message: "Fuel code not found" })
    }
    // await loadProbeConfigsFromDB()
    res.json({
      message: "Fuel Name deleted successfully",
      data: rows[0],
    })
  } catch (err) {
    console.error(err)
    res
      .status(500)
      .json({ message: "Delete Fuel Name Error", error: err.message })
  }
}
