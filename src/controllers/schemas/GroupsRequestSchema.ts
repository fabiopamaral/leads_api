import { z } from "zod";

export const CreateGroupsRequestSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const UpdateGroupsRequestSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export const AddLeadRequestSchema = z.object({
  leadId: z.coerce.number(),
});
