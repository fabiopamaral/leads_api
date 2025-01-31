import { CampaignLeadsController } from "./controllers/CampaignLeadsController";
import { CampaignsController } from "./controllers/CampaignsController";
import { GroupLeadsController } from "./controllers/GroupLeadsController";
import { GroupsController } from "./controllers/GroupsController";
import { LeadsController } from "./controllers/LeadsController";
import { PrismaCampaignsRepository } from "./repositories/prisma/PrismaCampaignsRepository";
import { PrismaGroupsRepository } from "./repositories/prisma/PrismaGroupsRepository";
import { PrismaLeadsRepository } from "./repositories/prisma/PrismaLeadsRepository";
import { CampaignsService } from "./services/CampaignsService";
import { GroupsService } from "./services/GroupsService";
import { LeadsService } from "./services/LeadsService";

export const leadsRepository = new PrismaLeadsRepository();
export const groupsRepository = new PrismaGroupsRepository();
export const campaignsRepository = new PrismaCampaignsRepository();

export const leadsService = new LeadsService(leadsRepository);
export const groupsService = new GroupsService(groupsRepository);
export const campaignsService = new CampaignsService(campaignsRepository);

export const groupLeadsController = new GroupLeadsController(
  leadsService,
  groupsService
);
export const campaignLeadsController = new CampaignLeadsController(
  campaignsService,
  leadsService
);

export const leadsController = new LeadsController(leadsService);
export const groupsController = new GroupsController(groupsService);
export const campaignsController = new CampaignsController(campaignsService);
