import { HttpError } from "../errors/HttpError";
import {
  CreateGroupAttributes,
  GroupsRepository,
} from "../repositories/GroupsRepository";

export class GroupsService {
  constructor(private readonly groupsRepository: GroupsRepository) {}

  async getAllGroups() {
    return await this.groupsRepository.findAll();
  }

  async createGroup(params: CreateGroupAttributes) {
    return await this.groupsRepository.create(params);
  }

  async getGroupById(groupId: number) {
    const group = await this.groupsRepository.findById(groupId);
    if (!group) throw new HttpError(404, "Grupo não encontrado!");
    return group;
  }

  async updateGroup(groupId: number, params: Partial<CreateGroupAttributes>) {
    const groupExists = await this.groupsRepository.findById(groupId);
    if (!groupExists) throw new HttpError(404, "Grupo não encontrado!");

    const updatedGroup = await this.groupsRepository.updateById(
      groupId,
      params
    );
    return updatedGroup;
  }

  async deleteGroup(groupId: number) {
    const groupExists = await this.groupsRepository.findById(groupId);
    if (!groupExists) throw new HttpError(404, "Grupo não encontrado!");

    const deletedGroup = await this.groupsRepository.deleteById(groupId);
    return deletedGroup;
  }
}
