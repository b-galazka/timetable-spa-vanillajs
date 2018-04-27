import { Component } from '../../lib/Component';

import strings from './strings';
import sharedStrings from '../../shared/json/strings';

import './notFound.scss';

export class NotFound extends Component {

    constructor() {

        super();

        const { baseTitle, notFoundTitle } = sharedStrings;

        this.title = baseTitle + notFoundTitle;
    }

    get template() {

        return `
            <main class="not-found-page">
                <div class="not-found-page__wrapper">
                    <p 
                        class="not-found-page__message"
                    >${Component.espaceHtml(sharedStrings.pageNotFound)}</p>

                    <a
                        routerLink="/"
                        class="button not-found-page__button"
                    >${Component.espaceHtml(strings.homepageButtonText)}</a>
                </div>
            </main>
        `;
    }
}