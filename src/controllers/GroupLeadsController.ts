import { Handler } from "express";
import { GetLeadsRequestSchema } from "./schemas/LeadsRequestSchema";
import { AddLeadRequestSchema } from "./schemas/GroupsRequestSchema";
import { GroupsRepository } from "../repositories/GroupsRepository";
import {
  LeadsRepository,
  LeadWhereParams,
} from "../repositories/LeadsRepository";

export class GroupLeadsController {
  constructor(
    private readonly leadsRepository: LeadsRepository,
    private readonly groupsRepository: GroupsRepository
  ) {}
  // GET /groups/:groupId/leads
  getLeads: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      const query = GetLeadsRequestSchema.parse(req.query);
      const {
        page = 1,
        pageSize = 10,
        name,
        status,
        sortBy = "name",
        order = "asc",
      } = query;

      const limit = Number(pageSize);
      const offset = Number(page);

      const where: LeadWhereParams = { groupId };

      if (name) where.name = { like: name, mode: "insensitive" };
      if (status) where.status = status;

      const leads = await this.leadsRepository.findAll({
        where,
        sortBy,
        order,
        limit,
        offset,
        include: { groups: true },
      });

      const total = await this.leadsRepository.count(where);

      res.json({
        leads,
        meta: {
          page: offset,
          pageSize: limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /groups/:groupId/leads
  addLead: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      const { leadId } = AddLeadRequestSchema.parse(req.body);

      const updatedGroup = await this.groupsRepository.addLead(groupId, leadId);
      res.status(201).json(updatedGroup);
    } catch (error) {
      next(error);
    }
  };

  // DELETE /groups/:groupId/leads/:leadId
  removeLead: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      const leadId = +req.params.leadId;
      const updatedGroup = await this.groupsRepository.removeLead(
        groupId,
        leadId
      );

      res.json({
        message: `Lead Nº ${leadId} removido do grupo com sucesso!`,
        updatedGroup,
      });
    } catch (error) {
      next(error);
    }
  };
}
