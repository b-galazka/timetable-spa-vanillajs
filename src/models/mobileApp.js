import { timetableApiRequest } from '../lib/Request';
import { ExternalDataModel } from '../lib/ExternalDataModel';

class MobileAppModel extends ExternalDataModel {

    fetchData() {

        return (async () => {

            this._fetchingStarted();

            try {

                const { data } = await timetableApiRequest.get(`/mobile-app`);

                this._fetchingSucceeded({
                    apkFileUrl: data.apkFileUrl
                });
            } catch (error) {

                this._fetchingFailed();
            }
        })();
    }
}

export const mobileAppModel = new MobileAppModel();