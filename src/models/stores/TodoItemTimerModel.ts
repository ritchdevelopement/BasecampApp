import StoreModel from "./StoreModel";

class TodoItemTimerModel extends StoreModel {

    constructor() {
        super({ name: "app" });
    }

    /**
     * Get todo item timers from app store
     */
    public getTodoItemTimers(): any {
        return this.get("todoItemTimers") || [];
    }

    /**
     * Add todo item timer to app store
     * 
     * @param todoItemId id of todo item
     * @param todoItemName name of todo item
     * @param todoItemProject project name of todo item
     * @param todoItemCompany company name of todo item
     */
    public addTodoItemTimer(todoItemId: number, todoItemName: string, todoItemProject: string, todoItemCompany: string): void {
        let todoItemTimer: object = {
            id: todoItemId,
            name: todoItemName,
            project: todoItemProject,
            company: todoItemCompany,
            paused: false,
            seconds: 0
        };
        return this.set("todoItemTimers", [...this.getTodoItemTimers(), todoItemTimer]);
    }

    /**
     * Delete todo item timer from app store by id
     */
    public deleteTodoTimer(todoItemId: number): void {
        let filteredTodoItemTimers: any[] = this.getTodoItemTimers().filter((todoItemTimer: any) => todoItemTimer["id"] !== todoItemId);
        return this.set("todoItemTimers", filteredTodoItemTimers);
    }
}

export default TodoItemTimerModel;