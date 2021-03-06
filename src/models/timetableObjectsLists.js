import { timetableApiRequest } from '../lib/Request';
import { ExternalDataModel } from '../lib/ExternalDataModel';

class TimetableObjectsListModel extends ExternalDataModel {

    constructor(listType) {

        super();

        this.fetchedData = [];
        this._listType = listType;
    }

    doesSlugExist(slug) {

        return this.fetchedData.some(timetableObject => (
            timetableObject.slug === slug || timetableObject.number === slug
        ));
    }

    fetchData() {

        return (async () => {

            this._fetchingStarted();

            try {

                const { data } = await timetableApiRequest.get(`/${this._listType}`);

                this._fetchingSucceeded(data);

                return true;
            } catch (error) {

                this._fetchingFailed();

                return false;
            }
        })();
    }
}

export const teachersListModel = new TimetableObjectsListModel('teachers');
export const classesListModel = new TimetableObjectsListModel('classes');
export const classroomsListModel = new TimetableObjectsListModel('classrooms');
export const hoursListModel = new TimetableObjectsListModel('hours');