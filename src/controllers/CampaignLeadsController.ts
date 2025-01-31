import { Handler } from "express";
import {
  AddLeadCampaignRequestSchema,
  GetCampaignLeadsRequestSchema,
  UpdateLeadStatusRequestSchema,
} from "./schemas/CampaignsRequestSchema";
import { LeadsService } from "../services/LeadsService";
import { CampaignsService } from "../services/CampaignsService";

export class CampaignLeadsController {
  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly leadsService: LeadsService
  ) {}

  // GET /campaigns/:campaignId/leads
  getLeads: Handler = async (req, res, next) => {
    try {
      const campaignId = +req.params.campaignId;
      const query = GetCampaignLeadsRequestSchema.parse(req.query);
      const {
        name,
        status,
        page = 1,
        pageSize = 10,
        sortBy = "name",
        order = "asc",
      } = query;

      const leads = await this.leadsService.getCampaignLeads({
        campaignId,
        name,
        status,
        page,
        pageSize,
        sortBy,
        order,
      });

      res.json(leads);
    } catch (error) {
      next();
    }
  };

  //  POST /campaigns/:campaignId/leads
  addLead: Handler = async (req, res, next) => {
    try {
      const campaignId = +req.params.campaignId;
      const { leadId, status = "New" } = AddLeadCampaignRequestSchema.parse(
        req.body
      );

      await this.campaignsService.addLeadToCampaign({
        campaignId,
        leadId,
        status,
      });

      res.status(201).end();
    } catch (error) {
      next();
    }
  };

  // PUT /campaigns/:campaignId/leads/:leadId
  updateLeadStatus: Handler = async (req, res, next) => {
    try {
      const campaignId = +req.params.campaignId;
      const leadId = +req.params.leadId;
      const { status } = UpdateLeadStatusRequestSchema.parse(req.body);
      const updatedLeadCampaign =
        await this.campaignsService.updateLeadStatusFromCampaign({
          campaignId,
          leadId,
          status,
        });
      res.json(updatedLeadCampaign);
    } catch (error) {
      next();
    }
  };

  // DELETE /campaigns/:campaignId/leads/:leadId
  removeLead: Handler = async (req, res, next) => {
    try {
      const campaignId = +req.params.campaignId;
      const leadId = +req.params.leadId;
      const removeLead = await this.campaignsService.removeLeadFromCampaign(
        campaignId,
        leadId
      );

      res.json({
        message: "Lead removido da campanha com sucesso!",
        removeLead,
      });
    } catch (error) {
      next();
    }
  };
}
