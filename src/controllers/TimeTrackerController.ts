import TodoItemTimerModel from "../models/stores/TodoItemTimerModel";

const TIMERS_BUTTON_ID = "#timers-button"

const TODO_ITEM_TIMERS_KEY = "todoItemTimers";

const CLASS_TRACKED = "tracked";
const CLASS_ACTIVE = "active";
const CLASS_TRACKING = "tracking";

class TimeTrackerController {
    private alertHelper: any = require("../helpers/AlertHelper");
    private todoItemTimerModel: TodoItemTimerModel = new TodoItemTimerModel();

    constructor() {
        this.addTodoItemTimers();
        this.initLoading();
        this.onClickAddToTimerButtons();
        this.onClickRemoveTimerButtons();
        this.onTodoItemTimerStoreDidChange();
        this.increaseTodoItemTimerInterval();
        this.onClickShowTodoItemTimerList();
        this.onMouseLeaveTimersContainer();
    }

    private addTodoItemTimers(): void {
        this.getTimersList().innerHTML = "";
        this.todoItemTimerModel.getTodoItemTimers().forEach((todoItemTimer: any) => {
            this.getTimersList().insertAdjacentHTML("beforeend", this.getTodoItemTimerHtml(todoItemTimer));
        });
    }

    private initLoading(): void {
        this.todoItemTimerModel.getTodoItemTimers().forEach((todoItemTimer: any) => {
            this.addClass(<HTMLElement>document.querySelector(`#todo-item-id-${todoItemTimer.id}`), CLASS_TRACKED);
        });
        this.todoItemTimerModel.getTodoItemTimers().forEach((todoItemTimer: any) => {
            if (!todoItemTimer.paused) {
                this.addClass(<HTMLElement>document.querySelector(TIMERS_BUTTON_ID), CLASS_TRACKING);
            }
        });
        if (this.todoItemTimerModel.getTodoItemTimers().length > 0) {
            this.addClass(<HTMLElement>document.querySelector(TIMERS_BUTTON_ID), CLASS_ACTIVE);
        };
        if (!(this.todoItemTimerModel.getTodoItemTimers().length > 0)) {
            this.removeClass(<HTMLElement>document.querySelector(TIMERS_BUTTON_ID), CLASS_ACTIVE);
            this.getTimersList().append("No timers added!");
        }
    }

    private onClickAddToTimerButtons(): void {
        let addToTimerButtons: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>(".add-to-timer-button");
        addToTimerButtons.forEach(addToTimerButton => {
            addToTimerButton.addEventListener("click", () => {
                let [todoItemId, todoItemText, projectText, companyText] = this.getListRowData(addToTimerButton);

                if (!this.isTodoItemTimerAddedToTracker(todoItemId)) {
                    this.todoItemTimerModel.addTodoItemTimer(todoItemId, todoItemText, projectText, companyText);
                    this.addClass(<HTMLElement>addToTimerButton.closest(".todo-item"), CLASS_TRACKED);
                    this.addClass(<HTMLElement>document.querySelector(TIMERS_BUTTON_ID), CLASS_TRACKING);
                    this.addClass(<HTMLElement>document.querySelector(TIMERS_BUTTON_ID), CLASS_ACTIVE);
                } else {
                    this.alertHelper.addDangerAlert(`<b>${todoItemText}</b>&nbsp;has already been added to the time tracker!`);
                }
            });
        });
    }

    private onClickRemoveTimerButtons(): void {
        let removeTimerButtons: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>(".remove-button");
        removeTimerButtons.forEach(removeTimerButton => {
            removeTimerButton.addEventListener("click", () => {
                let todoItemTimerRow: HTMLElement = <HTMLElement>removeTimerButton.closest("tr");
                this.todoItemTimerModel.deleteTodoTimer(this.extractNumber(todoItemTimerRow.id));
                todoItemTimerRow.remove();
            });
        });
    }

