import express from "express"
import {
  addProbeSettings,
  deleteProbeSettings,
  getProbeSettings,
  getProbeTypes,
  updateProbeSettings,
  writeProbeConfig,
  readProbeConfig,
} from "../controllers/probeControl.js"

const router = express.Router()

// probe config
router.post("/config/write", writeProbeConfig)
router.post("/config/read", readProbeConfig)

// probe setting
router.get("/setting", getProbeSettings)
router.post("/setting", addProbeSettings)
router.put("/setting/:id", updateProbeSettings)
router.delete("/setting/:id", deleteProbeSettings)

// probe type
router.get("/types", getProbeTypes)

export default router
