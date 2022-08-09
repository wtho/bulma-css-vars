"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_updater_1 = require("./color-updater");
Object.defineProperty(window, 'BulmaColorUpdater', {
    value: color_updater_1.ColorUpdater,
    enumerable: true
});
