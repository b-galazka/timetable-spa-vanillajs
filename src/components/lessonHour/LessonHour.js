import { Component } from '../../lib/Component';
import { getCssClasses } from '../../lib/getCssClasses';

export class LessonHour extends Component {

    constructor({ lessons, timetableType, mobileHidden = false, order, number }) {

        super();

        this._lessons = lessons;
        this._timetableType = timetableType;
        this._mobileHidden = mobileHidden;
        this._order = order;
        this._number = number;

        this._lessonsExist = this._doLessonsExist();
    }

    get template() {

        const cssClasses = getCssClasses({
            'table__cell': true,
            'table__cell--empty': (!this._lessonsExist && !this._mobileHidden),
            'table__cell--mobile-hidden': this._mobileHidden
        });

        return `
            <div 
                class="${cssClasses}"
                data-number="${this._number}"
                style="order: ${this._order}; -ms-flex-order: ${this._order};"
            >${(this._lessonsExist) ? this._renderLessons() : ''}</div>
        `;
    }

    _renderLessons() {

        let output = '';

        this._lessons.forEach((lesson) => {

            const { subject } = lesson;

            output += `
                <div>
                    <span>${subject}</span>
                    ${this._renderSecondInfo(lesson)}
                    ${this._renderThirdInfo(lesson)}
                </div>
            `;
        });

        return output;
    }

    _renderSecondInfo(lesson) {

        const { teacherSlug, class: schoolClass, teacherName } = lesson;

        switch (this._timetableType) {

            case 'teacher':
                return `
                    <a
                        routerLink="/klasa/${encodeURIComponent(schoolClass)}"
                    >${schoolClass}</a>
                `;
                
            case 'class':
            case 'classroom':
                return `
                    <a
                        routerLink="/nauczyciel/${encodeURIComponent(teacherSlug)}"
                        title="${teacherName}"
                    >${teacherSlug}</a>
                `;
        }
    }

    _renderThirdInfo(lesson) {

        const { classroom, class: schoolClass } = lesson;

        switch (this._timetableType) {

            case 'classroom':
                return `
                    <a
                        routerLink="/klasa/${encodeURIComponent(schoolClass)}"
                    >${schoolClass}</a>
                `;

            case 'class':
            case 'teacher':
                return `
                    <a
                        routerLink="/sala/${encodeURIComponent(classroom)}"
                    >${classroom}</a>
                `;
        }
    }

    _doLessonsExist() {

        const lessons = this._lessons;

        return Boolean(Array.isArray(lessons) && lessons[0]);
    }
}