
class AlertHelper {

    /**
     * Add a danger alert which shows over the table
     */
    public static addDangerAlert(alertText: string): void {
        let listDataTable: HTMLTableElement = <HTMLTableElement>document.querySelector("#list-data-table");
        let alertHtml = `<div class="uk-alert-danger" uk-alert>
            <a class="uk-alert-close" uk-close></a>
            <p class="uk-flex uk-flex-middle"><span class="uk-margin-small-right" uk-icon="icon: warning"></span>${alertText}</p>
        </div>`
        listDataTable.insertAdjacentHTML('beforebegin', alertHtml);
    }
}

module.exports = AlertHelper;