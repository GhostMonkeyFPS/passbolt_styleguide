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
 * @since         3.4.0
 *
 */

import {v4 as uuidv4} from "uuid";
import browser from "webextension-polyfill";

/**
 * An InFormMenuField is represented by a DOM element identified as a menu field
 */
class InFormMenuField {
  /** The field to which the in-form is attached */
  field;

  /** An unique identifier for the iframe */
  iframeId;

  /** Flag telling if the user is mousing over the menu (iframe) */
  isMenuMousingOver;

  /** In-form menu click watcher */
  menuClickWatcher;

  /**
   * Default constructor
   * @param field
   */
  constructor(field) {
    this.field = field;
    this.iframeId = uuidv4();
    this.isMenuMousingOver = false;
    this.menuClickWatcher = null;
    this.bindCallbacks();
    this.insertInformMenuIframe();
    this.handleRemoveEvent();
  }

  /**
   * Binds methods callbacks
   */
  bindCallbacks() {
    this.removeInFormMenu = this.removeInFormMenu.bind(this);
    this.removeMenuIframe = this.removeMenuIframe.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  /** MENU INSERTION */

  /**
   * Insert an in-form menu iframe
   */
  insertInformMenuIframe() {
    const iframes = document.querySelectorAll('iframe');
    // Use of Array prototype some method cause NodeList is not an array !
    const iframeId =  this.iframeId;
    const isIframeAlreadyInserted = Array.prototype.some.call(iframes, iframe => iframe.id === iframeId);
    if (!isIframeAlreadyInserted) {
      const iframe = this.createMenuIframe();
      this.handleMenuClicked(iframe);
    }
  }

  /**
   * Create an iframe dedicated to the menu
   * @return {HTMLIFrameElement} The created iframe
   */
  createMenuIframe() {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    const browserExtensionUrl = browser.runtime.getURL("/");
    const {top, left} = this.calculateIframePosition();
    iframe.id = this.iframeId;
    iframe.style.position = "fixed";
    iframe.style.top = top + 'px'
    iframe.style.left =  left + 'px';
    iframe.style.border = 0;
    iframe.style.width = '352px'; // width of the menu + border
    iframe.style.height = '220px'; // For 3 items in a row to be display
    iframe.style.zIndex = "1000";
    iframe.contentWindow.location = `${browserExtensionUrl}data/passbolt-iframe-in-form-menu.html?passbolt=passbolt-iframe-in-form-menu`;
    return iframe;
  }

  /**
   * Calculates the position on the screen of the DOM field
   * @return {{top: number, left: number}}
   */
  calculateIframePosition() {
    let x = 0;
    let y = 0;
    let currentElement = this.field;
    const {height} = this.field.getBoundingClientRect();
    const {top: topBody, left: leftBody} = document.body.getBoundingClientRect();
    // We loop to calculate the cumulated position of the field
    // from its ancestors and itself differential offset / scroll position
    while( currentElement && !isNaN( currentElement.offsetLeft ) && !isNaN( currentElement.offsetTop ) ) {
      x += currentElement.offsetLeft - currentElement.scrollLeft;
      y += currentElement.offsetTop - currentElement.scrollTop;
      currentElement = currentElement.offsetParent;
    }
    // Then we add the body offset (notably in case of window scroll) + some local adjustments (margin / vertical aligment )
    x = x + leftBody;
    y = y + topBody + height; // Calculate the middle position of the input, 8 is the half of the iframe height
    return { top: y, left: x };
  }

  /**
   * Whenever the user clicked on the call-to-action iframe
   * @param iframe The menu iframe
   */
  handleMenuClicked(iframe) {
    /* We need to know which iframe the user click on. We cannot add a listener on iframe
     * since there are from different domains (target page vs extension pagemods)
     */
    iframe.addEventListener('mouseover', () => this.isMenuMousingOver = true);
    iframe.addEventListener('mouseout', () => this.isMenuMousingOver = false);
  }

  /** MENU REMOVE */

  /**
   * Whenever the menu must be removed
   */
  handleRemoveEvent() {
    this.field.addEventListener("blur",  this.removeInFormMenu);
  }

  /**
   * Removes the in-form menu iframe from the field
   */
  removeInFormMenu() {
    const isIframeMouseOver = this.isMenuMousingOver;
    const isActiveElement = document.activeElement === this.field;
    if (!isIframeMouseOver && !isActiveElement) {
      this.removeMenuIframe();
    }
  }

  /**
   * Remove the menu (iframe)
   */
  removeMenuIframe() {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      const identifierToMatch = this.iframeId
      if (iframe.id === identifierToMatch) {
        iframe.parentNode.removeChild(iframe);
      }
    });
  }

  /** DESTROY */

  /**
   * Remove all listener and iframe to clean the page and avoid issue on extension update
   */
  destroy() {
    this.field.removeEventListener("blur",  this.removeInFormMenu);
    this.removeMenuIframe();
  }
}

export default InFormMenuField;