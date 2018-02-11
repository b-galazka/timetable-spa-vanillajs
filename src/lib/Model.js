import { Notifier } from './Notifier';

export class Model {

    constructor() {

        this.dataChangeNotifier = new Notifier();
    }
}