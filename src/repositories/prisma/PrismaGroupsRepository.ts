import { Group } from "@prisma/client";
import { CreateGroupAttributes, GroupsRepository } from "../GroupsRepository";
import { prisma } from "../../database";

export class PrismaGroupsRepository implements GroupsRepository {
  findAll(): Promise<Group[]> {
    return prisma.group.findMany();
  }

  findById(id: number): Promise<Group | null> {
    return prisma.group.findUnique({ where: { id }, include: { leads: true } });
  }

  create(attributes: CreateGroupAttributes): Promise<Group> {
    return prisma.group.create({ data: attributes });
  }

  updateById(
    id: number,
    attributes: Partial<CreateGroupAttributes>
  ): Promise<Group | null> {
    return prisma.group.update({
      where: { id },
      data: attributes,
    });
  }

  deleteById(id: number): Promise<Group | null> {
    return prisma.group.delete({ where: { id } });
  }
}
