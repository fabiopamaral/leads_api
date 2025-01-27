import { Router } from "express";
import { LeadsController } from "./controllers/LeadsController";
import { PrismaLeadsRepository } from "./repositories/prisma/PrismaLeadsRepository";
import { GroupsController } from "./controllers/GroupsController";

export const router = Router();

const leadsRepository = new PrismaLeadsRepository();
const groupsRepository = new GroupsController();

const leadsController = new LeadsController(leadsRepository);

router.get("/leads", leadsController.index);
router.get("/leads/:id", leadsController.show);
router.post("/leads", leadsController.create);
router.put("/leads/:id", leadsController.update);
router.delete("/leads/:id", leadsController.delete);

router.get("/groups", groupsRepository.index);
router.post("/groups", groupsRepository.create);
router.get("/groups/:id", groupsRepository.show);
router.put("/groups/:id", groupsRepository.update);
router.delete("/groups/:id", groupsRepository.delete);

router.get("/teste", (req, res) => {
  res.json({ message: "TUDO OK" });
});
