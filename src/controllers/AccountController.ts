class AccountController {

    constructor() {
        this.setAccountName();
    }

    private setAccountName(): void {
        let accountNameElement: HTMLElement = <HTMLElement>document.querySelector("#account-name");
        const { ipcRenderer } = require("electron");
        let accountData: any = ipcRenderer.sendSync("account-data");
        if (typeof accountData === "object") {
            accountNameElement.innerHTML = accountData[0] + " " + accountData[1];
        } else {
            accountNameElement.innerHTML = accountData;
        }
    }
}

new AccountController();