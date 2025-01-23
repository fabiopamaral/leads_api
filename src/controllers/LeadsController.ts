import { Handler } from "express";
import { prisma } from "../database";
import {
  CreateLeadRequestSchema,
  GetLeadsRequestSchema,
  UpdateLeadRequestSchema,
} from "./schemas/LeadsRequestSchema";
import { HttpError } from "../errors/HttpError";
import { Prisma } from "@prisma/client";

export class LeadsController {
  // GET /api/leads
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

      const where: Prisma.LeadWhereInput = {};

      if (name) where.name = { contains: name, mode: "insensitive" };
      if (status) where.status = status;

      const leads = await prisma.lead.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sortBy]: order },
      });

      const total = await prisma.lead.count({ where });

      res.status(200).json({
        data: leads,
        meta: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  show: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const lead = await prisma.lead.findUnique({
        where: { id },
        include: { groups: true, campaigns: true },
      });
      res.status(200).json(lead);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateLeadRequestSchema.parse(req.body);
      const newLead = await prisma.lead.create({ data: body });
      res.status(201).json(newLead);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const body = UpdateLeadRequestSchema.parse(req.body);
      const id = Number(req.params.id);

      const leadExists = await prisma.lead.findUnique({ where: { id } });
      if (!leadExists) throw new HttpError(404, "Lead não encontrado");

      const updatedLead = await prisma.lead.update({
        data: body,
        where: { id },
      });
      res.json(updatedLead);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      const leadExists = await prisma.lead.findUnique({ where: { id } });
      if (!leadExists) throw new HttpError(404, "Lead não encontrado");

      const deletedLead = await prisma.lead.delete({ where: { id } });
      res.json({ message: "lead excluído com sucesso!", deletedLead });
    } catch (error) {
      next(error);
    }
  };
}
