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
import React, {Component} from "react";
import {CirclePicker} from "react-color";
import Icon from "../../../../react/components/Common/Icons/Icon";
import ErrorDialog from "../../Dialog/ErrorDialog/ErrorDialog";
import {withDialog} from "../../../../react/contexts/Common/DialogContext";
import PropTypes from "prop-types";
import {withAppContext} from "../../../contexts/AppContext";
import {withUserSettings} from "../../../contexts/UserSettingsContext";
import {withActionFeedback} from "../../../contexts/ActionFeedbackContext";
import SecretComplexity from "../../../lib/Secret/SecretComplexity";

/**
 * This component displays the user choose security token information
 */
class ChangeUserSecurityToken extends Component {
  /**
   * Default constructor
   * @param props Component props
   */
  constructor(props) {
    super(props);
    this.state = this.defaultState;
    this.bindEventHandlers();
    this.createReferences();
  }

  /**
   * Whenever the component is mounted
   */
  componentDidMount() {
    // get token and color from the logged user
    this.getSecurityTokenFromLoggedInUser();
  }

  /**
   * Returns the default state
   */
  get defaultState() {
    return {
      background: '', // The token color
      code: '', // The token code
      actions: {
        processing: false // True if one's processing passphrase
      },
      hasBeenValidated: false, // true if the form has already validated once
      errors: {
        emptyCode: false, // True if the token code is empty
        lengthCode: false // True if the token code length is > 3
      }
    };
  }

  /**
   * Get the security token from the logged in user
   */
  getSecurityTokenFromLoggedInUser() {
    const background = this.props.context.userSettings.getSecurityTokenBackgroundColor();
    const code = this.props.context.userSettings.getSecurityTokenCode();
    this.setState({background, code});
  }

  /**
   * Returns the default set of colors
   */
  get defaultColors() {
    return [
      '#f44336', '#9c27b0', '#3f51b5', '#03a9f4',
      '#009688', '#8bc34a', '#ffeb3b', '#ff9800',
      '#795548', '#607d8b', '#000000', '#f6f6f6'
    ];
  }

  /**
   * Returns the default set of colors text
   */
  get textColor() {
    const c = this.state.background.substr(1).match(/(\S{2})/g);
    const r = parseInt(c[0], 16);
    const g = parseInt(c[1], 16);
    const b = parseInt(c[2], 16);
    const l = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return l > 125 ? '#000000' : '#ffffff';
  }

  /**
   * Returns the security token CSS style
   * @returns {undefined|{backgroundColor: *, color: (string)}}
   */
  get securityTokenStyle() {
    if (this.state.background) {
      return {
        backgroundColor: this.state.background,
        color: this.textColor
      };
    } else {
      return undefined;
    }
  }

  /**
   * Returns true if the user can perform actions on the component
   */
  get areActionsAllowed() {
    return !this.state.actions.processing;
  }

  /**
   * Returns true if the passphrase is valid
   */
  get isValid() {
    return Object.values(this.state.errors).every(value => !value);
  }

  /**
   * Returns true if the component must be in a processing mode
   */
  get isProcessing() {
    return this.state.actions.processing;
  }

  /**
   * Handle component event handlers
   */
  bindEventHandlers() {
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelectColor = this.handleSelectColor.bind(this);
    this.handleRandomize = this.handleRandomize.bind(this);
    this.handleChangeCode = this.handleChangeCode.bind(this);
  }

  /**
   * Creates the references
   */
  createReferences() {
    this.tokenCodeInputRef = React.createRef();
  }

  /**
   * Whenever the users submits his security token choice
   * @param event Dom event
   */
  async handleSubmit(event) {
    event.preventDefault();
    await this.validate();

    if (this.isValid) {
      await this.toggleProcessing();
      await this.save();
    }
  }

  /**
   * Whenever a new color has been selected
   */
  async handleSelectColor(color) {
    if (this.areActionsAllowed) {
      await this.selectColor(color);
      if (this.state.hasBeenValidated) {
        await this.validate();
      }
    }
  }

  /**
   * Whenever the user wants to randomize the token code and color
   */
  handleRandomize() {
    this.randomizeCode();
    this.randomizeColor();
  }

  /**
   * Whenever the user changes the token code
   * @param event An input event
   */
  async handleChangeCode(event) {
    const code = event.target.value;
    await this.selectCode(code);
    if (this.state.hasBeenValidated) {
      await this.validate();
    }
  }

  /**
   * Saves the security token
   */
  async save() {
    const securityTokenDto = {
      color: this.state.background,
      textcolor: this.textColor,
      code: this.state.code
    };
    try {
      await this.props.userSettingsContext.onUpdateSecurityTokenRequested(securityTokenDto);
      await this.props.actionFeedbackContext.displaySuccess("The security token has been updated successfully");
      await this.toggleProcessing();
    } catch (error) {
      await this.onSaveFailure(error);
    }
  }

