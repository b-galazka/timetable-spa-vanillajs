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

        this.fetched = false;
        this.fetching = true;
        this.fetchingError = false;

        this.dataChangeNotifier.notifyAllListeners();
    }

    _fetchingSucceeded(data) {

        this.fetchedData = data;
        this.fetching = false;
        this.fetched = true;
        this.fetchingError = false;

        this.dataChangeNotifier.notifyAllListeners();

        return true;
    }

    _fetchingFailed() {

        this.fetching = false;
        this.fetched = false;
        this.fetchingError = true;

        this.dataChangeNotifier.notifyAllListeners();

        return false;
    }
}