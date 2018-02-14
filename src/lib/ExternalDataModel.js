import { Model } from './Model';

export class ExternalDataModel extends Model {

    constructor() {

        super();

        this.fetchedData = null;
        this.fetching = false;
        this.fetched = false;
        this.fetchingError = false;
    }

    _fetchingStarted() {

        this.setData({
            fetched: false,
            fetching: true,
            fetchingError: false
        });
    }

    _fetchingSucceeded(data) {

        this.setData({
            fetchedData: data,
            fetched: true,
            fetching: false,
            fetchingError: false
        });
    }

    _fetchingFailed() {

        this.setData({
            fetched: false,
            fetching: false,
            fetchingError: true
        });
    }
}