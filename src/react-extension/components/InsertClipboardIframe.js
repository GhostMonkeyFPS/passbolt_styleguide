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
 * @since        3.0.0
 */
import React, {Component} from "react";
import PropTypes from "prop-types";

class InsertFileIframe extends Component {
  constructor(props) {
    super(props);
    this.createRefs();
  }

  componentDidMount() {
    this.loadIframe();
  }

  createRefs() {
    this.iframeRef = React.createRef();
  }

  /**
   * Load the file app iframe
   * @returns {void}
   */
  loadIframe() {
    const iframeUrl = `${this.props.browserExtensionUrl}data/passbolt-iframe-clipboard.html?passbolt=passbolt-iframe-clipboard`;
    this.iframeRef.current.contentWindow.location = iframeUrl;
  }

  /**
   * Render the component
   * @return {JSX}
   */
  render() {
    const style = {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: "1px",
      height: "1px"
    };

    return (
      <iframe id="passbolt-iframe-clipboard" ref={this.iframeRef} style={style}/>
    );
  }
}

InsertFileIframe.propTypes = {
  browserExtensionUrl: PropTypes.string, // The browser extension url
};

export default InsertFileIframe;
