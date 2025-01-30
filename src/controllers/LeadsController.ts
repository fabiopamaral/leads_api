import { Handler } from "express";
import {
  CreateLeadRequestSchema,
  GetLeadsRequestSchema,
  UpdateLeadRequestSchema,
} from "./schemas/LeadsRequestSchema";
import { LeadsService } from "../services/LeadsService";

export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  index: Handler = async (req, res, next) => {
    try {
      const {
        name,
        status,
        page = 1,
        pageSize = 10,
        order = "asc",
        sortBy = "name",
      } = GetLeadsRequestSchema.parse(req.query);

      const result = await this.leadsService.getAllLeadsPaginated({
        name,
        status,
        order,
        sortBy,
        page,
        pageSize,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  show: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const lead = await this.leadsService.getLeadById(id);

      res.status(200).json(lead);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateLeadRequestSchema.parse(req.body);
      const newLead = await this.leadsService.createLead(body);
      res.status(201).json(newLead);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const body = UpdateLeadRequestSchema.parse(req.body);
      const id = Number(req.params.id);

      const updatedLead = await this.leadsService.updateLead(id, body);

      res.json(updatedLead);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      const deletedLead = await this.leadsService.deleteLead(id);

      res.json({ message: "lead excluído com sucesso!", deletedLead });
    } catch (error) {
      next(error);
    }
  };
}
