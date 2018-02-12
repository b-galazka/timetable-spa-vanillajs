export class Component {

    static renderTitle(title) {

        if (document.title !== title) {

            document.title = title;
        }
    }

    render() {

        if (typeof this.title === 'string') {

            Component.renderTitle(this.title);
        }

        return (this._view ? this._view.template : this.template);
    }

    initEventsHandlers(root = this._root) {

        const { eventsHandlers } = this._view || this;

        if (!Array.isArray(eventsHandlers)) {

            return;
        }

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