
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
 * @since         2.11.0
 */


import {fireEvent, render, waitFor} from "@testing-library/react";
import React from "react";
import AppContext from "../../../contexts/AppContext";
import FilterUserByShortcut from "./FilterUserByShortcut";
import {BrowserRouter as Router} from "react-router-dom";

/**
 * The FilterUsersByGroups component represented as a page
 */
export default class FilterUsersByShortcutPage {
  /**
   * Default constructor
   * @param appContext An app context
   * @param props Props to attach
   */
  constructor(appContext, props) {
    this._page = render(
      <AppContext.Provider value={appContext}>
        <Router>
          <FilterUserByShortcut.WrappedComponent {...props}/>
        </Router>
      </AppContext.Provider>
    );
  }

  /**
   * Select the All users filter
   */
  async filterByAllUsers() {
    const element = this._page.container.querySelector('#all-users');
    const leftClick = {button: 0};
    fireEvent.click(element, leftClick);
    await waitFor(() => {});
  }

  /**
   * Select the Recently Modified filter
   */
  async filterByRecentlyModified() {
    const element = this._page.container.querySelector('#recently-modified');
    const leftClick = {button: 0};
    fireEvent.click(element, leftClick);
    await waitFor(() => {});
  }
}