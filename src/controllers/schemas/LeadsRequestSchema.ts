import { z } from "zod";

const LeadStatusSchema = z.enum([
  "New",
  "Contacted",
  "Qualified",
  "Converted",
  "Unresponsive",
  "Disqualified",
  "Archived",
]);

export const GetLeadsRequestSchema = z.object({
  name: z.string().optional(),
  status: LeadStatusSchema.optional(),
  order: z.enum(["asc", "desc"]).optional(),
  sortBy: z.enum(["name", "status", "createdAt"]).optional(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
});

export const CreateLeadRequestSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  status: LeadStatusSchema.optional(),
});

export const UpdateLeadRequestSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  status: LeadStatusSchema.optional(),
});
