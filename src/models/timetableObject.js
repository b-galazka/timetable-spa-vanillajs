import { timetableApiRequest } from '../lib/Request';
import { ExternalDataModel } from '../lib/ExternalDataModel';

import {
    teachersListModel,
    classesListModel,
    classroomsListModel
} from './timetableObjectsLists';

class TimetableObjectModel extends ExternalDataModel {

    constructor() {

        super();

        this.fetchedAsInitialData = false;
        this.notFound = false;
        this.timetableObjectType = null;
        this.slug = null;
    }

    fetchData(timetableObjectType, slug) {

        const { _doesSlugExist, _pluralizeTimetableObjectType } = TimetableObjectModel;

        return (async () => {

            const decodedSlug = decodeURIComponent(slug);

            if (!_doesSlugExist(timetableObjectType, decodedSlug)) {

                return this._notFound();
            }

            this.timetableObjectType = timetableObjectType;
            this.slug = decodedSlug;
            this._fetchingStarted();

            try {

                const { data } = await timetableApiRequest.get(
                    `/${_pluralizeTimetableObjectType(timetableObjectType)}/${slug}`
                );

                this._fetchingSucceeded(data);

                return true;
            } catch (error) {

                this._fetchingFailed();

                return false;
            }
        })();
    }

    static _pluralizeTimetableObjectType(type) {

        return `${type}${(type === 'class') ? 'es' : 's'}`;
    }

    static _doesSlugExist(timetableObjectType, slug) {

        switch (timetableObjectType) {

            case 'teacher':
                return teachersListModel.doesSlugExist(slug);

            case 'class':
                return classesListModel.doesSlugExist(slug);

            case 'classroom':
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