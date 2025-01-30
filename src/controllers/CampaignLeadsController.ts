import { Handler } from "express";
import {
  AddLeadCampaignRequestSchema,
  GetCampaignLeadsRequestSchema,
  UpdateLeadStatusRequestSchema,
} from "./schemas/CampaignsRequestSchema";
import { CampaignsRepository } from "../repositories/CampaignsRepository";
import {
  LeadsRepository,
  LeadWhereParams,
} from "../repositories/LeadsRepository";

export class CampaignLeadsController {
  constructor(
    private readonly campaignsRepository: CampaignsRepository,
    private readonly leadsRepository: LeadsRepository
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

      const where: LeadWhereParams = {
        campaignId,
        campaignStatus: status,
      };

      if (name) where.name = { like: name, mode: "insensitive" };

      const limit = pageSize;
      const offset = (page - 1) * pageSize;

      const leads = await this.leadsRepository.findAll({
        where,
        sortBy,
        order,
        limit,
        offset,
      });

      const total = await this.leadsRepository.count(where);

      res.json({
        leads,
        meta: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      });
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
      await this.campaignsRepository.addLead({ campaignId, leadId, status });

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
        await this.campaignsRepository.updateLeadStatus({
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
      const removeLead = await this.campaignsRepository.removeLead(
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
