
/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) 2020 Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2020 Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         3.1.0
 */

import React from 'react';
import PropTypes from "prop-types";
import {withUserSettings} from "../../../contexts/UserSettingsContext";
import FormSubmitButton from "../../../../react/components/Common/Inputs/FormSubmitButton/FormSubmitButton";
import ErrorDialog from "../../Dialog/ErrorDialog/ErrorDialog";
import {withDialog} from "../../../../react/contexts/Common/DialogContext";
import Icon from "../../../../react/components/Common/Icons/Icon";

/**
 * This component displays the user confirm passphrase information
 */
class ConfirmPassphrase extends React.Component {
  /**
   * Default constructor
   * @param props Component props
   */
  constructor(props) {
    super(props);
    this.state = this.defaultState;
    this.bindCallbacks();
    this.createInputRef();
  }

  /**
   * Returns the component default state
   */
  get defaultState() {
    return {
      processing: false, // component is processing or not
      passphrase: "", // The passphrase input
      passphraseError: null, // The passphrase error input
      isObfuscated: true, // True if the passphrase should not be visible
    };
  }

  /**
   * Bind callbacks methods
   */
  bindCallbacks() {
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleToggleObfuscate = this.handleToggleObfuscate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  /**
   * Create DOM nodes or React elements references in order to be able to access them programmatically.
   */
  createInputRef() {
    this.passphraseInputRef = React.createRef();
  }

  /**
   * Toggle the processing mode
   */
  async toggleProcessing() {
    await this.setState({processing: !this.state.processing});
  }

  /**
   * Handle form input changes.
   * @params {ReactEvent} The react event
   * @returns {void}
   */
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({[name]: value});
  }

  /**
   * Whenever one wants to toggle the obfusctated mode
   */
  handleToggleObfuscate() {
    this.toggleObfuscate();
  }

  /**
   * Toggle the obfuscate mode of the passphrase view
   */
  toggleObfuscate() {
    this.setState({isObfuscated: !this.state.isObfuscated});
  }

  /**
   * Whenever the user submits the passphrase
   * @param event A form submit event
   */
  async handleSubmit(event) {
    event.preventDefault();
    // Do not re-submit an already processing form
    if (!this.state.processing) {
      await this.toggleProcessing();
      await this.checkPassphrase();
    }
  }

  /**
   * Check the passphrase
   */
  async checkPassphrase() {
    this.props.userSettingsContext.onCheckProvidePassphraseRequested(this.state.passphrase)
      .catch(this.onCheckFailure.bind(this));
  }

  /**
   * Whenever the gpg key import failed
   * @param error The error
   */
  onCheckFailure(error) {
    // Whenever the passphrase is invalid.
    this.toggleProcessing();
    if (error.name === "InvalidMasterPasswordError") {
      this.setState({passphraseError: "The passphrase is invalid."});
    } else {
      const ErrorDialogProps = {message: error.message};
      this.props.dialogContext.open(ErrorDialog, ErrorDialogProps);
    }
  }

  /**
   * Cancel action and go back to the introduction passphrase
   */
  handleCancel() {
    this.props.userSettingsContext.onGoToIntroductionPassphraseRequested();
  }

  /**
   * Is valid passphrase.
   * Passphrase has to be valid
   * @returns {boolean}
   */
  IsValidPassphrase() {
    const passphrase = this.state.passphrase;
    if (passphrase.trim() === '') {
      return false;
    }
    return true;
  }

  /**
   * Should input be disabled? True if state is loading or processing
   * @returns {boolean}
   */
  hasAllInputDisabled() {
    return this.state.processing;
  }

  /**
   * Returns true if the component must be in a disabled mode
   */
  mustBeDisabled() {
    return this.hasAllInputDisabled() || !this.IsValidPassphrase();
  }

  render() {
    return (
      <div className="grid grid-responsive-12 profile-passphrase">
        <div className="row">
          <div className="col6">
            <form className="enter-passphrase" onSubmit={this.handleSubmit}>
              <h3>Please enter your passphrase to continue</h3>
              <div className="form-content">
                <div className={`input text password required ${this.state.passphraseError ? "error" : ""}`}>
                  <label htmlFor="passphrase-input">Passphrase</label>
                  <input id="passphrase-input" type={`${this.state.isObfuscated ? "password" : "text"}`} name="passphrase" placeholder="Passphrase" required="required"
                    ref={this.passphraseInputRef} className={`required ${this.state.passphraseError ? "error" : ""}`} autoFocus={true}
                    value={this.state.passphrase} onChange={this.handleInputChange} disabled={this.hasAllInputDisabled()} />
                  <a
                    className={`password-view button-icon button button-toggle ${this.state.isObfuscated ? "" : "selected"}`}
                    role="button"
                    onClick={this.handleToggleObfuscate}>
                    <Icon name="eye-open"/>
                    <span className="visually-hidden">view</span>
                  </a>
                  {this.state.passphraseError &&
                  <div className="input text">
                    <div className="message error">{this.state.passphraseError}</div>
                  </div>
                  }
                </div>
              </div>
              <div className="submit-wrapper">
                <button className="button big" type="button" disabled={this.hasAllInputDisabled()} onClick={this.handleCancel}>
                  Cancel
                </button>
                <FormSubmitButton big={true} disabled={this.mustBeDisabled()} processing={this.state.processing} value="Verify"/>
              </div>
            </form>
          </div>
          <div className="col4 last passphrase-help">
            <h3>What if I forgot my passphrase?</h3>
            <p>Unfortunately you need your passphrase in order to continue. If you forgot it, please contact your administrator.</p>
            <a className="button big" href="https://help.passbolt.com/faq/start/passphrase-recovery" target="_blank" rel="noopener noreferrer">
              <span>Learn more</span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

ConfirmPassphrase.propTypes = {
  userSettingsContext: PropTypes.object, // The user settings context
  dialogContext: PropTypes.any, // The dialog context
};

export default withDialog(withUserSettings(ConfirmPassphrase));