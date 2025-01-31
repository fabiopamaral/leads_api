import { Handler } from "express";
import { GetLeadsRequestSchema } from "./schemas/LeadsRequestSchema";
import { AddLeadRequestSchema } from "./schemas/GroupsRequestSchema";
import { GroupsRepository } from "../repositories/GroupsRepository";
import {
  LeadsRepository,
  LeadWhereParams,
} from "../repositories/LeadsRepository";
import { LeadsService } from "../services/LeadsService";
import { GroupsService } from "../services/GroupsService";

export class GroupLeadsController {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly groupsService: GroupsService
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

      const leads = await this.leadsService.getGroupLeads({
        groupId,
        name,
        status,
        order,
        sortBy,
        page,
        pageSize,
      });

      res.json(leads);
    } catch (error) {
      next(error);
    }
  };

  // POST /groups/:groupId/leads
  addLead: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      const { leadId } = AddLeadRequestSchema.parse(req.body);

      const updatedGroup = await this.groupsService.addLeadToGroup(
        groupId,
        leadId
      );
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
      const updatedGroup = await this.groupsService.removeLeadFromGroup(
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
