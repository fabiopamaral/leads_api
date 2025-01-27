import { Handler } from "express";
import {
  CreateGroupsRequestSchema,
  UpdateGroupsRequestSchema,
} from "./schemas/GroupsRequestSchema";
import { HttpError } from "../errors/HttpError";
import { GroupsRepository } from "../repositories/GroupsRepository";

export class GroupsController {
  constructor(readonly groupsRepository: GroupsRepository) {}

  index: Handler = async (req, res, next) => {
    try {
      const groups = await this.groupsRepository.findAll();
      res.json(groups);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateGroupsRequestSchema.parse(req.body);
      const newGroup = await this.groupsRepository.create(body);

      res.status(201).json(newGroup);
    } catch (error) {
      next(error);
    }
  };

  show: Handler = async (req, res, next) => {
    try {
      const group = await this.groupsRepository.findById(+req.params.id);

      if (!group) throw new HttpError(404, "Grupo não encontrado!");

      res.json(group);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const body = UpdateGroupsRequestSchema.parse(req.body);

      const groupExists = await this.groupsRepository.findById(id);
      if (!groupExists) throw new HttpError(404, "Grupo não encontrado!");

      const updatedLead = this.groupsRepository.updateById(id, body);

      res.json(updatedLead);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;

      const groupExists = await this.groupsRepository.findById(id);
      if (!groupExists) throw new HttpError(404, "Grupo não encontrado!");

      const deletedGroup = await this.groupsRepository.deleteById(id);

      res.json({ message: "Grupo deletado com sucesso!", deletedGroup });
    } catch (error) {
      next(error);
    }
  };
}
