import { Router } from "express";
import { LeadsController } from "./controllers/LeadsController";

export const router = Router();

const leadsController = new LeadsController();

router.get("/leads", leadsController.index);
router.get("/leads/:id", leadsController.show);
router.post("/leads", leadsController.create);
router.put("/leads/:id", leadsController.update);
router.delete("/leads/:id", leadsController.delete);

router.get("/teste", (req, res) => {
  res.json({ message: "TUDO OK" });
});
