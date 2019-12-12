import { BrowserWindow, Menu, ipcMain, shell } from "electron";
import AccountModel from "../models/basecamp/AccountModel";
import TodoListsModel from "../models/basecamp/TodoListsModel";
import ProjectsModel from "../models/basecamp/ProjectsModel";
import keytar from "keytar";

const ENCRYPTION_KEY_SERVICE = "BasecampEncryptionKey";

class MainWindow {
    private static application: Electron.App;
    private static mainWindow: BrowserWindow;
    private static systemUsername: string;

    /**
     * Inital function
     * @param app
     */
    public static init(app: Electron.App) {
        MainWindow.application = app;
        MainWindow.application.on("window-all-closed", MainWindow.onWindowAllClosed);
        MainWindow.application.on("ready", MainWindow.onReady);
    }

    /**
     * Execute when all windows are closed
     */
    private static onWindowAllClosed() {
        MainWindow.application.quit();
    }

    /**
     * Execute when main window is ready
     */
    private static onReady() {
        MainWindow.mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true
            }
        });
        MainWindow.mainWindow.setIcon(__dirname + "/../assets/icons/basecamp-icon.png")
        MainWindow.mainWindow.maximize();
        MainWindow.mainWindow.loadFile(__dirname + "/../views/MainWindow.html");
        MainWindow.setMainMenu();
        MainWindow.systemUsername = require("os").userInfo().username;

        MainWindow.setEncryptionKey(MainWindow.generateRandomEncryptionKey());

        ipcMain.on("account-data", (event, arg) => {
            MainWindow.getEncryptionkey().then(key => {
                new AccountModel(key).init()
                    .then(data => {
                        if (data) {
                            event.returnValue = data
                        } else {
                            event.returnValue = false;
                        }
                    })
                    .catch(error => {
                        console.warn(error);
                    });
            })
        });
        ipcMain.on("todo-lists-data", (event, arg) => {
            MainWindow.getEncryptionkey().then(key => {
                new TodoListsModel(key).init()
                    .then(data => {
                        if (data) {
                            event.returnValue = data
                        } else {
                            event.returnValue = false;
                        }
                    })
                    .catch(error => {
                        console.warn(error);
                    });
            });
        });
        ipcMain.on("projects-data", (event, arg) => {
            MainWindow.getEncryptionkey().then(key => {
                new ProjectsModel(key).init()
                    .then(data => {
                        if (data) {
                            event.returnValue = data["projects"]["project"]
                        } else {
                            event.returnValue = false;
                        }
                    })
                    .catch(error => {
                        console.warn(error);
                    });
            });
        });

        ipcMain.on("encryption-key", (event, arg) => {
            MainWindow.getEncryptionkey().then(key => event.returnValue = key);
        });

    }

    /**
     * Set main menu for main window
     */
    private static setMainMenu(): void {
        Menu.setApplicationMenu(MainWindow.createMainMenu(MainWindow.getMainMenuTemplate()));
    }

    /**
     * Create main menu from template
     * @param menuTemplate Main menu template
     */
    private static createMainMenu(menuTemplate: object[]): Menu {
        return Menu.buildFromTemplate(menuTemplate);
    }

    /**
     * Get main menu template as oject array
     */
    private static getMainMenuTemplate(): object[] {
        return [
            {
                label: "File",
                submenu: [
                    { role: "quit" }
                ]
            },
            {
                label: "Help",
                submenu: [
                    { role: "toggledevtools" },
                    { role: "reload" },
                    { type: "separator" },
                    {
                        label: "Learn More",
                        click() {
                            shell.openExternal("https://github.com/ritchdevelopement");
                        }
                    }
                ]
            }
        ]
    }

    /**
     * Saves the encryption key in the systems keychain
     * @param encryptionKey random encryption key
     */
    private static setEncryptionKey(encryptionKey: string) {
        MainWindow.getEncryptionkey().then(key => {
            if (!key) {
                keytar.setPassword(ENCRYPTION_KEY_SERVICE, MainWindow.systemUsername, encryptionKey);
            }
        });
    }

    /**
     * Get the encryption key from the systems keychain
     */
    private static getEncryptionkey(): Promise<string | null> {
        return keytar.getPassword(ENCRYPTION_KEY_SERVICE, MainWindow.systemUsername).then(key => {
            return key;
        });
    }

    /**
     * Create a random encryption key string
     */
    private static generateRandomEncryptionKey(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

}

export default MainWindow;