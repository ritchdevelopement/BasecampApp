import Store from "electron-store";

class StoreModel extends Store {

    constructor(options: Store.Options<any> | undefined) {
        super(options);
    }
}

export default StoreModel;