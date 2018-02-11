import { Component } from '../../lib/Component';

import { MobileAppView } from './MobileAppView';
import { mobileAppModel } from '../../models';
import { userInterfaceModel } from '../../models';

import strings from './strings';

export class MobileApp extends Component {

    constructor() {

        super();

        this._view = new MobileAppView({
            mobileAppData: mobileAppModel.fetchedData,
            mobileAppDataFetched: mobileAppModel.fetched,
            mobileAppDataFetching: mobileAppModel.fetching,
            mobileAppDataFetchingError: mobileAppModel.fetchingError,
            strings,
            visitPage: this.visitPage.bind(this)
        });
    }

    visitPage() {

        userInterfaceModel.hideMobileApp();
    }
}