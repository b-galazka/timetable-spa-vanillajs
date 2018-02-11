import { Component } from '../../lib/Component';
import { MobileAppView } from './MobileAppView';

export class MobileApp extends Component {

    constructor() {

        super();

        this._view = new MobileAppView();
    }
}