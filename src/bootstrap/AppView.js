import { ComponentView } from '../lib/ComponentView';
import { Router } from '../lib/Router';

export class AppView extends ComponentView {

    get template() {

        const { defaultRedirection, fetchData } = this._props;

        return new Router({

            routes: [

                {
                    path: '/',
                    redirect: defaultRedirection,
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

        const { timetableTypes } = this._props;

        if (timetableTypes.includes(timetableType)) {

            return `
                <p>${slug}</p>
            `;
        }

        return '404';
    }
}