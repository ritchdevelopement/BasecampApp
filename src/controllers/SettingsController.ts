import SettingsStoreModel from "../models/stores/SettingsStoreModel";

const SETTINGS_URL = 0;
const SETTINGS_USERNAME = 1;
const SEtTINGS_PASSWORD = 2;

class SettingsController {

    private settingsStoreModel: SettingsStoreModel;

    constructor() {
        const { ipcRenderer } = require("electron");
        let encryptionKey: string = ipcRenderer.sendSync("encryption-key");
        this.settingsStoreModel = new SettingsStoreModel(encryptionKey);
        this.mapSettingsToInputs(this.getSettingsInputs(), this.getStoreSettings());
        this.onSettingsFormSubmitSave(this.getSettingsInputs());
    }

    /**
     * Check if settings are the same as in the settings store
     * @param settingsInputs settings form input elements
     * @param settings settings stored in the settings store
     */
    private isSettingsNew(settingsInputs: HTMLInputElement[], settings: string[]): boolean {
        if (
            (settingsInputs[SETTINGS_URL].value !== settings[SETTINGS_URL]) ||
            (settingsInputs[SETTINGS_USERNAME].value !== settings[SETTINGS_USERNAME]) ||
            (settingsInputs[SEtTINGS_PASSWORD].value !== settings[SEtTINGS_PASSWORD])) {
            return true
        }
        return false
    }

    /**
     * Refresh the account details
     */
    private accountRefresh(): void {
        const { ipcRenderer } = require("electron");
        let accountNameElement: HTMLElement = <HTMLElement>document.querySelector("#account-name");
        let accountData: any = ipcRenderer.sendSync("account-data");
        if (typeof accountData === "object") {
            accountNameElement.innerHTML = accountData[0] + " " + accountData[1];
        } else {
            accountNameElement.innerHTML = accountData;
        }
    }

    /**
     * Get settings form input elements on form submit
     * @param settingsInputs settings form input elements
     */
    private onSettingsFormSubmitSave(settingsInputs: HTMLInputElement[]): void {
        let settingsForm: HTMLElement = <HTMLElement>document.querySelector("#settings-form");
        settingsForm.addEventListener("submit", (event) => {
            event.preventDefault();
            if (this.isSettingsNew(this.getSettingsInputs(), this.getStoreSettings())) {
                this.saveSettings(settingsInputs);
                this.accountRefresh();
            }
        });
    }

    private saveSettings(settingsInputs: HTMLInputElement[]): void {
        const { ipcRenderer } = require("electron");
        this.settingsStoreModel.setBasecampUrl(settingsInputs[SETTINGS_URL].value);
        this.settingsStoreModel.setUsername(settingsInputs[SETTINGS_USERNAME].value);
        this.settingsStoreModel.setPassword(settingsInputs[SEtTINGS_PASSWORD].value);
        this.settingsStoreModel.setAccountId(ipcRenderer.sendSync("account-data")[2]);
    }

    /**
     * Map the values in settings store to the form input elements
     * @param settingsInputs settings form input elements
     * @param settings settings stored in the settings store
     */
    private mapSettingsToInputs(settingsInputs: HTMLInputElement[], settings: string[]): void {
        settingsInputs[SETTINGS_URL].value = settings[SETTINGS_URL] || "";
        settingsInputs[SETTINGS_USERNAME].value = settings[SETTINGS_USERNAME] || "";
        settingsInputs[SEtTINGS_PASSWORD].value = settings[SEtTINGS_PASSWORD] || "";
    }

    /**
     * Get settings form input elements
     */
    private getSettingsInputs(): HTMLInputElement[] {
        let basecampUrlElement: HTMLInputElement = <HTMLInputElement>document.querySelector("#settings-basecamp-url");
        let usernameElement: HTMLInputElement = <HTMLInputElement>document.querySelector("#settings-username");
        let passwordElement: HTMLInputElement = <HTMLInputElement>document.querySelector("#settings-password");
        return [
            basecampUrlElement,
            usernameElement,
            passwordElement
        ]
    }

    /**
     * Get settings stored in the settings store
     */
    private getStoreSettings(): string[] {
        return [
            this.settingsStoreModel.getBasecampUrl(),
            this.settingsStoreModel.getUsername(),
            this.settingsStoreModel.getPassword()
        ]
    }
}

new SettingsController(); 