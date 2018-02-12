import { ComponentView } from '../lib/ComponentView';
import { Router } from '../lib/Router';

import { MobileApp } from '../components';
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
                render: () => '<a routerLink="/">home</a>'
            }

        }).renderProperElements();
    }

    _renderAppContent({ timetableType, slug }) {

        const { timetableTypes } = config;

        if (timetableTypes.includes(timetableType)) {

            return `
                <p>klasa ${slug}</p>
            `;
        }

        return '404';
    }
}