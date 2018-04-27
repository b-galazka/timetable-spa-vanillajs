import { Component } from '../../lib/Component';

import { mobileAppModel } from '../../models';
import { userInterfaceModel } from '../../models';

import { LoadingAnimation } from '../';

import strings from './strings';
import sharedStrings from '../../shared/json/strings';

import './mobileApp.scss';

export class MobileApp extends Component {

    _visitPage() {

        userInterfaceModel.setData({
            shouldDisplayMobileApp: false
        });
    }

    get template() {

        return `
            <main class="mobile-app">
                ${this._renderProperTemplate()}
            </main>
        `;
    }

    get eventsHandlers() {

        return [
            {
                selector: '#visit-page-button',
                event: 'click',
                handler: this._visitPage.bind(this)
            }
        ];
    }

    _renderProperTemplate() {

        const {
            fetched,
            fetching,
            fetchingError
        } = mobileAppModel;

        if (fetched) {

            return this._renderContent();
        }

        if (fetching) {

            return this._renderLoadingAnimation();
        }

        if (fetchingError) {

            return this._renderFetchingError();
        }
    }

    _renderContent() {

        const { apkFileUrl } = mobileAppModel.fetchedData;

        return `
            <div class="mobile-app__wrapper">
                <a
                    class="button mobile-app__button"
                    href=${apkFileUrl}
                    target="_blank"
                >${Component.espaceHtml(strings.downloadApp)}</a>

                <button
                    class="button mobile-app__button"
                    id="visit-page-button"
                >${Component.espaceHtml(strings.visitPage)}</button>
            </div>
        `;
    }

    _renderLoadingAnimation() {

        return `
            <figure>
                ${new LoadingAnimation().render()}
            </figure>
        `;
    }

    _renderFetchingError() {

        return `
            <p
                class="mobile-app__fetching-error"
            >${Component.espaceHtml(sharedStrings.fetchingError)}</p>
        `;
    }
}