'use strict'
import {NightwatchBrowser} from 'nightwatch'
import init from '../helpers/init'

module.exports = {
  '@disabled': true,
  before: function (browser: NightwatchBrowser, done: VoidFunction) {
    init(browser, done)
  },

  'Should create semaphore workspace template #group1 #group2 #group3 #group4': function (browser: NightwatchBrowser) {
    browser
      .clickLaunchIcon('filePanel')
      .click('*[data-id="workspacesMenuDropdown"]')
      .click('*[data-id="workspacecreate"]')
      .waitForElementVisible('*[data-id="modalDialogCustomPromptTextCreate"]')
      .waitForElementVisible('[data-id="fileSystemModalDialogModalFooter-react"] > button')
      .click('select[id="wstemplate"]')
      .click('select[id="wstemplate"] option[value=semaphore]')
      .waitForElementPresent('[data-id="fileSystemModalDialogModalFooter-react"] .modal-ok')
      .execute(function () {
        ;(document.querySelector('[data-id="fileSystemModalDialogModalFooter-react"] .modal-ok') as HTMLElement).click()
      })
      .pause(100)
      .waitForElementVisible('*[data-id="treeViewLitreeViewItemcircuits"]')
      .waitForElementVisible('*[data-id="treeViewLitreeViewItemcircuits/semaphore.circom"]')
      .waitForElementVisible('*[data-id="treeViewLitreeViewItemscripts"]')
      .waitForElementVisible('*[data-id="treeViewLitreeViewItemscripts/run_setup.ts"]')
      .waitForElementVisible('*[data-id="treeViewLitreeViewItemtemplates"]')
      .waitForElementVisible('*[data-id="treeViewLitreeViewItemtemplates/groth16_verifier.sol.ejs"]')
  },
  'Should compile a simple circuit using editor play button #group1': function (browser: NightwatchBrowser) {
    browser.click('[data-id="treeViewLitreeViewItemcircuits/simple.circom"]').waitForElementPresent('[data-path="Semaphore - 1/circuits/simple.circom"]').waitForElementVisible('[data-path="Semaphore - 1/circuits/simple.circom"]').click('[data-id="play-editor"]').waitForElementPresent('[data-id="treeViewLitreeViewItemcircuits/.bin/simple.wasm"]').waitForElementVisible('[data-id="treeViewLitreeViewItemcircuits/.bin/simple.wasm"]')
  },
  'Should compute a witness for a simple circuit #group1': function (browser: NightwatchBrowser) {
    browser
      .clickLaunchIcon('circuit-compiler')
      .frame(0)
      .waitForElementVisible('[data-id="witness_toggler"]')
      .click('[data-id="witness_toggler"]')
      .waitForElementVisible('[data-id="compute_witness_btn"]')
      .waitForElementVisible('[data-id="circuit_input_a"]')
      .waitForElementVisible('[data-id="circuit_input_b"]')
      .setValue('[data-id="circuit_input_a"]', '1')
      .setValue('[data-id="circuit_input_b"]', '2')
      .click('[data-id="compute_witness_btn"]')
      .frameParent()
      .clickLaunchIcon('filePanel')
      .waitForElementPresent('[data-id="treeViewLitreeViewItemcircuits/.bin/simple.wtn"]')
      .waitForElementVisible('[data-id="treeViewLitreeViewItemcircuits/.bin/simple.wtn"]')
  },
  'Should compile a simple circuit using compile button in circom plugin #group2': function (browser: NightwatchBrowser) {
    browser
      .click('[data-id="treeViewLitreeViewItemcircuits/simple.circom"]')
      .waitForElementPresent('[data-path="Semaphore - 1/circuits/simple.circom"]')
      .waitForElementVisible('[data-path="Semaphore - 1/circuits/simple.circom"]')
      .clickLaunchIcon('circuit-compiler')
      .frame(0)
      .waitForElementPresent('button[data-id="compile_circuit_btn"]')
      .waitForElementVisible('button[data-id="compile_circuit_btn"]')
      .click('button[data-id="compile_circuit_btn"]')
      .frameParent()
      .clickLaunchIcon('filePanel')
      .waitForElementPresent('[data-id="treeViewLitreeViewItemcircuits/.bin/simple.wasm"]')
      .waitForElementVisible('[data-id="treeViewLitreeViewItemcircuits/.bin/simple.wasm"]')
  },
  'Should generate R1CS for a simple circuit #group2': function (browser: NightwatchBrowser) {
    browser.clickLaunchIcon('circuit-compiler').frame(0).waitForElementPresent('button[data-id="generate_r1cs_btn"]').waitForElementVisible('button[data-id="generate_r1cs_btn"]').click('button[data-id="generate_r1cs_btn"]').frameParent().clickLaunchIcon('filePanel').waitForElementPresent('[data-id="treeViewLitreeViewItemcircuits/.bin/simple.r1cs"]').waitForElementVisible('[data-id="treeViewLitreeViewItemcircuits/.bin/simple.r1cs"]')
  },
  'Should compile a simple circuit using CTRL + S from the editor #group3': function (browser: NightwatchBrowser) {
    browser
      .click('[data-id="treeViewLitreeViewItemcircuits/simple.circom"]')
      .waitForElementPresent('[data-path="Semaphore - 1/circuits/simple.circom"]')
      .waitForElementVisible('[data-path="Semaphore - 1/circuits/simple.circom"]')
      .perform(function () {
        const actions = this.actions({async: true})

        return actions.keyDown(this.Keys.CONTROL).sendKeys('s')
      })
      .waitForElementPresent('[data-id="treeViewLitreeViewItemcircuits/.bin/simple.wasm"]')
      .waitForElementVisible('[data-id="treeViewLitreeViewItemcircuits/.bin/simple.wasm"]')
  },
  'Should display warnings for compiled circuit without pragma version #group4': function (browser: NightwatchBrowser) {
    browser
      .captureBrowserConsoleLogs((event) => {
        console.log(event.type, event.timestamp, event.args[0].value)
      })
      .addFile('circuits/warning.circom', {content: warningCircuit})
      .waitForElementPresent('[data-path="Semaphore - 1/circuits/warning.circom"]')
      .waitForElementVisible('[data-path="Semaphore - 1/circuits/warning.circom"]')
      .click('[data-id="treeViewLitreeViewItemcircuits/warning.circom"]')
      .clickLaunchIcon('circuit-compiler')
      .frame(0)
      .waitForElementPresent('button[data-id="compile_circuit_btn"]')
      .waitForElementVisible('button[data-id="compile_circuit_btn"]')
      .click('button[data-id="compile_circuit_btn"]')
      .waitForElementContainsText('[data-id="circuit_feedback"]', 'File circuits/warning.circom does not include pragma version. Assuming pragma version (2, 1, 5)')
      .frameParent()
      .clickLaunchIcon('filePanel')
      .waitForElementPresent('[data-id="treeViewLitreeViewItemcircuits/.bin/warning.wasm"]')
      .waitForElementVisible('[data-id="treeViewLitreeViewItemcircuits/.bin/warning.wasm"]')
      .clickLaunchIcon('circuit-compiler')
      .frame(0)
      .waitForElementPresent('[data-id="circuit_feedback"]')
      .waitForElementVisible('[data-id="circuit_feedback"]')
      .assert.hasClass('[data-id="circuit_feedback"]', 'alert-warning')
      .waitForElementContainsText('[data-id="circuit_feedback"]', 'File circuits/warning.circom does not include pragma version. Assuming pragma version (2, 1, 5)')
      .execute(
        function () {
          return (window as any).logs
        },
        [],
        function (result) {
          console.log(result)
        }
      )
  },
  'Should hide/show warnings for compiled circuit #group4': function (browser: NightwatchBrowser) {
    browser.click('[data-id="hide_circuit_warnings_checkbox_input"]').waitForElementNotPresent('[data-id="circuit_feedback"]').click('[data-id="hide_circuit_warnings_checkbox_input"]').waitForElementVisible('[data-id="circuit_feedback"]').waitForElementContainsText('[data-id="circuit_feedback"]', 'File circuits/warning.circom does not include pragma version. Assuming pragma version (2, 1, 5)')
  },
  'Should display error for invalid circuit #group4': function (browser: NightwatchBrowser) {
    browser
      .frameParent()
      .clickLaunchIcon('filePanel')
      .addFile('circuits/error.circom', {content: errorCircuit})
      .waitForElementPresent('[data-path="Semaphore - 1/circuits/error.circom"]')
      .waitForElementVisible('[data-path="Semaphore - 1/circuits/error.circom"]')
      .click('[data-id="treeViewLitreeViewItemcircuits/error.circom"]')
      .clickLaunchIcon('circuit-compiler')
      .frame(0)
      .waitForElementPresent('button[data-id="compile_circuit_btn"]')
      .waitForElementVisible('button[data-id="compile_circuit_btn"]')
      .click('button[data-id="compile_circuit_btn"]')
      .waitForElementPresent('[data-id="circuit_feedback"]')
      .assert.hasClass('[data-id="circuit_feedback"]', 'alert-danger')
      .waitForElementContainsText('[data-id="circuit_feedback"]', 'No main specified in the project structure')
  },
  'Should auto compile circuit #group4': function (browser: NightwatchBrowser) {
    browser
      .click('[data-id="auto_compile_circuit_checkbox_input"]')
      .frameParent()
      .setEditorValue(validCircuit, function () {
        browser.frame(0).waitForElementNotPresent('[data-id="circuit_feedback"]').frameParent().clickLaunchIcon('filePanel').waitForElementPresent('[data-id="treeViewLitreeViewItemcircuits/.bin/error.wasm"]')
      })
  },
}

const warningCircuit = `
template Multiplier2() {
  signal input a;
  signal input b;
  signal output c;
  c <== a*b;
}

component main = Multiplier2();
`

const errorCircuit = `
pragma circom 2.0.0;

template Multiplier2() {
    signal input a;
    signal input b;
    signal output c;
    c <== a*b;
 }
`

const validCircuit = `
pragma circom 2.0.0;

template Multiplier2() {
    signal input a;
    signal input b;
    signal output c;
    c <== a*b;
 }

 component main = Multiplier2();
`