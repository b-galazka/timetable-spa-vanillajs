import { Component } from '../../lib/Component';

import * as initialDataModels from '../../models/timetableObjectsLists';
import { timetableObjectModel } from '../../models';
import { LoadingAnimation } from '../';

import sharedStrings from '../../shared/json/strings';

export class AppContent extends Component {

    constructor() {

        super();

        this.initialDataModels = Object.values(initialDataModels);
    }

    get template() {

        return `
            <main class="app">
                ${this._renderProperTemplate()}
            </main>
        `;
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

        return `
            <section class="app__content">
                <p>${timetableObjectModel.slug}</p>
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
}