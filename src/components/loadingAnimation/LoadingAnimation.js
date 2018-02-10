import { Component } from '../../lib/Component';
import { LoadingAnimationView } from './LoadingAnimationView'

export class LoadingAnimation extends Component {

    constructor({
        width = '100px',
        height = '100px',
        color = '#FFF'
    } = {}) {

        super();

        this._view = new LoadingAnimationView({ width, height, color });
    }
}