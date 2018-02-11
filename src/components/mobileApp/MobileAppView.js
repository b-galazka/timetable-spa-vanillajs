import { ComponentView } from '../../lib/ComponentView';

import { LoadingAnimation } from '../';

import './mobileApp.scss';

export class MobileAppView extends ComponentView {

    get template() {

        return `
            <main class="mobile-app">
                ${this._renderProperTemplate()}
            </main>
        `;
    }

    get eventsHandlers() {

        const { visitPage } = this._props;

        return [
            {
                selector: '#visit-page-button',
                event: 'click',
                handler: visitPage
            }
        ];
    }

    _renderProperTemplate() {

        const { 
            mobileAppDataFetched,
            mobileAppDataFetching,
            mobileAppDataFetchingError
        } = this._props;

        if (mobileAppDataFetched) {

            return this._renderContent();
        }

        if (mobileAppDataFetching) {

            return this._renderLoadingAnimation();
        }

        if (mobileAppDataFetchingError) {

            return this._renderFetchingError();
        }
    }

    _renderContent() {

        const { mobileAppData, strings } = this._props;

        return `
            <div class="mobile-app__wrapper">
                <a
                    class="mobile-app__button"
                    href=${mobileAppData.apkFileUrl}
                    target="_blank"
                >${strings.downloadApp}</a>

                <button
                    class="mobile-app__button"
                    id="visit-page-button"
                >${strings.visitPage}</button>
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

        const { strings } = this._props;

        return `<p class="mobile-app__fetching-error">${strings.fetchingError}</p>`
    }
}