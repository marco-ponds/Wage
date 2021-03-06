import { render } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Provider } from 'inferno-redux';
import { getStore } from '../store/Store';
import BaseUI from './BaseUI';
import Config from '../core/config';
import Router from '../router/Router';
import { dispatch } from '../store';
import { createElementFromSelector } from '../lib/dom';
import { showLoadingScreen, hideLoadingScreen } from '../store/actions/ui';
import { locationPathChange } from '../store/actions/location';

const ROOT_ID = '#ui';

const createProps = () => ({
    level: Router.getCurrentLevel()
});

const getUIContainer = () => {
    let rootElement = document.querySelector(ROOT_ID);

    if (!rootElement) {
        rootElement = createElementFromSelector(ROOT_ID);
        document.body.appendChild(rootElement);
    }

    return rootElement;
};

export const requestLoadingScreen = () => dispatch(showLoadingScreen());
export const removeLoadingScreen = () => dispatch(hideLoadingScreen());

export const dispatchLocationPathChange = path => dispatch(locationPathChange(path));

export const mount = () => {
    const { root = BaseUI } = Config.ui();
    const store = getStore();
    const uiElement = createElement(root, createProps());

    if (store) {
        render(
            createElement(Provider, {
                store: getStore(),
                children: uiElement
            }),
            getUIContainer()
        );
    } else {
        render(uiElement, getUIContainer())
    }
};


export const unmount = () => {
    // Rendering null will trigger unmount lifecycle hooks for whole vDOM tree and remove global event listeners.
    // https://github.com/infernojs/inferno#tear-down
    render(null, document.querySelector(ROOT_ID));
};
