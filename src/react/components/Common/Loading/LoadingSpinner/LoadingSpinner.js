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
 * @since         2.13.0
 */
import React from "react";
import PropTypes from "prop-types";

/**
 * This component displays a waiting loading spinner
 */
class LoadingSpinner extends React.Component {
  /**
   * Render the component
   */
  render() {
    return (
      <>
        <div className="processing-wrapper">
          <div  className="processing-text">
            {this.props.title &&
              <h2>
                {this.props.title}
              </h2>
            }
            <h2>
              Please wait...
            </h2>
          </div>
        </div>
      </>
    );
  }
}

LoadingSpinner.propTypes = {
  title: PropTypes.string, // A custom string
};

export default LoadingSpinner;
