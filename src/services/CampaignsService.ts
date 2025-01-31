import { LeadCampaignStatus } from "@prisma/client";
import { HttpError } from "../errors/HttpError";
import {
  AddLeadToCampaignAttributes,
  CampaignsRepository,
  CreateCampaignAttributes,
} from "../repositories/CampaignsRepository";

interface UpdateLeadStatusCampaign {
  campaignId: number;
  leadId: number;
  status: LeadCampaignStatus;
}

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

  async addLeadToCampaign(params: AddLeadToCampaignAttributes) {
    const { campaignId, leadId, status } = params;
    await this.campaignsRepository.addLead({ campaignId, leadId, status });
  }

  async updateLeadStatusFromCampaign(params: UpdateLeadStatusCampaign) {
    const { campaignId, leadId, status } = params;
    await this.campaignsRepository.updateLeadStatus({
      campaignId,
      leadId,
      status,
    });
  }

  async removeLeadFromCampaign(campaignId: number, leadId: number) {
    return await this.campaignsRepository.removeLead(campaignId, leadId);
  }
}
