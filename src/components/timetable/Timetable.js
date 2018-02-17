import { Component } from '../../lib/Component';
import { getCssClasses } from '../../lib/getCssClasses';

import { timetableObjectModel, teachersListModel } from '../../models';

import strings from '../../shared/json/strings';
import urlsTranslations from '../../shared/json/urlsTranslations';

import './timetable.scss';

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

    _renderProperTemplate() {

        if (timetableObjectModel.notFound) {

            return this._renderError();
        }

        return this._renderHeader();
    }

    _renderError() {

        const { baseTitle, notFoundTitle, pageNotFound } = strings;

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

        Timetable.renderTitle(strings.baseTitle + title);

        return `
            <header class="timetable__header">
                <h1 class="timetable__title">${title}</h1>
            </header>
        `;
    }
}