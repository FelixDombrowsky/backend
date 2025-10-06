import express from "express"
import {
  getFuelNames,
  addFuelNames,
  updateFuelNames,
  deleteFuelNames,
  getFuelTypes,
  addFuelTypes,
  updateFuelTypes,
  deleteFuelTypes,
} from "../controllers/fuelControl.js"

const router = express.Router()

// fuel types
router.get("/type", getFuelTypes)
router.post("/type", addFuelTypes)
router.put("/type/:code", updateFuelTypes)
router.delete("/type/:code", deleteFuelTypes)

// fuel names
router.get("/name", getFuelNames)
router.post("/name", addFuelNames)
router.put("/name/:code", updateFuelNames)
router.delete("/name/:code", deleteFuelNames)

// module.exports = router
export default router
