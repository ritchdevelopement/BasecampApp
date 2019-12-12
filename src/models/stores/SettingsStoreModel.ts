import StoreModel from "./StoreModel";

class SettingsStoreModel extends StoreModel {

    constructor(encryptionKey: string) {
        super({ name: "settings", encryptionKey: encryptionKey });
    }
    /**
     * Get username from settings store
     */
    public getUsername(): string {
        return this.get("account.username");
    }

    /**
     * Get password from settings store
     */
    public getPassword(): string {
        return this.get("account.password");
    }

    /**
     * Get basecamp url from settings store
     */
    public getBasecampUrl(): string {
        return this.get("account.basecampUrl");
    }

    /**
     * Get account id from settings store
     */
    public getAccountId(): void {
        this.get("account.id");
    }

    /**
     * Set password in settings store
     */
    public setPassword(password: string): void {
        this.set("account.password", password);
    }

    /**
     * Set username in settings store
     */
    public setUsername(username: string): void {
        this.set("account.username", username);
    }

    /**
     * Set basecamp url in settings store
     */
    public setBasecampUrl(basecampUrl: string): void {
        this.set("account.basecampUrl", basecampUrl);
    }

    /**
     * Set account id in settings store
     */
    public setAccountId(accountId: number): void {
        this.set("account.id", accountId);
    }
}

export default SettingsStoreModel;