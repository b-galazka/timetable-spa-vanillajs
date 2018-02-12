import { Notifier } from './Notifier';

export class Router {

    constructor({ baseUrl = '', routes = [], notFoundFallback }) {

        this._baseUrl = baseUrl;
        this._routes = routes;
        this._notFoundFallback = notFoundFallback;
    }

    renderProperElements() {

        const output = this._getOutput();

        if (output !== '') {

            return output;
        }

        return (
            this._notFoundFallback ? 
                this._processRoute(this._notFoundFallback) : 
                ''
        );
    }

    _getOutput() {

        let output = '';

        for (const route of this._routes) {

            const routeComparisonResult = this._compareRoutePathAsArray(route);

            if (routeComparisonResult === false) {

                continue;
            }

            const outputPart = this._processRoute(route, routeComparisonResult);

            if (outputPart === false) {

                return this._getOutput();
            }

            output += outputPart;
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

        return Router._compareRoutesParts(currentPathParts, routePathParts);
    }

    static _compareRoutesParts(currentPathParts, routePathParts) {

        const urlParams = {};

        for (let i = 0; i < routePathParts.length; i++) {

            const currentPathPart = currentPathParts[i];
            const routePathPart = routePathParts[i];

            if (routePathPart.charAt(0) === ':') {

                urlParams[routePathPart.slice(1)] = currentPathPart;

                continue;
            }

            if (routePathPart !== currentPathPart) {

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

            Router._redirect(redirect);

            return false;
        }

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

    static _redirect(path) {

        if (Router._getCurrentPath() === path) {

            return;
        }

        history.replaceState(null, '', path);
    }

    static init(root) {

        if (Router._initialized) {

            return;
        }

        Router._initRouterLinks(root);
        Router._initOnPopStateNotifications();
        
        Router._initialized = true;
    }

    static _initRouterLinks(root) {

        root.addEventListener('click', (event) => {

            const { target } = event;
            const routerLink = target.getAttribute('routerLink');

            if (target.nodeName !== 'A' || !routerLink) {

                return;
            }

            event.preventDefault();

            Router.navigate(routerLink);
        });
    }

    static _initOnPopStateNotifications() {

        window.addEventListener('popstate', () => {

            Router.locationChangeNotifier.notifyAllListeners();
        });
    }

    static navigate(path) {

        const currentPath = Router._getCurrentPath();

        if (currentPath === path) {

            return;
        }

        history.pushState(null, '', path);

        Router.locationChangeNotifier.notifyAllListeners();
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