import { Handler } from "express";
import {
  AddLeadCampaignRequestSchema,
  GetCampaignLeadsRequestSchema,
  UpdateLeadStatusRequestSchema,
} from "./schemas/CampaignsRequestSchema";
import { prisma } from "../database";
import { Prisma } from "@prisma/client";

export class CampaignLeadsController {
  // GET /campaigns/:campaignId/leads
  getLeads: Handler = async (req, res, next) => {
    try {
      const campaignId = +req.params.campaignId;
      const query = GetCampaignLeadsRequestSchema.parse(req.body);
      const {
        name,
        status,
        page = 1,
        pageSize = 10,
        sortBy = "name",
        order = "asc",
      } = query;

      const where: Prisma.LeadWhereInput = {
        campaigns: {
          some: { campaignId },
        },
      };

      if (name) where.name = { contains: name, mode: "insensitive" };
      if (status) where.campaigns = { some: { status } };

      const leads = await prisma.lead.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          campaigns: true,
        },
      });

      const total = await prisma.lead.count({ where });

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
      const { leadId, status } = AddLeadCampaignRequestSchema.parse(req.body);
      await prisma.leadCampaign.create({
        data: {
          campaignId: Number(req.params.campaignId),
          leadId,
          status,
        },
      });

      res.status(201).end();
    } catch (error) {
      next();
    }
  };

  // PUT /campaigns/:campaignId/leads/:leadId
  updateLeadStatus: Handler = async (req, res, next) => {
    try {
      const leadStatus = UpdateLeadStatusRequestSchema.parse(req.body);
      const updatedLeadCampaign = await prisma.leadCampaign.update({
        where: {
          leadId_campaignId: {
            campaignId: +req.params.campaignId,
            leadId: +req.params.leadId,
          },
        },
        data: leadStatus,
      });
      res.json(updatedLeadCampaign);
    } catch (error) {
      next();
    }
  };

  // DELETE /campaigns/:campaignId/leads/:leadId
  removeLead: Handler = async (req, res, next) => {
    try {
      const removeLead = await prisma.leadCampaign.delete({
        where: {
          leadId_campaignId: {
            campaignId: +req.params.campaignId,
            leadId: +req.params.leadId,
          },
        },
      });

      res.json({
        message: "Lead removido da campanha com sucesso!",
        removeLead,
      });
    } catch (error) {
      next();
    }
  };
}
