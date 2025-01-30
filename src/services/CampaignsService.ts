import { HttpError } from "../errors/HttpError";
import {
  CampaignsRepository,
  CreateCampaignAttributes,
} from "../repositories/CampaignsRepository";

export class CampaignsService {
  constructor(private readonly campaignsRepository: CampaignsRepository) {}

  async getAllCampaigns() {
    return await this.campaignsRepository.findAll();
  }

  async createCamapign(params: CreateCampaignAttributes) {
    return await this.campaignsRepository.create(params);
  }

  async findCampaignById(campaignId: number) {
    const campaign = await this.campaignsRepository.findById(campaignId);
    if (!campaign) throw new HttpError(404, "Campanha não encontrada");

    return await this.campaignsRepository.findById(campaignId);
  }

  async updateCampaign(
    campaignId: number,
    params: Partial<CreateCampaignAttributes>
  ) {
    const updatedCampaign = await this.campaignsRepository.findById(campaignId);
    if (!updatedCampaign) throw new HttpError(404, "campanha não encontrada");

    return await this.campaignsRepository.updateById(campaignId, params);
  }

  async deleteCampaign(campaignId: number) {
    const updatedCampaign = await this.campaignsRepository.findById(campaignId);
    if (!updatedCampaign) throw new HttpError(404, "campanha não encontrada");

    return await this.campaignsRepository.deleteById(campaignId);
  }
}
