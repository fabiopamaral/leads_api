import { z } from "zod";

const LeadCampaignStatus = z.enum([
  "New",
  "Engaged",
  "FollowUp_Scheduled",
  "Contacted",
  "Qualified",
  "Converted",
  "Unresponsive",
  "Disqualified",
  "Re_Engaged",
  "Opted_Out",
]);

export const CreateCampaignRequestSechema = z.object({
  name: z.string(),
  description: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
});

export const UpdateCampaignRequestSechema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const GetCampaignLeadsRequestSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  name: z.string().optional(),
  status: LeadCampaignStatus.optional(),
  sortBy: z.enum(["name", "createdAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export const AddLeadCampaignRequestSchema = z.object({
  leadId: z.coerce.number(),
  status: LeadCampaignStatus.optional(),
});

export const UpdateLeadStatusRequestSchema = z.object({
  status: LeadCampaignStatus,
});