    private onTodoItemTimerStoreDidChange(): void {
        this.todoItemTimerModel.onDidChange(TODO_ITEM_TIMERS_KEY, (newTodoItemTimers: any, oldStore: any) => {
            this.getTodoItems().forEach(todoItem => {
                this.removeClass(todoItem, CLASS_TRACKED);
            })
            newTodoItemTimers.forEach((todoItemTimer: any) => {
                this.addClass(<HTMLElement>document.querySelector(`#todo-item-id-${todoItemTimer.id}`), CLASS_TRACKED);
                if (newTodoItemTimers.length > 0) {
                    this.addClass(<HTMLElement>document.querySelector(TIMERS_BUTTON_ID), CLASS_ACTIVE);
                }
                this.setTodoItemTimerTime(todoItemTimer);
            });
            if (this.allTodoItemTimersPaused()) {
                this.addClass(<HTMLElement>document.querySelector(TIMERS_BUTTON_ID), CLASS_TRACKING);
            } else {
                this.removeClass(<HTMLElement>document.querySelector(TIMERS_BUTTON_ID), CLASS_TRACKING);
            }
            if (!(newTodoItemTimers.length > 0)) {
                this.removeClass(<HTMLElement>document.querySelector(TIMERS_BUTTON_ID), CLASS_ACTIVE);
                this.getTimersList().append("No timers added!");
            }
        });
    }


    private increaseTodoItemTimerInterval(): void {
        setInterval(() => {
            let todoItemTimers: [] = this.todoItemTimerModel.getTodoItemTimers();
            todoItemTimers.forEach((todoItemTimer: any) => {
                if (!todoItemTimer.paused) {
                    todoItemTimer.seconds += 1;
                }
            });
            this.todoItemTimerModel.set(TODO_ITEM_TIMERS_KEY, todoItemTimers);
        }, 1000);
    }


    private onClickShowTodoItemTimerList(): void {
        let timersList: HTMLElement = <HTMLElement>document.querySelector("#timers");
        let todoItemTimerList: HTMLElement = <HTMLElement>document.querySelector("#timers-button");
        todoItemTimerList.addEventListener("click", () => {
            this.addTodoItemTimers();
            this.onClickRemoveTimerButtons();
            this.onClickControlTimerButtons();
            this.onClickSaveTimerButtons();
            this.todoItemTimerModel.getTodoItemTimers().forEach((todoItemTimer: any) => {
                this.setTodoItemTimerTime(todoItemTimer);
            });
            if (!(this.todoItemTimerModel.getTodoItemTimers().length > 0)) {
                this.getTimersList().append("No timers added!");
            }
            this.removeClass(timersList, "hide");
        });
    }

    private onMouseLeaveTimersContainer(): void {
        let timersContainer: HTMLElement = <HTMLElement>document.querySelector("#timers-container");
        let timersList: HTMLElement = <HTMLElement>document.querySelector("#timers");
        timersContainer.addEventListener('mouseleave', () => {
            this.addClass(timersList, "hide");
        });
    }

    public setTodoItemTimerPaused(todoItemTimerId: any, paused: boolean) {
        let todoItemTimers: [] = this.todoItemTimerModel.getTodoItemTimers();
        todoItemTimers.forEach((todoItemTimer: any) => {
            if (todoItemTimer.id === todoItemTimerId) {
                todoItemTimer.paused = paused;
            }
        });
        this.todoItemTimerModel.set(TODO_ITEM_TIMERS_KEY, todoItemTimers);
    }

    private onClickControlTimerButtons(): void {
        let playTimerButtons: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>(".play-button");
        playTimerButtons.forEach(playTimerButton => {
            playTimerButton.addEventListener("click", () => {
                let todoItemTimerRow: HTMLElement = <HTMLElement>playTimerButton.closest("tr");
                if (playTimerButton.classList.contains("playing")) {
                    this.removeClass(playTimerButton, "playing");
                    this.setTodoItemTimerPaused(this.extractNumber(todoItemTimerRow.id), true);
                } else {
                    this.addClass(playTimerButton, "playing");
                    this.setTodoItemTimerPaused(this.extractNumber(todoItemTimerRow.id), false);
                }
            });
        });
    }

