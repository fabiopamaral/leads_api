import { Router } from "express";
import { LeadsController } from "./controllers/LeadsController";
import { PrismaLeadsRepository } from "./repositories/prisma/PrismaLeadsRepository";
import { GroupsController } from "./controllers/GroupsController";
import { PrismaGroupsRepository } from "./repositories/prisma/PrismaGroupsRepository";
import { CampaignsController } from "./controllers/CampaignsController";
import { PrismaCampaignsRepository } from "./repositories/prisma/PrismaCampaignsRepository";

export const router = Router();

const leadsRepository = new PrismaLeadsRepository();
const groupsRepository = new PrismaGroupsRepository();
const campaignsRepository = new PrismaCampaignsRepository();

const leadsController = new LeadsController(leadsRepository);
const groupsController = new GroupsController(groupsRepository);
const campaignsController = new CampaignsController(campaignsRepository);

router.get("/leads", leadsController.index);
router.get("/leads/:id", leadsController.show);
router.post("/leads", leadsController.create);
router.put("/leads/:id", leadsController.update);
router.delete("/leads/:id", leadsController.delete);

router.get("/groups", groupsController.index);
router.post("/groups", groupsController.create);
router.get("/groups/:id", groupsController.show);
router.put("/groups/:id", groupsController.update);
router.delete("/groups/:id", groupsController.delete);

router.get("/campaigns", campaignsController.index);
router.post("/campaigns", campaignsController.create);
router.get("/campaigns/:id", campaignsController.show);
router.put("/campaigns/:id", campaignsController.update);
router.delete("/campaigns/:id", campaignsController.delete);

router.get("/teste", (req, res) => {
  res.json({ message: "TUDO OK" });
});
