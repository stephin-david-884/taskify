export enum TaskStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
}

export enum TaskPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
}

export class Task {
    public readonly id?: string;

    public title: string;
    public description: string;

    public status: TaskStatus;
    public priority: TaskPriority;

    public teamId: string;
    public createdBy: string;
    public assignedTo: string;

    public dueDate?: Date;
    public completedAt?: Date;

    constructor(props: TaskProps) {
        this.id = props.id;

        this.title = props.title;
        this.description = props.description;

        this.status = props.status ?? TaskStatus.TODO;
        this.priority = props.priority ?? TaskPriority.MEDIUM;

        this.teamId = props.teamId;
        this.createdBy = props.createdBy;
        this.assignedTo = props.assignedTo;

        this.dueDate = props.dueDate;
        this.completedAt = props.completedAt;
    }

    getId(): string {
        if (!this.id) {
            throw new Error("Task ID is not set");
        }

        return this.id;
    }

    updateTitle(title: string): void {
        this.title = title.trim();
    }

    updateDescription(description: string): void {
        this.description = description.trim();
    }

    updatePriority(priority: TaskPriority): void {
        this.priority = priority;
    }

    assignTo(memberId: string): void {
        this.assignedTo = memberId;
    }

    updateDueDate(dueDate?: Date): void {
        this.dueDate = dueDate;
    }

    start(): void {
        if (this.status === TaskStatus.COMPLETED) {
            throw new Error("Completed task cannot be started");
        }

        this.status = TaskStatus.IN_PROGRESS;
        this.completedAt = undefined;
    }

    complete(): void {
        this.status = TaskStatus.COMPLETED;
        this.completedAt = new Date();
    }

    resetToTodo(): void {
        this.status = TaskStatus.TODO;
        this.completedAt = undefined;
    }

    isCompleted(): boolean {
        return this.status === TaskStatus.COMPLETED;
    }

    isInProgress(): boolean {
        return this.status === TaskStatus.IN_PROGRESS;
    }

    isTodo(): boolean {
        return this.status === TaskStatus.TODO;
    }
}

type TaskProps = {
    id?: string;

    title: string;
    description: string;

    status?: TaskStatus;
    priority?: TaskPriority;

    teamId: string;
    createdBy: string;
    assignedTo: string;

    dueDate?: Date;
    completedAt?: Date;
};