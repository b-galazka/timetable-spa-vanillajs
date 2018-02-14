import { Notifier } from './Notifier';

export class Model {

    constructor() {

        this.dataChangeNotifier = new Notifier();
    }

    setData(data) {

        Object.keys(data).forEach((key) => {

            this[key] = data[key];
        });

        this.dataChangeNotifier.notifyAllListeners();
    }
}