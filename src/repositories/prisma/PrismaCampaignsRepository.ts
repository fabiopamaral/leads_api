import { Campaign, LeadCampaign } from "@prisma/client";
import {
  AddLeadToCampaignAttributes,
  CampaignsRepository,
  CreateCampaignAttributes,
} from "../CampaignsRepository";
import { prisma } from "../../database";

export class PrismaCampaignsRepository implements CampaignsRepository {
  async findAll(): Promise<Campaign[]> {
    return prisma.campaign.findMany();
  }

  async findById(id: number): Promise<Campaign | null> {
    return prisma.campaign.findUnique({
      where: { id },
      include: { leads: true },
    });
  }

  async create(attributes: CreateCampaignAttributes): Promise<Campaign> {
    return prisma.campaign.create({ data: attributes });
  }

  async updateById(
    id: number,
    attributes: CreateCampaignAttributes
  ): Promise<Campaign | null> {
    const campaignsExists = await prisma.campaign.findUnique({ where: { id } });
    if (!campaignsExists) return null;

    return prisma.campaign.update({ where: { id }, data: attributes });
  }

  async deleteById(id: number): Promise<Campaign | null> {
    const campaignsExists = await prisma.campaign.findUnique({ where: { id } });
    if (!campaignsExists) return null;

    return prisma.campaign.delete({ where: { id } });
  }

  async addLead(attributes: AddLeadToCampaignAttributes): Promise<void> {
    await prisma.leadCampaign.create({ data: attributes });
  }

  async updateLeadStatus(
    attributes: AddLeadToCampaignAttributes
  ): Promise<void> {
    await prisma.leadCampaign.update({
      where: {
        leadId_campaignId: {
          campaignId: attributes.campaignId,
          leadId: attributes.leadId,
        },
      },
      data: attributes,
    });
  }

  async removeLead(campaignId: number, leadId: number): Promise<void> {
    await prisma.leadCampaign.delete({
      where: {
        leadId_campaignId: {
          campaignId: campaignId,
          leadId: leadId,
        },
      },
    });
  }
}
