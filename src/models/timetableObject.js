import { timetableApiRequest } from '../lib/Request';
import { ExternalDataModel } from '../lib/ExternalDataModel';

import {
    teachersListModel,
    classesListModel,
    classroomsListModel,
    userInterfaceModel
} from './';

class TimetableObjectModel extends ExternalDataModel {

    constructor() {

        super();

        this.fetchedAsInitialData = false;
        this.notFound = false;
    }

    fetchData(timetableObjectType, slug) {

        const { _doesSlugExist } = TimetableObjectModel;

        return (async () => {

            const decodedSlug = decodeURIComponent(slug);

            if (!_doesSlugExist(timetableObjectType, decodedSlug)) {

                return this._notFound();
            }

            this._fetchingStarted();

            try {

                const { data } = await timetableApiRequest.get(
                    `/${timetableObjectType}/${slug}`
                );

                this._fetchingSucceeded(data);

                return true;
            } catch (error) {

                this._fetchingFailed();

                return false;
            }
        })();
    }

    static _doesSlugExist(timetableObjectType, slug) {

        switch (timetableObjectType) {

            case 'teachers':
                return teachersListModel.doesSlugExist(slug);

            case 'classes':
                return classesListModel.doesSlugExist(slug);

            case 'classrooms':
                return classroomsListModel.doesSlugExist(slug);

            default:
                return false;
        }
    }

    _fetchingStarted() {

        this.notFound = false;

        super._fetchingStarted();
    }

    _fetchingSucceeded(data) {

        if (this.fetchedAsInitialData) {

            userInterfaceModel.timetableContentAnimation = true;
        }

        this.notFound = false;
        this.fetchedAsInitialData = true;

        super._fetchingSucceeded(data);
    }

    _fetchingFailed() {

        this.notFound = false;

        super._fetchingFailed();
    }

    _notFound() {

        this.fetched = false;
        this.fetching = false;
        this.fetchingError = false;
        this.notFound = true;

        this.dataChangeNotifier.notifyAllListeners();
    }
}

export const timetableObjectModel = new TimetableObjectModel();