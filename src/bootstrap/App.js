import { Router } from '../lib/Router';
import { Component } from '../lib/Component';
import { Renderer } from '../lib/Renderer';

import { AppView } from './AppView';
import * as models  from '../models';
import * as initialDataModels from '../models/timetableObjectsLists';
import * as components from '../components';

import config from '../config';
import urlsTranslations from './urlsTranslations';

export class App extends Component {

    constructor(root) {

        super();

        const { timetableTypes, defaultRedirection } = config;
        const { timetableObjectModel, mobileAppModel, userInterfaceModel } = models;

        this._root = root;
        this._renderer = new Renderer(this._root);

        this._view = new AppView({
            timetableTypes,
            defaultRedirection,
            fetchData: App._fetchTimetableData.bind(this),
            userInterfaceModel
        });
    }

    init() {

        this._renderer.renderView(this.render());
        this._initViewUpdates();
        this.initEventsHandlers();
        this._initChildsComponentsEventsHandlers();

        Router.init(this._root);

        const { userInterfaceModel, mobileAppModel } = models;

        if (userInterfaceModel.isAndroidDevice) {

            mobileAppModel.fetchData();
        }
    }

    updateView() {

        this._renderer.updateView(this.render());
    }

    _initViewUpdates() {

        const updateView = this.updateView.bind(this);

        Router.locationChangeNotifier.addListener(updateView);

        Object.values(models).forEach(model => (
            model.dataChangeNotifier.addListener(updateView)
        ));
    }

    _initChildsComponentsEventsHandlers() {

        Object
            .values(components)
            .forEach(Component => new Component().initEventsHandlers(this._root));
    }

    static _fetchTimetableData({ timetableType, slug }) {

        const { timetableObjectModel } = models;

        (async () => {
            
            if (!App._isInitialDataFetched() && !(await App._fetchInitialData())) {

                return;
            }

            timetableObjectModel.fetchData(urlsTranslations[timetableType], slug);
        })();
    }

    static _isInitialDataFetched() {

        return Object.values(initialDataModels).every(model => model.fetched);
    }

    static _fetchInitialData(models) {

        return (async () => {

            const promises = Object
                .values(initialDataModels)
                .map(model => model.fetchData());

            const responses = await Promise.all(promises);

            const isAllDataFetched = responses.every(response => response);

            return isAllDataFetched;
        })();    
    }
}