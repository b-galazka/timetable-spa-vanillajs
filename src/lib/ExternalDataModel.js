import { Notifier } from './Notifier';

export class ExternalDataModel {

    constructor() {

        this.fetchedData = null;
        this.fetching = false;
        this.fetched = false;
        this.fetchingError = false;

        this.dataChangeNotifier = new Notifier();
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