import { Component } from '../../lib/Component';
import { getCssClasses } from '../../lib/getCssClasses';

import {
    timetableObjectModel,
    teachersListModel,
    userInterfaceModel
} from '../../models';

import { LoadingAnimation, Table } from '../';

import sharedStrings from '../../shared/json/strings';
import strings from './strings';
import urlsTranslations from '../../shared/json/urlsTranslations';

import './timetable.scss';
import '../../shared/scss/animations.scss';

export class Timetable extends Component {

    constructor({ urlParams }) {

        super();

        this._urlParams = urlParams;
    }

    get template() {

        const cssClasses = getCssClasses({
            timetable: true,
            'timetable--with-content': !timetableObjectModel.notFound,
            'timetable--without-content': timetableObjectModel.notFound
        });

        return `
            <section class="${cssClasses}">
                ${this._renderProperTemplate()}
            </section>
        `;
    }

    get eventsHandlers() {

        const removeAnimationClass = this._removeAnimationClass.bind(this);

        return [

            {
                event: 'animationend',
                selector: '.timetable__wrapper',
                handler: removeAnimationClass
            },

            {
                event: 'webkitAnimationEnd',
                selector: '.timetable__wrapper',
                handler: removeAnimationClass
            }
        ]
    }

    _renderProperTemplate() {

        if (timetableObjectModel.notFound) {

            return this._renderError();
        }

        return (this._renderHeader() + this._renderContent());
    }

    _renderError() {

        const { baseTitle, notFoundTitle, pageNotFound } = sharedStrings;

        Timetable.renderTitle(baseTitle + notFoundTitle);

        return `<p class="timetable__error">${pageNotFound}</p>`;
    }

    _renderHeader() {

        const { timetableType, slug } = this._urlParams;
        const decodedSlug = decodeURIComponent(slug);

        let title;

        if (urlsTranslations[timetableType] === 'teachers') {

            const teachers = teachersListModel.fetchedData;
            const teacher = teachers.find(teacher => teacher.slug === decodedSlug);

            title = teacher.name || teacher.slug;

        } else {

            title = decodedSlug;
        }

        Component.renderTitle(sharedStrings.baseTitle + title);

        return `
            <header class="timetable__header">
                <h1 class="timetable__title">${title}</h1>
            </header>
        `;
    }

    _renderContent() {

        const wrapperCssClasses = getCssClasses({
            'timetable__wrapper': true,
            'timetable__wrapper--data-not-fetched': !timetableObjectModel.fetched,
            'timetable__wrapper--data-fetched': timetableObjectModel.fetched,
            'animated': userInterfaceModel.timetableContentAnimation
        });

        let output = `<div class="${wrapperCssClasses}">`;

        if (timetableObjectModel.fetched) {

            output += this._renderTimetableContent();

        } else if (timetableObjectModel.fetchingError) {

            output += this._renderFetchingError();

        } else {

            output += this._renderLoader();
        }

        output += '</div>';

        return output;
    }

    _renderTimetableContent() {

        const updateTime = timetableObjectModel.fetchedData.update;

        return `
            <section class="timetable__content">
                ${new Table().render()}
            </section>
            <footer class="timetable__footer">
                <p>${strings.lastUpdate}: ${this._formatDate(updateTime)}</p>
            </footer>
        `;
    }

    _renderLoader() {

        return `
            <figure class="timetable__loader">
                ${new LoadingAnimation().render()}
            </figure>
        `;
    }

    _renderFetchingError() {

        return `
            <p 
                class="timetable__error"
            >${sharedStrings.fetchingError}</p>
        `;
    }

    _formatDate(updateTime) {

        const date = new Date(updateTime);

        return (
            this._formatTimeUnit(date.getDate()) +
            `/${this._formatTimeUnit(date.getMonth() + 1)}/${date.getFullYear()}` +
            ` ${date.getHours()}:${this._formatTimeUnit(date.getMinutes())}`
        );
    }

    _formatTimeUnit(timeUnit) {

        return `${(timeUnit < 10) ? '0' : ''}${timeUnit}`;
    }

    _removeAnimationClass() {

        userInterfaceModel.setData({
            timetableContentAnimation: false
        });
    }
}