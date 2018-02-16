import { ComponentView } from '../lib/ComponentView';
import { Router } from '../lib/Router';

import { MobileApp } from '../components';
import { NotFound } from '../components';
import { AppContent } from '../components';
import { userInterfaceModel } from '../models';

import config from '../config';

export class AppView extends ComponentView {

    get template() {

        const { fetchData } = this._props;

        if (userInterfaceModel.shouldDisplayMobileApp) {

            return new MobileApp().render();
        }

        return new Router({

            routes: [

                {
                    path: '/',
                    redirect: config.defaultRedirection,
                    exact: true
                },

                {
                    path: '/:timetableType/:slug',
                    exact: true,
                    render: this._renderAppContent.bind(this),
                    onRouteActivation: fetchData
                }
            ],

            notFoundFallback: {
                component: NotFound
            }

        }).renderProperElements();
    }

    _renderAppContent(urlParams) {

        const { timetableTypes } = config;
        const { timetableType } = urlParams;

        if (timetableTypes.includes(timetableType)) {

            return new AppContent({ urlParams }).render();
        }

        return new NotFound().render();
    }
}