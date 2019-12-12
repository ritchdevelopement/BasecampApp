const COMPANY_ARRAY_INDEX = 0;
const COMPANY_ID = 0;

const COMPANIES_SEARCH_INPUT = 0;
const PROJECTS_SEARCH_INPUT = 0;
const TODO_LISTS_SEARCH_INPUT = 1;
const TODO_ITEMS_SEARCH_INPUT = 2;

class TaskListController {
    private loadingScreenHelper: any = require("../helpers/LoadingScreenHelper");
    private projectsData: any[];
    private todoListsData: any[];
    private listData: any[] = [];

    constructor() {
        this.loadingScreenHelper.startLoadingScreen();
        this.todoListsData = this.getTodoListsData();
        this.projectsData = this.getProjectsData();
        if (this.todoListsData) {
            this.setListDataArray();
            this.listData.sort(this.sortListData);
            this.addListEntriesToTable();
            this.onKeyUpSearch(this.getSearchInputs());
        }
        this.loadingScreenHelper.stopLoadingScreen();
    }

    private addListEntriesToTable(): void {
        let todoListsContainer: HTMLInputElement = <HTMLInputElement>document.querySelector("#todo-lists-container");
        this.listData.forEach(todoListData => {
            todoListsContainer.insertAdjacentHTML("beforeend", this.getListEntryHtml(todoListData));
        })
    }

    private getListEntryHtml(todoListData: any): string {
        let [[companyId, companyName], [projectId, projectName], [todoListId, todoListName, todoItems]] = todoListData;

        return `
        <tr>
            <td>
                <div id="project-id-${projectId}" class="project">${projectName}</div>
                <div id="company-id-${companyId}" class="company">${companyName}</div>
            </td>
            <td id="todo-list-id-${todoListId}" class="todo-list">${todoListName}</td>
            <td>
                <div class="todo-items-container">
                    ${todoItems.map((todoItem: any) => { return this.getTodoItemHtml(todoItem) }).join('')}
                </div>
            </td> 
        </tr>
        `;
    }

    private getTodoItemHtml(todoItem: any): string {
        let todoItemId: number = todoItem["id"][0]["_"];
        let todoItemName: string = todoItem["content"][0];
        return `<div id="todo-item-id-${todoItemId}" class="todo-item"><span>${todoItemName}</span>${this.getTodoItemActionsHtml(todoItem)}</div>`;
    }

    private getTodoItemActionsHtml(todoItem: any): string {
        return `<a class="uk-icon-button add-to-timer-button" uk-icon="clock"></a>`;
    }

    private setListDataArray(): void {
        this.todoListsData.forEach(todoListData => {
            this.projectsData.forEach(project => {
                if (todoListData["project-id"]["0"]["_"] === project["id"]["0"]["_"]) {
                    let companyId: number = Number(project["company"][0]["id"][0]["_"]);
                    let companyName: string = project["company"][0]["name"][0];
                    let projectId: number = Number(project["id"][0]["_"]);
                    let projectName: string = project["name"][0];
                    let todoListId: number = Number(todoListData["id"][0]["_"]);
                    let todoListName: string = todoListData["name"][0];
                    let todoListItems: any[] = todoListData["todo-items"][0]["todo-item"];
                    this.listData.push(
                        [
                            [companyId, companyName],
                            [projectId, projectName],
                            [todoListId, todoListName, todoListItems]
                        ]
                    );
                }
            });
        });
    }

    private onKeyUpSearch(inputs: HTMLInputElement[]): void {
        let listDataRows: NodeListOf<HTMLTableElement> = document.querySelectorAll<HTMLTableElement>("#todo-lists-container > tr");
        inputs.forEach(input => {
            input.addEventListener("keyup", () => {
                listDataRows.forEach(listDataRow => {
                    let company: HTMLElement = <HTMLElement>listDataRow.querySelector(".company");
                    let project: HTMLElement = <HTMLElement>listDataRow.querySelector(".project");
                    let todoList: HTMLElement = <HTMLElement>listDataRow.querySelector(".todo-list");
                    let todoItem: HTMLElement = <HTMLElement>listDataRow.querySelector(".todo-item");
                    let companyText: string = company.textContent || "";
                    let projectText: string = project.textContent || "";
                    let todoListText: string = todoList.textContent || "";
                    let todoItemText: string = todoItem.textContent || "";

                    if (
                        (this.textToLowerCase(projectText).includes(this.textToLowerCase(this.getSearchInputs()[PROJECTS_SEARCH_INPUT].value)) ||
                            this.textToLowerCase(companyText).includes(this.textToLowerCase(this.getSearchInputs()[COMPANIES_SEARCH_INPUT].value))) &&
                        this.textToLowerCase(todoListText).includes(this.textToLowerCase(this.getSearchInputs()[TODO_LISTS_SEARCH_INPUT].value)) &&
                        this.textToLowerCase(todoItemText).includes(this.textToLowerCase(this.getSearchInputs()[TODO_ITEMS_SEARCH_INPUT].value))
                    ) {
                        listDataRow.classList.remove("uk-hidden");
                    } else {
                        listDataRow.classList.add("uk-hidden");
                    };
                });
            });
        })
    }

    private textToLowerCase(text: string): string {
        return text.toLowerCase();
    }

    private getSearchInputs(): HTMLInputElement[] {
        let projectsSearchInput: HTMLInputElement = <HTMLInputElement>document.querySelector("#search-project");
        let todoListsSearchInput: HTMLInputElement = <HTMLInputElement>document.querySelector("#search-todo-list");
        let todoItemsSearchInput: HTMLInputElement = <HTMLInputElement>document.querySelector("#search-todo-item");
        return [
            projectsSearchInput,
            todoListsSearchInput,
            todoItemsSearchInput
        ]
    }


    private getProjectsData(): any[] {
        const { ipcRenderer } = require("electron");
        return ipcRenderer.sendSync("projects-data");
    }

    private getTodoListsData(): any[] {
        const { ipcRenderer } = require("electron");
        return ipcRenderer.sendSync("todo-lists-data");
    }

    public sortListData(a: any[], b: any[]) {
        if (a[COMPANY_ARRAY_INDEX][COMPANY_ID] === b[COMPANY_ARRAY_INDEX][COMPANY_ID]) {
            return 0;
        }
        else {
            return (a[COMPANY_ARRAY_INDEX][COMPANY_ID] < b[COMPANY_ARRAY_INDEX][COMPANY_ID]) ? -1 : 1;
        }
    }

}
new TaskListController();