    private onClickSaveTimerButtons(): void {
        const { ipcRenderer } = require("electron");
        let saveTimerButtons: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>(".save-button");
        saveTimerButtons.forEach(saveTimerButton => {
            saveTimerButton.addEventListener("click", () => {
                let todoItemTimerRow: HTMLElement = <HTMLElement>saveTimerButton.closest("tr");
                this.extractNumber(todoItemTimerRow.id);
                const dialogs = require('dialogs')({ ok: "Save" });
                dialogs.prompt('Description (optional)', (description: any) => {
                    if (description) {
                        ipcRenderer.sendSync("save-todo-item-time", description);
                    } else {
                        this.alertHelper.addDangerAlert("Something went wrong while saving");
                    }
                })
            })
        })
    }

    private getTodoItemTimerHtml(todoItemTimer: any): string {
        return `<tr id="timer-id-${todoItemTimer.id}">
            <td class="uk-table-shrink uk-margin-right-small uk-padding-remove-horizontal todo-item-timer-time">
            </td>
            <td class="uk-table-expand uk-margin-right-small">
                <div class="project">${todoItemTimer.name}</div>
                <div class="company">${todoItemTimer.company}</div>
            </td>
            <td class="uk-width-small uk-text-right uk-padding-remove-horizontal">
                <a class="uk-icon-button uk-margin-small-right play-button${todoItemTimer.paused ? "" : " playing"}" uk-icon="icon: play"></a>
                <a class="uk-icon-button uk-margin-small-right save-button" uk-icon="icon: pull"></a>
                <a class="uk-icon-button remove-button" uk-icon="icon: trash"></a>
            </td>
        </tr>
        `
    }

    private setTodoItemTimerTime(todoItemTimer: any) {
        let todoItemTimerTime: HTMLElement = <HTMLElement>document.querySelector(`#timer-id-${todoItemTimer.id} .todo-item-timer-time`);
        let todoItemTimerSeconds: number = todoItemTimer.seconds;
        let s: number = todoItemTimerSeconds % 60;
        let m: number = Math.floor(todoItemTimerSeconds / 60) % 60;
        let h: number = Math.floor(todoItemTimerSeconds / 3600);
        if (todoItemTimerTime) {
            todoItemTimerTime.innerHTML = (h >= 10 ? "" : "0") + h + ":" + (m >= 10 ? "" : "0") + m + ":" + (s >= 10 ? "" : "0") + s;
        }
    }

    private addClass(todoItem: HTMLElement, classString: string): void {
        todoItem.classList.add(classString);
    }

    private removeClass(todoItem: HTMLElement, classString: string): void {
        todoItem.classList.remove(classString);
    }

    private getListRowData(addToTimerButton: HTMLElement): any[] {
        let todoItemRow: HTMLElement = <HTMLElement>addToTimerButton.closest("tr");
        let company: HTMLElement = <HTMLElement>todoItemRow.querySelector(".company");
        let project: HTMLElement = <HTMLElement>todoItemRow.querySelector(".project");
        let todoItem: HTMLElement = <HTMLElement>addToTimerButton.closest(".todo-item");

        let todoItemId: number = this.extractNumber(todoItem.id);
        let todoItemText: string = todoItem.textContent || "";
        let companyText: string = company.textContent || "";
        let projectText: string = project.textContent || "";

        return [todoItemId, todoItemText, projectText, companyText];
    }

    private isTodoItemTimerAddedToTracker(todoItemId: number): boolean {
        return this.todoItemTimerModel.getTodoItemTimers().filter((todoItemTimer: any) => todoItemTimer.id === todoItemId).length > 0;
    }

    private allTodoItemTimersPaused(): boolean {
        return this.todoItemTimerModel.getTodoItemTimers().filter((todoItemTimer: any) => todoItemTimer.paused !== true).length > 0;
    }

    private getTodoItems(): NodeListOf<HTMLElement> {
        let addToTimerButtons: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>(".todo-item");
        return addToTimerButtons;
    }

    private getTimersList(): HTMLElement {
        return <HTMLInputElement>document.querySelector("#timers-list");
    }

    private extractNumber(todoId: string): number {
        let todoIdRegexArray = todoId.match(/\d+/g) || [];
        return Number(todoIdRegexArray[0]);
    }

}

new TimeTrackerController();