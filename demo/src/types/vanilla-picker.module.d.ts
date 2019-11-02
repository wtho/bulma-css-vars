declare module "vanilla-picker" {
  class Picker {
    constructor(options: {
      popup: "top" | "bottom";
      onChange: (color: { rgbaString: string }) => void;
    });
    movePopup: (
      options: {
        parent: HTMLElement;
        color?: string;
      },
      open: boolean
    ) => void;
  }
  export default Picker;
}

declare module "json!*" {
  const value: any;
  export default value;
}
