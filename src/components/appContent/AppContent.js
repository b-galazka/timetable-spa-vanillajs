import { Component } from '../../lib/Component';
import { getCssClasses } from '../../lib/getCssClasses';

import * as initialDataModels from '../../models/timetableObjectsLists';
import { timetableObjectModel, userInterfaceModel } from '../../models';
import { LoadingAnimation, Sidebar, Timetable } from '../';

import sharedStrings from '../../shared/json/strings';

import './appContent.scss';
import '../../shared/scss/animations.scss';

export class AppContent extends Component {

    constructor({ urlParams }) {

        super();

        this.urlParams = urlParams;
        this.initialDataModels = Object.values(initialDataModels);
    }

    get template() {

        return `
            <main class="app">
                ${this._renderProperTemplate()}
            </main>
        `;
    }

    get eventsHandlers() {

        const removeAnimationClass = this._removeAnimationClass.bind(this);

        return [

            {
                event: 'animationend',
                selector: '.app__content',
                handler: removeAnimationClass
            },

            {
                event: 'webkitAnimationEnd',
                selector: '.app__content',
                handler: removeAnimationClass
            }
        ]
    }

    _renderProperTemplate() {

        if (this._isInitialDataFetched()) {

            return this._renderContent();
        }

        if (this._isInitialDataFetchingError()) {

            return this._renderFetchingError();
        }

        return this._renderLoader();
    }

    _isInitialDataFetched() {

        const areListsFetched = this.initialDataModels.every(model => model.fetched);

        const timetableObjectFetched = (
            timetableObjectModel.fetchedAsInitialData ||
            timetableObjectModel.notFound
        );

        return (areListsFetched && timetableObjectFetched);
    }

    _isInitialDataFetchingError() {

        const isListsFetchingError = this.initialDataModels.some((
            model => model.fetchingError
        ));

        const isTimetableObjectFetchingEror = (
            timetableObjectModel.fetchingError &&
            !timetableObjectModel.fetchedAsInitialData
        );

        return (isListsFetchingError || isTimetableObjectFetchingEror);
    }

    _renderContent() {

        const cssClasses = getCssClasses({
            'app__content': true,
            'animated': userInterfaceModel.appContentAnimation
        });

        const { urlParams } = this;

        return `
            <section class="${cssClasses}">
                ${new Sidebar({ urlParams }).render()}
                ${new Timetable({ urlParams }).render()}
            </section>
        `;
    }

    _renderLoader() {

        return `
            <section class="app__loader">
                <figure>
                    ${
                        new LoadingAnimation({
                            width: '120px',
                            height: '120px'
                        }).render()
                    }
                </figure>    
            </section>
        `;
    }

    _renderFetchingError() {

        return `
            <section class="app__error">
                <p
                    class="app__error-message"
                >${sharedStrings.fetchingError}</p>
            </section>
        `;
    }

    _removeAnimationClass() {

        userInterfaceModel.setData({
            appContentAnimation: false
        });
    }
}