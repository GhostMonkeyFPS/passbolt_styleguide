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
import React, {Component} from "react";
import PropTypes from "prop-types";
import { matchPath } from "react-router"

import {
  Link,
  withRouter
} from "react-router-dom";

class MainMenu extends Component {
  /**
   * Constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
  }

  /**
   * Get default state
   * @returns {*}
   */
  getDefaultState() {
    return {
      // Used for keyboard navigation.
      // Each new menu item displayed will increment it by 1.
      tabIndex: 1,
      // menu items list
      menuItems: [
        {
          "id": "passwords",
          "name": "passwords",
          "className": "passwords",
          "route": "/passwords",
        },
        {
          "id": "users",
          "name": "users",
          "className": "users",
          "url": "/app/users",
        },
        {
          "id": "reports",
          "name": "reports",
          "className": "reports",
          "route": "/reports",
        },
        {
          "id": "administration",
          "name": "administration",
          "className": "administration",
          "url": "/app/administration",
        },
        {
          "id": "help",
          "name": "help",
          "className": "administration",
          "url": "https://help.passbolt.com",
        },
      ],

      // logoutItem
      logoutItem: {
        "id": "logout",
        "name": "logout",
        "className": "logout",
        "url": "/logout",
      },
    }
  }

  handleClick (e, menuItem) {
    e.preventDefault();
    this.props.onClick(menuItem);
  }

  ItemLink(menuItem) {
    if (menuItem.route) {
      return (
        <Link to={menuItem.route} role="button" tabIndex={this.state.tabIndex++}><span>{menuItem.name}</span></Link>
      );
    }
    else {
      return(
        <a href={menuItem.url} role="button" tabIndex={this.state.tabIndex++} onClick={(e) => this.handleClick(e, menuItem)}>
          <span>{menuItem.name}</span>
        </a>
      );
    }
  }

  checkSelected(menuItem) {
    let selected = false;
    if (menuItem.route) {
      const match = matchPath(this.props.location.pathname, {
        path: menuItem.route,
        exact: false,
        strict: false
      });
      if (match) {
        selected = true;
      }
    }

    return selected;
  }

  MenuItem(menuItem) {
    const selected = this.checkSelected(menuItem);

    return (
      <li className={menuItem.className + ' ' + ( this.state.hidden ? 'hidden' : 'visible' )} key={menuItem.id}>
        <div className={selected? "row selected" : "row"}>
          <div className="main-cell-wrapper">
            <div className="main-cell">
              {this.ItemLink(menuItem)}
            </div>
          </div>
        </div>
      </li>
    );
  }

  render() {
    return (
      <nav>
        <div className="primary navigation top">
          <ul className="left">
            {(this.state.menuItems && (this.state.menuItems).map((menuItem) => {
              return this.MenuItem(menuItem);
            }))}
          </ul>
          <ul className="right">
            {this.MenuItem(this.state.logoutItem)}
          </ul>
        </div>
      </nav>
    );
  }
}

MainMenu.propTypes = {
  onClick: PropTypes.func
};

export default withRouter(MainMenu);
