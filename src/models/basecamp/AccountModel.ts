import { parseStringPromise } from "xml2js";
import fetch from "electron-fetch";
import SettingsStoreModel from "../stores/SettingsStoreModel";

class AccountModel {
    private settingsStoreModel: SettingsStoreModel;
    private endpointXml: string = "me.xml";

    constructor(encryptionKey: any) {
        this.settingsStoreModel = new SettingsStoreModel(encryptionKey);
    }

    /**
     * Initialize basecamp account data
     */
    public init() {
        return fetch(this.settingsStoreModel.getBasecampUrl() + this.endpointXml, this.getHeaders())
            .then(res => res.text())
            .then(data => {
                return parseStringPromise(data)
                    .then(parsedString => {
                        return [
                            parsedString["person"]["first-name"][0],
                            parsedString["person"]["last-name"][0],
                            parsedString["person"]["id"][0]["_"]
                        ];
                    });
            })
            .catch(error => {
                console.warn(error);
                return "<div class='uk-text-danger'>Not Connected!</div>";
            })
    }

    /**
     * Get headers as object
     */
    private getHeaders(): object {
        let username: string = this.settingsStoreModel.getUsername();
        let password: string = this.settingsStoreModel.getPassword();
        const headers: object = {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(username + ":" + password).toString("base64"),
                'Content-Type': 'text/xml'
            }
        };
        return headers;
    }
}

export default AccountModel;