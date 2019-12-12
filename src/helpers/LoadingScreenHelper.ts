const CLASS_HIDE = "uk-hidden";
const CLASS_LOADING = "loading";

class LoadingScreenHelper {

    /**
     * Show the loading screen and start the logo animation
     */
    public static startLoadingScreen(): void {
        let spinner: HTMLInputElement = <HTMLInputElement>document.querySelector("#loading-screen");
        let logo: HTMLInputElement = <HTMLInputElement>document.querySelector("#logo");
        spinner.classList.remove(CLASS_HIDE);
        logo.classList.add(CLASS_LOADING);
    }

    /**
     *  Hide the loading screen and stop the logo animation
     */
    public static stopLoadingScreen(): void {
        let spinner: HTMLInputElement = <HTMLInputElement>document.querySelector("#loading-screen");
        let logo: HTMLInputElement = <HTMLInputElement>document.querySelector("#logo");
        spinner.classList.add(CLASS_HIDE);
        logo.classList.remove(CLASS_LOADING);
    }
}

module.exports = LoadingScreenHelper;