  /**
   * Whenever the gpg key generation failed
   * @param error The error
   */
  async onSaveFailure(error) {
    await this.toggleProcessing();
    const ErrorDialogProps = {message: error.message};
    this.props.dialogContext.open(ErrorDialog, ErrorDialogProps);
  }

  /**
   * Select a token color
   * @param color A color
   */
  async selectColor(color) {
    if (color.hex !== this.state.background) {
      await this.setState({background: color.hex});
    }
  }

  /**
   * Select a token code
   * @param code A code
   */
  async selectCode(code) {
    await this.setState({code});
  }

  /**
   * Randomize a token code
   */
  async randomizeCode() {
    const code = SecretComplexity.generate(3, ["uppercase"]);
    await this.selectCode(code);
    if (this.state.hasBeenValidated) {
      await this.validate();
    }
  }

  /**
   * Randomize a color
   */
  async randomizeColor() {
    let color;
    do {
      const number = parseInt(SecretComplexity.generate(3, ["digit"])) % this.defaultColors.length;
      color = {
        hex: this.defaultColors[number]
      };
    } while (color.hex === this.state.background);
    await this.selectColor(color);
  }

  /**
   * Validate the security token data
   */
  async validate() {
    const {code} = this.state;

    const emptyCode =  code.trim() === '';
    if (emptyCode) {
      await this.setState({hasBeenValidated: true, errors: {emptyCode}});
      return;
    }

    const lengthCode =  code.trim().length !== 3;
    if (lengthCode) {
      await this.setState({hasBeenValidated: true, errors: {lengthCode}});
      return;
    }

    await this.setState({hasBeenValidated: true, errors: {}});
  }

  /**
   * Toggle the processing mode
   */
  async toggleProcessing() {
    await this.setState({actions: {processing: !this.state.actions.processing}});
  }

  /**
   * Check if there are errors
   * @return {bool}
   */
  get hasErrors() {
    return this.state.errors
      && (this.state.errors.emptyCode
      || this.state.errors.lengthCode);
  }

  /**
   * Render the component
   */
  render() {
    const processingClassName = this.isProcessing ? 'processing' : '';
    return (
      <div className="grid grid-responsive-12 profile-choose-security-token">
        <div className="row">
          <div className="col6">
            <form onSubmit={this.handleSubmit}>
              <h3>Update the Security Token</h3>
              <div className={`input-security-token input required ${this.hasErrors ? "error" : ""}`}>
                <label htmlFor="security-token-text">Security token</label>
                <input
                  id="security-token-text"
                  ref={this.tokenCodeInputRef}
                  type="text"
                  className="input text required"
                  name="text"
                  maxLength="3"
                  style={this.securityTokenStyle}
                  value={this.state.code}
                  onChange={this.handleChangeCode}
                  disabled={!this.areActionsAllowed}/>
                <input type="hidden" id="security-token-background-color" name="security-token-background-color"/>
                <input type="hidden" id="security-token-text-color" name="security-token-text-color"/>
                <CirclePicker
                  color={ this.state.background }
                  onChange={ this.handleSelectColor }
                  width={240}
                  circleSize={24}
                  circleSpacing={16}
                  colors={this.defaultColors}
                />
                <div className="randomize-button-wrapper">
                  <a
                    className={`randomize-button ${this.isProcessing ? "disabled" : ""}`}
                    role="button"
                    onClick={this.handleRandomize}>
                    <Icon name="magic-wand"/> Randomize
                  </a>
                </div>
              </div>
              {this.state.hasBeenValidated &&
              <div className="input text">
                {this.state.errors.emptyCode &&
                <div className="empty-code message error">The security token code should not be empty.</div>
                }
                {this.state.errors.lengthCode &&
                <div className="not-good-length-code message error">The security token code should be 3 characters long.</div>
                }
              </div>
              }
              <div className="submit-wrapper">
                <button className={`button big ${processingClassName}`} type="submit" disabled={this.isProcessing}>
                  Save
                </button>
              </div>
            </form>
          </div>
          <div className="col4 last">
            <h3>Why is this token needed?</h3>
            <p>This security token will be displayed when your passphrase is requested,
              so you can verify quickly the form is coming from passbolt.
              This will help protect you from phishing attack</p>
          </div>
        </div>
      </div>
    );
  }
}

ChangeUserSecurityToken.propTypes = {
  context: PropTypes.object, // The application context
  userSettingsContext: PropTypes.object, // The user settings context
  dialogContext: PropTypes.any, // The dialog context
  actionFeedbackContext: PropTypes.object, // The action feedback context
};

export default withAppContext(withDialog(withActionFeedback(withUserSettings(ChangeUserSecurityToken))));