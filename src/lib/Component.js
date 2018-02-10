export class Component {

    render() {

        return this._view.template;
    }

    initEventsHandlers(root = this._root) {

        const { eventsHandlers } = this._view;

        eventsHandlers.forEach((eventHandler) => {

            const { event, selector, handler } = eventHandler;

            root.addEventListener(event, (eventObj) => {

                if (eventObj.target.matches(selector)) {

                    handler(eventObj);
                }
            });
        });
    }
}