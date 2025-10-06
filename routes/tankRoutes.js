import express from "express"

import { addTankSettings, getTankSettings } from "../controllers/tankControl.js"

const router = express.Router()

// Tank Setting
router.get("/setting", getTankSettings)
router.post("/setting", addTankSettings)

export default router
