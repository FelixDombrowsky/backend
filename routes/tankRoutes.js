import express from "express"

import {
  addTankSettings,
  deleteTankSettings,
  getTankSettings,
  updateTankSettings,
  trainTankGuide,
} from "../controllers/tankControl.js"

const router = express.Router()

// Tank Setting
router.get("/setting", getTankSettings)
router.post("/setting", addTankSettings)
router.put("/setting/:code", updateTankSettings)
router.delete("/setting/:code", deleteTankSettings)

// Tank Guide Chart
router.post("/train", trainTankGuide)

export default router
