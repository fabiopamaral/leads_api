import { Handler } from "express";
import {
  CreateCampaignRequestSechema,
  UpdateCampaignRequestSechema,
} from "./schemas/CampaignsRequestSchema";
import { CampaignsRepository } from "../repositories/CampaignsRepository";
import { HttpError } from "../errors/HttpError";

export class CampaignsController {
  constructor(readonly campaignsRepository: CampaignsRepository) {}

  index: Handler = async (req, res, next) => {
    try {
      const campaigns = await this.campaignsRepository.findAll();
      res.json(campaigns);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateCampaignRequestSechema.parse(req.body);
      const newCampaign = await this.campaignsRepository.create(body);

      res.status(201).json(newCampaign);
    } catch (error) {
      next(error);
    }
  };

  show: Handler = async (req, res, next) => {
    try {
      const campaign = await this.campaignsRepository.findById(+req.params.id);
      if (!campaign) throw new HttpError(404, "Campanha não encontrada");

      res.json(campaign);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const body = UpdateCampaignRequestSechema.parse(req.body);

      const updatedCampaign = await this.campaignsRepository.updateById(
        id,
        body
      );
      if (!updatedCampaign) throw new HttpError(404, "campanha não encontrada");

      res.json(updatedCampaign);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;

      const deletedCampaign = await this.campaignsRepository.deleteById(id);
      if (!deletedCampaign) throw new HttpError(404, "campanha não encontrada");

      res.json({ message: "Campanha excluída com sucesso!", deletedCampaign });
    } catch (error) {
      next(error);
    }
  };
}
