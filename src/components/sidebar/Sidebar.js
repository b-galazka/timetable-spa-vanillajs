import { Component } from '../../lib/Component';
import { getCssClasses } from '../../lib/getCssClasses';

import { userInterfaceModel } from '../../models';

import { 
    teachersListModel,
    classesListModel,
    classroomsListModel
} from '../../models';

import strings from './strings';
import urlsTranslations from '../../shared/json/urlsTranslations';

import './sidebar.scss';

export class Sidebar extends Component {

    constructor({ urlParams }) {

        super();

        this._urlParams = urlParams;

        this._selectTimetableObjectsList();
    }

    _selectTimetableObjectsList() {

        if (this._urlParams && !userInterfaceModel.timetableObjectsListSelected) {

            const { timetableType } = this._urlParams;

            userInterfaceModel.setData({
                activeTimetableObjectsList: urlsTranslations[timetableType],
                timetableObjectsListSelected: true
            });
        }
    }

    get template() {

        return `
            <section class="sidebar">
                <div class="sidebar__wrapper">
                    <div class="sidebar__buttons">
                        ${this._renderButtons()}
                    </div>
                    ${this._renderTimtableObjectsList()}
                </div>
            </section>
        `;
    }

    _renderButtons() {

        const { timetableObjectsListsTypes } = strings;

        const output = timetableObjectsListsTypes.reduce((output, listType) => {

            const cssClasses = getCssClasses({
                'sidebar__button': true,
                'sidebar__button--active': (
                    listType === userInterfaceModel.activeTimetableObjectsList
                )
            });

            const buttonTemplate = `
                <button
                    type="button"
                    class="${cssClasses}"
                    data-list="${listType}"
                >${Component.espaceHtml(strings[listType])}</button>
            `;

            return (output + buttonTemplate);
        }, '');

        return output;
    }

    _renderTimtableObjectsList() {

        const { activeTimetableObjectsList } = userInterfaceModel;
        const data = this._getTimetableObjectsListData(activeTimetableObjectsList);
        const urlSlug = decodeURIComponent(this._urlParams.slug);
        const urlTimtableType = urlsTranslations[this._urlParams.timetableType];

        let output = '<ul class="sidebar__list">';

        data.forEach(({ name, slug, number }) => {

            let url = `/${urlsTranslations[activeTimetableObjectsList]}`;
                url += `/${encodeURIComponent(slug || number)}`;

            const cssClass = (
                ((urlSlug === slug || urlSlug === number) &&
                urlTimtableType === activeTimetableObjectsList) ?
                    'class="active"' :
                    ''
            );

            output += `
                <li
                    ${cssClass}
                ><a routerLink="${url}">${Component.espaceHtml(name || slug || number)}</a></li>
            `;
        });

        output += '</ul>';

        return output;
    }

    _getTimetableObjectsListData(type) {

        switch (type) {

            case 'teachers':
                return teachersListModel.fetchedData;

            case 'classes':
                return classesListModel.fetchedData;

            case 'classrooms':
                return classroomsListModel.fetchedData;
        }
    }

    get eventsHandlers() {

        return [
            {
                event: 'click',
                selector: '.sidebar__button',
                handler: this._toggleTimetableObjectsList.bind(this)
            }
        ];
    }

    _toggleTimetableObjectsList({ target }) {

        const listType = target.getAttribute('data-list');

        userInterfaceModel.setData({
            activeTimetableObjectsList: listType
        });
    }
}