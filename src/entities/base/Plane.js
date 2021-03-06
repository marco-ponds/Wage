import { Element, ENTITY_TYPES } from '../index';

import {
    PlaneGeometry,
    DoubleSide,
    Vector3,
    MeshBasicMaterial
} from 'three';

const UP = new Vector3(0, 1, 0);
const DOWN = new Vector3(0, -1, 0);

export default class Plane extends Element {

    constructor(height, width, options = {}) {
        super(null, null, options);

        const {
            color = 0xfffffff,
            transparent = false,
            opacity = 1
        } = options;

        material = new MeshBasicMaterial({ color, side: DoubleSide, transparent, opacity });
        geometry = new PlaneGeometry(width, height);

        this.setBody({ geometry, material });
        this.setEntityType(ENTITY_TYPES.MESH);
    }

    static get UP() { return UP; }
    static get DOWN() { return DOWN; }

    face(direction) {
        const vector = new Vector3(direction.x, direction.y, direction.z);

        this.body.lookAt(vector);
    }
}
