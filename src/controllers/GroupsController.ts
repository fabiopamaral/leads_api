import { Handler } from "express";
import {
  CreateGroupsRequestSchema,
  UpdateGroupsRequestSchema,
} from "./schemas/GroupsRequestSchema";
import { GroupsService } from "../services/GroupsService";

export class GroupsController {
  constructor(readonly groupsService: GroupsService) {}

  index: Handler = async (req, res, next) => {
    try {
      const groups = await this.groupsService.getAllGroups();
      res.json(groups);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateGroupsRequestSchema.parse(req.body);
      const newGroup = await this.groupsService.createGroup(body);
      res.status(201).json(newGroup);
    } catch (error) {
      next(error);
    }
  };

  show: Handler = async (req, res, next) => {
    try {
      const group = await this.groupsService.getGroupById(+req.params.id);
      res.json(group);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const body = UpdateGroupsRequestSchema.parse(req.body);
      const updatedLead = await this.groupsService.updateGroup(id, body);
      res.json(updatedLead);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const deletedGroup = await this.groupsService.deleteGroup(id);
      res.json({ message: "Grupo deletado com sucesso!", deletedGroup });
    } catch (error) {
      next(error);
    }
  };
}
