import {
  MAT_SELECT_CONFIG,
  MAT_SELECT_SCROLL_STRATEGY,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY,
  MAT_SELECT_TRIGGER,
  MatSelect,
  MatSelectChange,
  MatSelectModule,
  MatSelectTrigger
} from "./chunk-7QYJKAAO.js";
import "./chunk-2W3MGSYV.js";
import "./chunk-RO7A434G.js";
import "./chunk-NLYNVD4P.js";
import "./chunk-IHNBQLK6.js";
import "./chunk-PYUQ7X2E.js";
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatPrefix,
  MatSuffix
} from "./chunk-NC4Z4662.js";
import "./chunk-NF53TIGN.js";
import "./chunk-NNOHRZFI.js";
import {
  MatOptgroup,
  MatOption
} from "./chunk-22IQQKM5.js";
import "./chunk-E4ZBGHXW.js";
import "./chunk-OSQQWOVW.js";
import "./chunk-DXL7VB5U.js";
import "./chunk-Z23J4OUH.js";
import "./chunk-OOWNUZDF.js";
import "./chunk-VENV3F3G.js";
import "./chunk-GWFLKVBH.js";
import "./chunk-JZFZ4N7O.js";
import "./chunk-YBMU6L6A.js";
import "./chunk-5EG33CFQ.js";
import "./chunk-5MWAIW3Y.js";
import "./chunk-2SVN33CG.js";
import "./chunk-XWV63MVF.js";
import "./chunk-YT3I55ZD.js";
import "./chunk-WGQN7DY4.js";
import "./chunk-DO6YOXJK.js";
import "./chunk-JRFR6BLO.js";
import "./chunk-HWYXSU2G.js";
import "./chunk-MARUHEWW.js";
import "./chunk-WDMUDEB6.js";

// node_modules/@angular/material/fesm2022/select.mjs
var matSelectAnimations = {
  // Represents
  // trigger('transformPanel', [
  //   state(
  //     'void',
  //     style({
  //       opacity: 0,
  //       transform: 'scale(1, 0.8)',
  //     }),
  //   ),
  //   transition(
  //     'void => showing',
  //     animate(
  //       '120ms cubic-bezier(0, 0, 0.2, 1)',
  //       style({
  //         opacity: 1,
  //         transform: 'scale(1, 1)',
  //       }),
  //     ),
  //   ),
  //   transition('* => void', animate('100ms linear', style({opacity: 0}))),
  // ])
  /** This animation transforms the select's overlay panel on and off the page. */
  transformPanel: {
    type: 7,
    name: "transformPanel",
    definitions: [
      {
        type: 0,
        name: "void",
        styles: {
          type: 6,
          styles: { opacity: 0, transform: "scale(1, 0.8)" },
          offset: null
        }
      },
      {
        type: 1,
        expr: "void => showing",
        animation: {
          type: 4,
          styles: {
            type: 6,
            styles: { opacity: 1, transform: "scale(1, 1)" },
            offset: null
          },
          timings: "120ms cubic-bezier(0, 0, 0.2, 1)"
        },
        options: null
      },
      {
        type: 1,
        expr: "* => void",
        animation: {
          type: 4,
          styles: { type: 6, styles: { opacity: 0 }, offset: null },
          timings: "100ms linear"
        },
        options: null
      }
    ],
    options: {}
  }
};
export {
  MAT_SELECT_CONFIG,
  MAT_SELECT_SCROLL_STRATEGY,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY,
  MAT_SELECT_TRIGGER,
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatOptgroup,
  MatOption,
  MatPrefix,
  MatSelect,
  MatSelectChange,
  MatSelectModule,
  MatSelectTrigger,
  MatSuffix,
  matSelectAnimations
};
//# sourceMappingURL=@angular_material_select.js.map
