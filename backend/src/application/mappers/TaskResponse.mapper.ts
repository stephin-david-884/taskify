import { Task } from "../../domain/entities/Task.entity";
import { User } from "../../domain/entities/User.entity";
import { Team } from "../../domain/entities/Team.entity";
import { TaskResponseDTO } from "../dtos/task/taskResponse.dto";

export const toTaskResponse = (
    task: Task,
    assignedMember: User,
    creator: User,
    team: Team,
): TaskResponseDTO => {
    return {
        id: task.getId(),

        title: task.title,
        description: task.description,

        status: task.status,
        priority: task.priority,

        teamId: task.teamId,
        teamName: team.name,

        createdBy: task.createdBy,
        createdByName: creator.name,

        assignedTo: task.assignedTo,
        assignedToName: assignedMember.name,

        dueDate: task.dueDate,
        completedAt: task.completedAt,
    };
};