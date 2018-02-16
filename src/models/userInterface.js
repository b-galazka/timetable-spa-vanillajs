import { Model } from '../lib/Model';

class UserInterfaceModel extends Model {

    constructor() {

        super();

        this.shouldDisplayMobileApp = UserInterfaceModel.detectAndroidDevice();
        this.appContentAnimation = true;
    }

    static detectAndroidDevice() {

        const userAgent = navigator.userAgent.toLowerCase();

        return userAgent.includes('android');
    }
}

export const userInterfaceModel = new UserInterfaceModel();