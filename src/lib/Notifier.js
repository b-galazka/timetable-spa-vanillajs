export class Notifier {

    constructor() {

        this._listeners = [];
    }

    addListener(callback) {

        this._listeners.push(callback);

        return callback;
    }

    removeAllListeners() {

        this._listeners = [];
    }

    removeListener(listener) {

        this._listeners = this._listeners.filter(callback => callback !== listener);
    }

    notifyAllListeners(args = []) {

        this._listeners.forEach(listener => listener(...args));
    }
}