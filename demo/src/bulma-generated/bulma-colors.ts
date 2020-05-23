
export type ColorFn =
  | 'rgba'
  | 'adjusthue'
  | 'saturate'
  | 'desaturate'
  | 'lighten'
  | 'darken'
  | 'color-invert'
  | 'dark-color'
  | 'light-color'

export interface ColorFnCall {
  fn: ColorFn
  fnArg: string
  composeArg?: ColorFnCall
}

export interface ColorCallSet {
  [color: string]: {
    calls: ColorFnCall[],
  }
}
export const bulmaCssVariablesDefs: ColorCallSet = {
  "black": {
    "calls": [
      {
        "fn": "rgba",
        "fnArg": "10",
        "composeArg": null
      },
      {
        "fn": "rgba",
        "fnArg": "2",
        "composeArg": null
      },
      {
        "fn": "rgba",
        "fnArg": "20",
        "composeArg": null
      },
      {
        "fn": "rgba",
        "fnArg": "5",
        "composeArg": null
      },
      {
        "fn": "lighten",
        "fnArg": "800",
        "composeArg": null
      }
    ]
  },
  "black-bis": {
    "calls": []
  },
  "black-ter": {
    "calls": []
  },
  "blue": {
    "calls": [
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": null
      },
      {
        "fn": "dark-color",
        "fnArg": null,
        "composeArg": null
      },
      {
        "fn": "light-color",
        "fnArg": null,
        "composeArg": null
      }
    ]
  },
  "cyan": {
    "calls": [
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": null
      },
      {
        "fn": "dark-color",
        "fnArg": null,
        "composeArg": null
      },
      {
        "fn": "light-color",
        "fnArg": null,
        "composeArg": null
      }
    ]
  },
  "green": {
    "calls": [
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": null
      },
      {
        "fn": "dark-color",
        "fnArg": null,
        "composeArg": null
      },
      {
        "fn": "light-color",
        "fnArg": null,
        "composeArg": null
      }
    ]
  },
  "grey": {
    "calls": []
  },
  "grey-dark": {
    "calls": []
  },
  "grey-darker": {
    "calls": [
      {
        "fn": "lighten",
        "fnArg": "800",
        "composeArg": null
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": null
      }
    ]
  },
  "grey-light": {
    "calls": []
  },
  "grey-lighter": {
    "calls": []
  },
  "grey-lightest": {
    "calls": []
  },
  "red": {
    "calls": [
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": null
      },
      {
        "fn": "dark-color",
        "fnArg": null,
        "composeArg": null
      },
      {
        "fn": "light-color",
        "fnArg": null,
        "composeArg": null
      }
    ]
  },
  "scheme-main": {
    "calls": []
  },
  "text": {
    "calls": [
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": null
      }
    ]
  },
  "text-strong": {
    "calls": []
  },
  "turquoise": {
    "calls": [
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": null
      },
      {
        "fn": "dark-color",
        "fnArg": null,
        "composeArg": null
      },
      {
        "fn": "light-color",
        "fnArg": null,
        "composeArg": null
      }
    ]
  },
  "white": {
    "calls": [
      {
        "fn": "lighten",
        "fnArg": "800",
        "composeArg": null
      }
    ]
  },
  "white-bis": {
    "calls": []
  },
  "white-ter": {
    "calls": [
      {
        "fn": "darken",
        "fnArg": "1000",
        "composeArg": null
      },
      {
        "fn": "darken",
        "fnArg": "500",
        "composeArg": null
      },
      {
        "fn": "lighten",
        "fnArg": "800",
        "composeArg": null
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": null
      }
    ]
  },
  "yellow": {
    "calls": [
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": null
      },
      {
        "fn": "dark-color",
        "fnArg": null,
        "composeArg": null
      },
      {
        "fn": "light-color",
        "fnArg": null,
        "composeArg": null
      }
    ]
  }
}
