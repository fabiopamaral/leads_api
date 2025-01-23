import { Lead, LeadStatus } from "@prisma/client";

export interface LeadWhereParams {
  name?: {
    like?: string;
    equals?: string;
    mode?: "default" | "insensitve";
  };
  status?: LeadStatus;
}

export interface FindLeadParams {
  where?: LeadWhereParams;
  sortBy?: "name" | "status" | "createdAt";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface CreateLeadAttributes {
  name: string;
  email: string;
  phone: string;
  status?: LeadStatus;
}

export interface LeadsRepository {
  findAll: (params: FindLeadParams) => Promise<Lead[]>;
  findById: (id: number) => Promise<Lead | null>;
  count: (where: LeadWhereParams) => Promise<number>;
  create: (attributes: CreateLeadAttributes) => Promise<Lead>;
  updateById: (
    id: number,
    attributes: Partial<CreateLeadAttributes>
  ) => Promise<Lead | null>;
  deleteById: (id: number) => Promise<Lead | null>;
}
