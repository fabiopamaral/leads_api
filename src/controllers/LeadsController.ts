import { Handler } from "express";
import {
  CreateLeadRequestSchema,
  GetLeadsRequestSchema,
  UpdateLeadRequestSchema,
} from "./schemas/LeadsRequestSchema";
import { HttpError } from "../errors/HttpError";
import {
  LeadsRepository,
  LeadWhereParams,
} from "../repositories/LeadsRepository";

export class LeadsController {
  constructor(readonly leadsRepository: LeadsRepository) {}

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

      const limit = pageSize;
      const offset = (page - 1) * pageSize;

      const where: LeadWhereParams = {};

      if (name) where.name = { like: name, mode: "insensitive" };
      if (status) where.status = status;

      const leads = await this.leadsRepository.findAll({
        where,
        sortBy,
        order,
        limit,
        offset,
      });

      const total = await this.leadsRepository.count(where);

      res.status(200).json({
        data: leads,
        meta: {
          page: Number(page),
          pageSize: limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  show: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const lead = await this.leadsRepository.findById(id);

      if (!lead) throw new HttpError(404, "lead não encontrado!");

      res.status(200).json(lead);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateLeadRequestSchema.parse(req.body);
      if (!body.status) body.status = "New";
      const newLead = await this.leadsRepository.create(body);
      res.status(201).json(newLead);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const body = UpdateLeadRequestSchema.parse(req.body);
      const id = Number(req.params.id);

      const lead = await this.leadsRepository.findById(id);
      if (!lead) throw new HttpError(404, "Lead não encontrado");

      const updatedLead = await this.leadsRepository.updateById(id, body);

      res.json(updatedLead);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      const leadExists = await this.leadsRepository.findById(id);
      if (!leadExists) throw new HttpError(404, "Lead não encontrado");

      const deletedLead = await this.leadsRepository.deleteById(id);
      res.json({ message: "lead excluído com sucesso!", deletedLead });
    } catch (error) {
      next(error);
    }
  };
}
