import { Lead } from "@prisma/client";
import {
  CreateLeadAttributes,
  FindLeadParams,
  LeadsRepository,
  LeadWhereParams,
} from "../LeadsRepository";
import { prisma } from "../../database";

export class PrismaLeadsRepository implements LeadsRepository {
  async findAll(params: FindLeadParams): Promise<Lead[]> {
    return prisma.lead.findMany({
      where: {
        name: {
          contains: params.where?.name?.like,
          equals: params.where?.name?.equals,
          mode: params.where?.name?.mode,
        },
        status: params.where?.status,
        groups: { some: { id: params.where?.groupId } },
      },

      orderBy: { [params.sortBy ?? "name"]: params.order },
      skip: params.offset,
      take: params.limit,
      include: { groups: params.include?.groups },
    });
  }

  async findById(id: number): Promise<Lead | null> {
    return prisma.lead.findUnique({
      where: { id },
      include: { campaigns: true, groups: true },
    });
  }

  async count(where: LeadWhereParams): Promise<number> {
    return prisma.lead.count({
      where: {
        name: {
          contains: where?.name?.like,
          equals: where?.name?.equals,
          mode: where?.name?.mode,
        },
        status: where?.status,
        groups: { some: { id: where.groupId } },
      },
    });
  }

  async create(attributes: CreateLeadAttributes): Promise<Lead> {
    return prisma.lead.create({ data: attributes });
  }

  async updateById(
    id: number,
    attributes: Partial<CreateLeadAttributes>
  ): Promise<Lead | null> {
    return prisma.lead.update({
      where: { id },
      data: attributes,
    });
  }

  async deleteById(id: number): Promise<Lead | null> {
    return prisma.lead.delete({ where: { id } });
  }
}
