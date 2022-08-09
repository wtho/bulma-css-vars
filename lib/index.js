"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hsl = exports.rgb = exports.ColorUpdater = void 0;
var color_updater_1 = require("./color-updater");
Object.defineProperty(exports, "ColorUpdater", { enumerable: true, get: function () { return color_updater_1.ColorUpdater; } });
var bulma_color_tools_1 = require("./bulma-color-tools");
Object.defineProperty(exports, "rgb", { enumerable: true, get: function () { return bulma_color_tools_1.newRgb; } });
Object.defineProperty(exports, "hsl", { enumerable: true, get: function () { return bulma_color_tools_1.newHsl; } });
