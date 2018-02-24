import { Component } from '../../lib/Component';
import { getCssClasses } from '../../lib/getCssClasses';

import { LessonHour } from '../';
import { timetableObjectModel, hoursListModel } from '../../models';

import strings from './strings';
import './table.scss';

export class Table extends Component {

    constructor() {

        super();

        this._rowsNumber = timetableObjectModel.getMaxNumberOfLessonsInDay();
    }

    get template() {

        return `
            <div class="table">
                ${this._renderOrdinalNumbersColumn()}
                ${this._renderHoursColumn()}
                ${this._renderDays()}
            </div>
        `;
    }

    _renderOrdinalNumbersColumn() {

        let output = `
            <header 
                class="table__header table__header--ordinal-numbers"
            >${strings.number}</header>
        `;

        for (let i = 1; i <= this._rowsNumber; i++) {

            const order = i + 1;

            output += `
                <div
                    data-number="${i}"
                    class="table__cell table__cell--ordinal-number"
                    style="order: ${order}; -ms-flex-order: ${order};"
                >${i}</div>
            `;
        }

        return output;
    }

    _renderHoursColumn() {

        let output = `
            <header 
                class="table__header table__header--hours"
            >${strings.hour}</header>
        `;

        for (let i = 0; i < this._rowsNumber; i++) {

            const { start, end } = hoursListModel.fetchedData[i];
            const order = i + 2;

            output += `
                <div
                    data-number="${i + 1}"
                    class="table__cell table__cell--hour"
                    style="order: ${order}; -ms-flex-order: ${order};"
                >${start} - ${end}</div>
            `;
        }

        return output;
    }

    _renderDays() {

        const { timetable } = timetableObjectModel.fetchedData;

        const output = timetable.reduce((output, day, index) => (
            output + this._renderDay(day, index)
        ), '');

        return output;
    }

    _renderDay(day, dayNumber) {

        const dayName = strings.days[dayNumber];
        const { type } = timetableObjectModel.fetchedData;

        const cssClasses = getCssClasses({
            'table__header': true,
            'table__header--mobile-hidden': (day.length === 0)
        });

        let output = `<header class="${cssClasses}">${dayName}</header>`;
        let numberOfRenderedCells = 0;

        day.forEach((lessonHour, index) => {

            const lessonHourComponent = new LessonHour({
                lessons: lessonHour,
                timetableType: type,
                order: index + 2,
                number: index + 1
            });

            output += lessonHourComponent.render();

            numberOfRenderedCells++;
        });

        return (output + this._renderEmptyCells(numberOfRenderedCells));
    }

    _renderEmptyCells(numberOfRenderedCells) {

        let output = '';

        for (let i = numberOfRenderedCells; i < this._rowsNumber; i++) {

            const lessonHourComponent = new LessonHour({
                order: i + 2,
                number: i + 1,
                mobileHidden: true
            });

            output += lessonHourComponent.render();
        }

        return output;
    }
}