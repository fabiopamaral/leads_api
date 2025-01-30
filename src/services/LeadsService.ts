import {
  CreateLeadAttributes,
  LeadsRepository,
  LeadStatus,
  LeadWhereParams,
} from "../repositories/LeadsRepository";
import { HttpError } from "../errors/HttpError";
import { LeadCampaignStatus } from "../repositories/CampaignsRepository";

interface GetLeadsWithPaginationParams {
  page?: number;
  pageSize?: number;
  name?: string;
  status?: LeadStatus;
  sortBy?: "name" | "createdAt" | "status";
  order?: "asc" | "desc";
}

interface GetCampaignLeadsParams {
  campaignId: number;
  name?: string;
  status?: LeadCampaignStatus;
}

export class LeadsService {
  constructor(private readonly leadsRepository: LeadsRepository) {}

  async getAllLeadsPaginated(params: GetLeadsWithPaginationParams) {
    const { name, status, page = 1, pageSize = 10, sortBy, order } = params;

    const limit = Number(pageSize);
    const offset = (page - 1) * limit;

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

    return {
      data: leads,
      meta: {
        page: Number(page),
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCampaignLeads(params: GetCampaignLeadsParams) {}

  async createLead(params: CreateLeadAttributes) {
    if (!params.status) params.status = "New";
    const newLead = await this.leadsRepository.create(params);
    return newLead;
  }

  async getLeadById(id: number) {
    const lead = await this.leadsRepository.findById(id);
    if (!lead) throw new HttpError(404, "lead não encontrado!");
    return lead;
  }

  async updateLead(leadId: number, params: Partial<CreateLeadAttributes>) {
    const lead = await this.leadsRepository.findById(leadId);
    if (!lead) throw new HttpError(404, "Lead não encontrado.");

    if (
      lead.status === "New" &&
      params.status !== undefined &&
      params.status !== "Contacted"
    ) {
      throw new HttpError(
        400,
        "um novo lead deve ser contatado antes de ter o status atualizado para outros valores"
      );
    }

    if (params.status && params.status === "Archived") {
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - lead.updatedAt.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 180)
        throw new HttpError(
          400,
          "um lead só pode ser arquivado após 6 meses de inativadade!"
        );
    }

    const updatedLead = await this.leadsRepository.updateById(leadId, params);

    return updatedLead;
  }

  async deleteLead(leadId: number) {
    const leadExists = await this.leadsRepository.findById(leadId);
    if (!leadExists) throw new HttpError(404, "Lead não encontrado");

    const deletedLead = await this.leadsRepository.deleteById(leadId);

    return deletedLead;
  }
}
