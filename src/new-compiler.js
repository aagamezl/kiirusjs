const NewCompiler = require('./lib/NewCompiler')
const Compiler = require('./lib/Compiler')

const newCompiler = new NewCompiler()

// const template = `
//   <style>
//     :host {
//       display: inline-block;
//       width: 650px;
//       font-family: 'Roboto Slab';
//       contain: content;
//     }
//     :host([background]) {
//       background: var(--background-color, #9E9E9E);
//       border-radius: 10px;
//       padding: 10px;
//     }
//     :host-context(.darktheme) {
//       color: black;
//       background: black;
//     }
//     #panels {
//       box-shadow: 0 2px 2px rgba(0, 0, 0, .3);
//       background: white;
//       border-radius: 3px;
//       padding: 16px;
//       height: 250px;
//       overflow: auto;
//     }
//     #tabs {
//       display: inline-flex;
//       -webkit-user-select: none;
//       user-select: none;
//     }
//     #tabs slot {
//       display: inline-flex; /* Safari bug. Treats <slot> as a parent */
//     }
//     /* Safari does not support #id prefixes on ::slotted
//       See https://bugs.webkit.org/show_bug.cgi?id=160538 */
//     #tabs ::slotted(*) {
//       font: 400 16px/22px 'Roboto';
//       padding: 16px 8px;
//       margin: 0;
//       text-align: center;
//       width: 100px;
//       text-overflow: ellipsis;
//       white-space: nowrap;
//       overflow: hidden;
//       cursor: pointer;
//       border-top-left-radius: 3px;
//       border-top-right-radius: 3px;
//       background: linear-gradient(#fafafa, #eee);
//       border: none; /* if the user users a <button> */
//     }
//     #tabs ::slotted([aria-selected="true"]) {
//       font-weight: 600;
//       background: white;
//       box-shadow: none;
//     }
//     #tabs ::slotted(:focus) {
//       z-index: 1; /* make sure focus ring doesn't get buried */
//     }
//     #panels ::slotted([aria-hidden="true"]) {
//       display: none;
//     }
//   </style>
//   <div id="tabs">
//     <slot id="tabsSlot" name="title" onClick="onTitleClick" onKeydown="onKeyDown"></slot>
//   </div>
//   <div id="panels">
//     <slot id="panelsSlot"></slot>
//   </div>
// `

const template = `
  <template>
    <span>this is a text</span>
    <div>{person.lastName}</div>
  </template>
  <div id="tabs">
    <slot id="tabsSlot" name="title" onClick="onTitleClick" onKeydown="onKeyDown"></slot>
  </div>
  <div id="panels">
    <slot id="panelsSlot"></slot>
  </div>
`

console.log(JSON.stringify(Compiler.compile(template), null, '  '))
console.log(JSON.stringify(newCompiler.compile(template).children[0], null, '  '))
