
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
        "fn": "adjusthue",
        "fnArg": "-10deg",
        "composeArg": {
          "fn": "saturate",
          "fnArg": "1000",
          "composeArg": {
            "fn": "darken",
            "fnArg": "1000",
            "composeArg": null
          }
        }
      },
      {
        "fn": "rgba",
        "fnArg": "10",
        "composeArg": null
      },
      {
        "fn": "darken",
        "fnArg": "1000",
        "composeArg": null
      },
      {
        "fn": "adjusthue",
        "fnArg": "10deg",
        "composeArg": {
          "fn": "saturate",
          "fnArg": "500",
          "composeArg": {
            "fn": "lighten",
            "fnArg": "500",
            "composeArg": null
          }
        }
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
        "fnArg": "25",
        "composeArg": null
      },
      {
        "fn": "darken",
        "fnArg": "250",
        "composeArg": null
      },
      {
        "fn": "rgba",
        "fnArg": "30",
        "composeArg": null
      },
      {
        "fn": "rgba",
        "fnArg": "40",
        "composeArg": null
      },
      {
        "fn": "lighten",
        "fnArg": "4800",
        "composeArg": null
      },
      {
        "fn": "rgba",
        "fnArg": "5",
        "composeArg": null
      },
      {
        "fn": "darken",
        "fnArg": "500",
        "composeArg": null
      },
      {
        "fn": "rgba",
        "fnArg": "70",
        "composeArg": null
      },
      {
        "fn": "rgba",
        "fnArg": "86",
        "composeArg": null
      },
      {
        "fn": "rgba",
        "fnArg": "90",
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
        "fn": "adjusthue",
        "fnArg": "-10deg",
        "composeArg": {
          "fn": "saturate",
          "fnArg": "1000",
          "composeArg": {
            "fn": "darken",
            "fnArg": "1000",
            "composeArg": null
          }
        }
      },
      {
        "fn": "darken",
        "fnArg": "1000",
        "composeArg": null
      },
      {
        "fn": "adjusthue",
        "fnArg": "10deg",
        "composeArg": {
          "fn": "saturate",
          "fnArg": "500",
          "composeArg": {
            "fn": "lighten",
            "fnArg": "500",
            "composeArg": null
          }
        }
      },
      {
        "fn": "rgba",
        "fnArg": "25",
        "composeArg": null
      },
      {
        "fn": "darken",
        "fnArg": "250",
        "composeArg": null
      },
      {
        "fn": "darken",
        "fnArg": "500",
        "composeArg": null
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": null
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "darken",
          "fnArg": "500",
          "composeArg": null
        }
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "rgba",
          "fnArg": "70",
          "composeArg": null
        }
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "rgba",
          "fnArg": "90",
          "composeArg": null
        }
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
      },
      {
        "fn": "light-color",
        "fnArg": null,
        "composeArg": {
          "fn": "darken",
          "fnArg": "250",
          "composeArg": null
        }
      },
      {
        "fn": "light-color",
        "fnArg": null,
        "composeArg": {
          "fn": "darken",
          "fnArg": "500",
          "composeArg": null
        }
      }
    ]
  },
  "cyan": {
    "calls": [
      {
        "fn": "adjusthue",
        "fnArg": "-10deg",
        "composeArg": {
          "fn": "saturate",
          "fnArg": "1000",
          "composeArg": {
            "fn": "darken",
            "fnArg": "1000",
            "composeArg": null
          }
        }
      },
      {
        "fn": "darken",
        "fnArg": "1000",
        "composeArg": null
      },
      {
        "fn": "adjusthue",
        "fnArg": "10deg",
        "composeArg": {
          "fn": "saturate",
          "fnArg": "500",
          "composeArg": {
            "fn": "lighten",
            "fnArg": "500",
            "composeArg": null
          }
        }
      },
      {
        "fn": "rgba",
        "fnArg": "25",
        "composeArg": null
      },
      {
        "fn": "darken",
        "fnArg": "250",
        "composeArg": null
      },
      {
        "fn": "darken",
        "fnArg": "500",
        "composeArg": null
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": null
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "darken",
          "fnArg": "500",
          "composeArg": null
        }
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "rgba",
          "fnArg": "70",
          "composeArg": null
        }
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "rgba",
          "fnArg": "90",
          "composeArg": null
        }
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
      },
      {
        "fn": "light-color",
        "fnArg": null,
        "composeArg": {
          "fn": "darken",
          "fnArg": "250",
          "composeArg": null
        }
      },
      {
        "fn": "light-color",
        "fnArg": null,
        "composeArg": {
          "fn": "darken",
          "fnArg": "500",
          "composeArg": null
        }
      }
    ]
  },
  "green": {
    "calls": [
      {
        "fn": "adjusthue",
        "fnArg": "-10deg",
        "composeArg": {
          "fn": "saturate",
          "fnArg": "1000",
          "composeArg": {
            "fn": "darken",
            "fnArg": "1000",
            "composeArg": null
          }
        }
      },
      {
        "fn": "darken",
        "fnArg": "1000",
        "composeArg": null
      },
      {
        "fn": "adjusthue",
        "fnArg": "10deg",
        "composeArg": {
          "fn": "saturate",
          "fnArg": "500",
          "composeArg": {
            "fn": "lighten",
            "fnArg": "500",
            "composeArg": null
          }
        }
      },
      {
        "fn": "rgba",
        "fnArg": "25",
        "composeArg": null
      },
      {
        "fn": "darken",
        "fnArg": "250",
        "composeArg": null
      },
      {
        "fn": "darken",
        "fnArg": "500",
        "composeArg": null
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": null
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "darken",
          "fnArg": "500",
          "composeArg": null
        }
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "rgba",
          "fnArg": "70",
          "composeArg": null
        }
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "rgba",
          "fnArg": "90",
          "composeArg": null
        }
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
      },
      {
        "fn": "light-color",
        "fnArg": null,
        "composeArg": {
          "fn": "darken",
          "fnArg": "250",
          "composeArg": null
        }
      },
      {
        "fn": "light-color",
        "fnArg": null,
        "composeArg": {
          "fn": "darken",
          "fnArg": "500",
          "composeArg": null
        }
      }
    ]
  },
  "grey": {
    "calls": [
      {
        "fn": "rgba",
        "fnArg": "30",
        "composeArg": null
      }
    ]
  },
  "grey-dark": {
    "calls": []
  },
  "grey-darker": {
    "calls": [
      {
        "fn": "adjusthue",
        "fnArg": "-10deg",
        "composeArg": {
          "fn": "saturate",
          "fnArg": "1000",
          "composeArg": {
            "fn": "darken",
            "fnArg": "1000",
            "composeArg": null
          }
        }
      },
      {
        "fn": "darken",
        "fnArg": "1000",
        "composeArg": null
      },
      {
        "fn": "adjusthue",
        "fnArg": "10deg",
        "composeArg": {
          "fn": "saturate",
          "fnArg": "500",
          "composeArg": {
            "fn": "lighten",
            "fnArg": "500",
            "composeArg": null
          }
        }
      },
      {
        "fn": "rgba",
        "fnArg": "25",
        "composeArg": null
      },
      {
        "fn": "darken",
        "fnArg": "250",
        "composeArg": null
      },
      {
        "fn": "lighten",
        "fnArg": "4800",
        "composeArg": null
      },
      {
        "fn": "darken",
        "fnArg": "500",
        "composeArg": null
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": null
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "darken",
          "fnArg": "500",
          "composeArg": null
        }
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "rgba",
          "fnArg": "70",
          "composeArg": null
        }
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "rgba",
          "fnArg": "90",
          "composeArg": null
        }
      }
    ]
  },
  "grey-light": {
    "calls": []
  },
  "grey-lighter": {
    "calls": [
      {
        "fn": "darken",
        "fnArg": "250",
        "composeArg": null
      },
      {
        "fn": "rgba",
        "fnArg": "50",
        "composeArg": null
      },
      {
        "fn": "darken",
        "fnArg": "500",
        "composeArg": null
      }
    ]
  },
  "grey-lightest": {
    "calls": []
  },
  "red": {
    "calls": [
      {
        "fn": "adjusthue",
        "fnArg": "-10deg",
        "composeArg": {
          "fn": "saturate",
          "fnArg": "1000",
          "composeArg": {
            "fn": "darken",
            "fnArg": "1000",
            "composeArg": null
          }
        }
      },
      {
        "fn": "darken",
        "fnArg": "1000",
        "composeArg": null
      },
      {
        "fn": "adjusthue",
        "fnArg": "10deg",
        "composeArg": {
          "fn": "saturate",
          "fnArg": "500",
          "composeArg": {
            "fn": "lighten",
            "fnArg": "500",
            "composeArg": null
          }
        }
      },
      {
        "fn": "rgba",
        "fnArg": "25",
        "composeArg": null
      },
      {
        "fn": "darken",
        "fnArg": "250",
        "composeArg": null
      },
      {
        "fn": "darken",
        "fnArg": "500",
        "composeArg": null
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": null
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "darken",
          "fnArg": "500",
          "composeArg": null
        }
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "rgba",
          "fnArg": "70",
          "composeArg": null
        }
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "rgba",
          "fnArg": "90",
          "composeArg": null
        }
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
      },
      {
        "fn": "light-color",
        "fnArg": null,
        "composeArg": {
          "fn": "darken",
          "fnArg": "250",
          "composeArg": null
        }
      },
      {
        "fn": "light-color",
        "fnArg": null,
        "composeArg": {
          "fn": "darken",
          "fnArg": "500",
          "composeArg": null
        }
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
    "calls": [
      {
        "fn": "rgba",
        "fnArg": "30",
        "composeArg": null
      }
    ]
  },
  "turquoise": {
    "calls": [
      {
        "fn": "adjusthue",
        "fnArg": "-10deg",
        "composeArg": {
          "fn": "saturate",
          "fnArg": "1000",
          "composeArg": {
            "fn": "darken",
            "fnArg": "1000",
            "composeArg": null
          }
        }
      },
      {
        "fn": "darken",
        "fnArg": "1000",
        "composeArg": null
      },
      {
        "fn": "adjusthue",
        "fnArg": "10deg",
        "composeArg": {
          "fn": "saturate",
          "fnArg": "500",
          "composeArg": {
            "fn": "lighten",
            "fnArg": "500",
            "composeArg": null
          }
        }
      },
      {
        "fn": "rgba",
        "fnArg": "25",
        "composeArg": null
      },
      {
        "fn": "darken",
        "fnArg": "250",
        "composeArg": null
      },
      {
        "fn": "darken",
        "fnArg": "500",
        "composeArg": null
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": null
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "darken",
          "fnArg": "500",
          "composeArg": null
        }
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "rgba",
          "fnArg": "70",
          "composeArg": null
        }
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "rgba",
          "fnArg": "90",
          "composeArg": null
        }
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
      },
      {
        "fn": "light-color",
        "fnArg": null,
        "composeArg": {
          "fn": "darken",
          "fnArg": "250",
          "composeArg": null
        }
      },
      {
        "fn": "light-color",
        "fnArg": null,
        "composeArg": {
          "fn": "darken",
          "fnArg": "500",
          "composeArg": null
        }
      }
    ]
  },
  "white": {
    "calls": [
      {
        "fn": "adjusthue",
        "fnArg": "-10deg",
        "composeArg": {
          "fn": "saturate",
          "fnArg": "1000",
          "composeArg": {
            "fn": "darken",
            "fnArg": "1000",
            "composeArg": null
          }
        }
      },
      {
        "fn": "darken",
        "fnArg": "1000",
        "composeArg": null
      },
      {
        "fn": "adjusthue",
        "fnArg": "10deg",
        "composeArg": {
          "fn": "saturate",
          "fnArg": "500",
          "composeArg": {
            "fn": "lighten",
            "fnArg": "500",
            "composeArg": null
          }
        }
      },
      {
        "fn": "rgba",
        "fnArg": "25",
        "composeArg": null
      },
      {
        "fn": "darken",
        "fnArg": "250",
        "composeArg": null
      },
      {
        "fn": "lighten",
        "fnArg": "4800",
        "composeArg": null
      },
      {
        "fn": "darken",
        "fnArg": "500",
        "composeArg": null
      },
      {
        "fn": "rgba",
        "fnArg": "70",
        "composeArg": null
      },
      {
        "fn": "rgba",
        "fnArg": "90",
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
        "fn": "adjusthue",
        "fnArg": "-10deg",
        "composeArg": {
          "fn": "saturate",
          "fnArg": "1000",
          "composeArg": {
            "fn": "darken",
            "fnArg": "1000",
            "composeArg": null
          }
        }
      },
      {
        "fn": "darken",
        "fnArg": "1000",
        "composeArg": null
      },
      {
        "fn": "adjusthue",
        "fnArg": "10deg",
        "composeArg": {
          "fn": "saturate",
          "fnArg": "500",
          "composeArg": {
            "fn": "lighten",
            "fnArg": "500",
            "composeArg": null
          }
        }
      },
      {
        "fn": "rgba",
        "fnArg": "25",
        "composeArg": null
      },
      {
        "fn": "darken",
        "fnArg": "250",
        "composeArg": null
      },
      {
        "fn": "lighten",
        "fnArg": "4800",
        "composeArg": null
      },
      {
        "fn": "darken",
        "fnArg": "500",
        "composeArg": null
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": null
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "darken",
          "fnArg": "500",
          "composeArg": null
        }
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "rgba",
          "fnArg": "70",
          "composeArg": null
        }
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "rgba",
          "fnArg": "90",
          "composeArg": null
        }
      }
    ]
  },
  "yellow": {
    "calls": [
      {
        "fn": "adjusthue",
        "fnArg": "-10deg",
        "composeArg": {
          "fn": "saturate",
          "fnArg": "1000",
          "composeArg": {
            "fn": "darken",
            "fnArg": "1000",
            "composeArg": null
          }
        }
      },
      {
        "fn": "darken",
        "fnArg": "1000",
        "composeArg": null
      },
      {
        "fn": "adjusthue",
        "fnArg": "10deg",
        "composeArg": {
          "fn": "saturate",
          "fnArg": "500",
          "composeArg": {
            "fn": "lighten",
            "fnArg": "500",
            "composeArg": null
          }
        }
      },
      {
        "fn": "rgba",
        "fnArg": "25",
        "composeArg": null
      },
      {
        "fn": "darken",
        "fnArg": "250",
        "composeArg": null
      },
      {
        "fn": "darken",
        "fnArg": "500",
        "composeArg": null
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": null
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "darken",
          "fnArg": "500",
          "composeArg": null
        }
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "rgba",
          "fnArg": "70",
          "composeArg": null
        }
      },
      {
        "fn": "color-invert",
        "fnArg": null,
        "composeArg": {
          "fn": "rgba",
          "fnArg": "90",
          "composeArg": null
        }
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
      },
      {
        "fn": "light-color",
        "fnArg": null,
        "composeArg": {
          "fn": "darken",
          "fnArg": "250",
          "composeArg": null
        }
      },
      {
        "fn": "light-color",
        "fnArg": null,
        "composeArg": {
          "fn": "darken",
          "fnArg": "500",
          "composeArg": null
        }
      }
    ]
  }
}
