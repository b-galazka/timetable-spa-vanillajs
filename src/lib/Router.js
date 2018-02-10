import { Notifier } from './Notifier';

export class Router {

    constructor({ baseUrl = '', routes = [], notFoundFallback }) {

        this._baseUrl = baseUrl;
        this._routes = routes;
        this._notFoundFallback = notFoundFallback;
    }

    renderProperElements() {

        const output = this._routes.reduce(this._checkEachRoute.bind(this), '');

        if (output !== '') {

            return output;
        }

        return (
            this._notFoundFallback ? 
                this._processRoute(this._notFoundFallback) : 
                ''
        );
    }

    _checkEachRoute(output, route) {

        if (!route.path.includes(':')) {

            if (this._compareRoutePathAsString(route)) {

                output += this._processRoute(route);
            }

        } else {

            const urlParams = this._compareRoutePathAsArray(route);

            if (urlParams !== false) {

                output += this._processRoute(route, urlParams);
            }
        }

        return output;
    }

    _compareRoutePathAsString(route) {

        const currentPath = Router._getCurrentPath();
        const routePath = this._baseUrl + route.path;

        return (
            (route.exact === true) ?
                routePath === currentPath :
                currentPath.startsWith(routePath)
        );
    }

    _compareRoutePathAsArray(route) {

        const currentPathParts = Router._getCurrentPath().split('/');
        const routePathParts = (this._baseUrl + route.path).split('/');

        if (
            (route.exact === true && routePathParts.length !== currentPathParts.length) ||
            routePathParts.length > currentPathParts.length
        ) {

            return false;
        }

        const urlParams = {};

        for (let i = 0; i < routePathParts.length; i++) {

            const currentPath = currentPathParts[i];
            const routePathPart = routePathParts[i];

            if (routePathPart.charAt(0) === ':') {

                urlParams[routePathPart.slice(1)] = currentPath;

                continue;
            }

            if (routePathPart !== currentPath) {

                return false;
            }
        }

        return urlParams;
    }

    _processRoute(
        { redirect, onRouteActivation, component, render },
        urlParams = {}
    ) {

        if (redirect) {

            return this._redirect(redirect);
        }

        Router.urlParams = urlParams;

        const processingPath = Router._getCurrentPath();

        if (
            typeof onRouteActivation === 'function' &&
            Router._currentPath !== processingPath
        ) {

            Router._currentPath = processingPath;

            onRouteActivation(urlParams);
        }

        if (typeof render === 'function') {

            return render(urlParams);
        }

        return new component({ urlParams }).render();
    }

    _redirect(path) {

        if (Router._getCurrentPath() === path) {

            return;
        }

        history.pushState(null, '', path);

        return this.renderProperElements();
    }

    static init(root) {

        if (Router._initialized) {

            return;
        }

        root.addEventListener('click', (event) => {

            const { target } = event;
            const routerLink = target.getAttribute('routerLink');

            if (target.nodeName !== 'A' || !routerLink) {

                return;
            }

            event.preventDefault();

            Router.navigate(routerLink);
        });

        Router._initialized = true;
    }

    static navigate(path) {

        const currentPath = Router._getCurrentPath();

        if (currentPath === path) {

            return;
        }

        history.pushState(null, '', path);

        Router.locationChangeNotifier.notifyAllListeners([currentPath, location.pathname]);
    }

    static get locationChangeNotifier() {

        if (Router._locationChangeNotifier) {

            return Router._locationChangeNotifier;
        }

        const notifier = new Notifier();

        Router._locationChangeNotifier = notifier;

        return notifier;
    }

    static _getCurrentPath(pathname = location.pathname) {

        if (pathname.length > 1 && pathname.endsWith('/')) {

            return pathname.slice(0, -1);
        }

        return pathname;
    }
}