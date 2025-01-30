import { Handler } from "express";
import {
  CreateCampaignRequestSechema,
  UpdateCampaignRequestSechema,
} from "./schemas/CampaignsRequestSchema";
import { CampaignsService } from "../services/CampaignsService";

export class CampaignsController {
  constructor(readonly campaignsService: CampaignsService) {}

  index: Handler = async (req, res, next) => {
    try {
      const campaigns = await this.campaignsService.getAllCampaigns();
      res.json(campaigns);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateCampaignRequestSechema.parse(req.body);
      const newCampaign = await this.campaignsService.createCamapign(body);
      res.status(201).json(newCampaign);
    } catch (error) {
      next(error);
    }
  };

  show: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const campaign = await this.campaignsService.findCampaignById(id);
      res.json(campaign);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const body = UpdateCampaignRequestSechema.parse(req.body);

      const updatedCampaign = await this.campaignsService.updateCampaign(
        id,
        body
      );

      res.json(updatedCampaign);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const deletedCampaign = await this.campaignsService.deleteCampaign(id);
      res.json({ message: "Campanha excluída com sucesso!", deletedCampaign });
    } catch (error) {
      next(error);
    }
  };
}
