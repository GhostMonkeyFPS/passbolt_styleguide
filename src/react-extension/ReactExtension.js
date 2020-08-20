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
 * @since         2.12.0
 */

import React, {Component} from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Route} from "react-router-dom";
/* eslint-disable no-unused-vars */
import Simplebar from "simplebar/dist/simplebar";
// import SecretComplexity from "../lib/secretComplexity";
/* eslint-enable no-unused-vars */

import ErrorDialog from "./components/Common/Dialog/ErrorDialog/ErrorDialog";
import PasswordCreateDialog from "./components/Password/PasswordCreateDialog/PasswordCreateDialog";
import PasswordEditDialog from "./components/Password/PasswordEditDialog/PasswordEditDialog";
import FolderCreateDialog from "./components/Folder/FolderCreateDialog/FolderCreateDialog";
import FolderRenameDialog from "./components/Folder/FolderRenameDialog/FolderRenameDialog";
import FolderDeleteDialog from "./components/Folder/FolderDeleteDialog/FolderDeleteDialog";
import ProgressDialog from "./components/ProgressDialog/ProgressDialog";
import PassphraseEntryDialog from "./components/Passphrase/PassphraseEntryDialog/PassphraseEntryDialog";

import Port from "./lib/extension/port";
import Storage from "./lib/extension/storage";
import AppContext from './contexts/AppContext';
import ShareDialog from "./components/Share/ShareDialog";
import FolderMoveStrategyDialog from "./components/Folder/FolderMoveStrategyDialog/FolderMoveStrategyDialog";
import PropTypes from "prop-types";

class ReactExtension extends Component {
  constructor(props) {
    super(props);
    // @todo dependencies injection global style?
    Port.set(props.port);
    Storage.set(props.storage);
    this.state = this.getDefaultState();
    this.bindCallbacks();
    this.initEventHandlers();
  }

  async componentDidMount() {
    this.getUserSettings();
    this.rememberMeInfo();
    this.getResources();
    this.getFolders();
  }

  getDefaultState() {
    return {
      user: null,
      resources: null,
      rememberMeOptions: {},

      // passphrase dialog
      showPassphraseEntryDialog: false,
      passphraseRequestId: '',

      // Resource create / edit dialogs
      showResourceCreateDialog: false,
      resourceCreateDialogProps: {
        folderParentId: null
      },
      showPasswordEditDialog: false,
      passwordEditDialogProps: {
        id: null
      },

      // folder dialogs
      folder: {},
      showFolderCreateDialog: false,
      folderCreateDialogProps: {
        folderParentId: null
      },
      showFolderRenameDialog: false,
      showFolderDeleteDialog: false,
      showFolderMoveStrategyDialog: false,
      folderMoveStrategyProps: {
        requestId: null,
        folderId: null,
        foldersIds: [],
        resourcesIds: []
      },

      // share dialog
      showShareDialog: false,
      shareDialogProps: {
        resourcesIds: null
      },

      // progress dialog
      showProgressDialog: false,
      progressDialogProps: {},

      // error dialog
      showErrorDialog: false,
      errorDialogProps: {
        title: null,
        message: null
      },
    };
  }

  bindCallbacks() {
    this.handleStorageChange = this.handleStorageChange.bind(this);
    this.handleIsReadyEvent = this.handleIsReadyEvent.bind(this);
    this.handleErrorDialogOpenEvent = this.handleErrorDialogOpenEvent.bind(this);
    this.handleErrorDialogCloseEvent = this.handleErrorDialogCloseEvent.bind(this);
    this.handlePassphraseEntryRequestEvent = this.handlePassphraseEntryRequestEvent.bind(this);
    this.handlePassphraseDialogClose = this.handlePassphraseDialogClose.bind(this);
    this.handleProgressDialogOpenEvent = this.handleProgressDialogOpenEvent.bind(this);
    this.handleProgressDialogUpdateEvent = this.handleProgressDialogUpdateEvent.bind(this);
    this.handleProgressDialogUpdateGoalsEvent = this.handleProgressDialogUpdateGoalsEvent.bind(this);
    this.handleProgressDialogCloseEvent = this.handleProgressDialogCloseEvent.bind(this);
    this.handleResourceCreateDialogOpenEvent = this.handleResourceCreateDialogOpenEvent.bind(this);
    this.handleResourceCreateDialogCloseEvent = this.handleResourceCreateDialogCloseEvent.bind(this);
    this.handleResourceEditDialogOpenEvent = this.handleResourceEditDialogOpenEvent.bind(this);
    this.handleResourceEditDialogCloseEvent = this.handleResourceEditDialogCloseEvent.bind(this);
    this.handleFolderCreateDialogOpenEvent = this.handleFolderCreateDialogOpenEvent.bind(this);
    this.handleFolderCreateDialogCloseEvent = this.handleFolderCreateDialogCloseEvent.bind(this);
    this.handleFolderRenameDialogOpenEvent = this.handleFolderRenameDialogOpenEvent.bind(this);
    this.handleFolderRenameDialogCloseEvent = this.handleFolderRenameDialogCloseEvent.bind(this);
    this.handleFolderDeleteDialogOpenEvent = this.handleFolderDeleteDialogOpenEvent.bind(this);
    this.handleFolderDeleteDialogCloseEvent = this.handleFolderDeleteDialogCloseEvent.bind(this);
    this.handleFolderMoveStrategyRequestEvent = this.handleFolderMoveStrategyRequestEvent.bind(this);
    this.handleFolderMoveStrategyDialogCloseEvent = this.handleFolderMoveStrategyDialogCloseEvent.bind(this);
    this.handleShareDialogOpenEvent = this.handleShareDialogOpenEvent.bind(this);
    this.handleShareDialogCloseEvent = this.handleShareDialogCloseEvent.bind(this);
  }

  initEventHandlers() {
    Storage.get().onChanged.addListener(this.handleStorageChange);
    Port.get().on('passbolt.react-app.is-ready', this.handleIsReadyEvent);
    Port.get().on('passbolt.errors.open-error-dialog', this.handleErrorDialogOpenEvent);
    Port.get().on('passbolt.progress.open-progress-dialog', this.handleProgressDialogOpenEvent);
    Port.get().on("passbolt.progress.update", this.handleProgressDialogUpdateEvent);
    Port.get().on("passbolt.progress.update-goals", this.handleProgressDialogUpdateGoalsEvent);
    Port.get().on('passbolt.progress.close-progress-dialog', this.handleProgressDialogCloseEvent);
    Port.get().on('passbolt.resources.open-create-dialog', this.handleResourceCreateDialogOpenEvent);
    Port.get().on('passbolt.resources.open-edit-dialog', this.handleResourceEditDialogOpenEvent);
    Port.get().on('passbolt.folders.open-create-dialog', this.handleFolderCreateDialogOpenEvent);
    Port.get().on('passbolt.folders.open-rename-dialog', this.handleFolderRenameDialogOpenEvent);
    Port.get().on('passbolt.folders.open-delete-dialog', this.handleFolderDeleteDialogOpenEvent);
    Port.get().on('passbolt.share.open-share-dialog', this.handleShareDialogOpenEvent);

    // requests: dialogs that return responses to controllers
    Port.get().on('passbolt.passphrase.request', this.handlePassphraseEntryRequestEvent);
    Port.get().on('passbolt.folders.move-strategy.request', this.handleFolderMoveStrategyRequestEvent);
  }

  handleIsReadyEvent(requestId) {
    if (this.isReady()) {
      Port.get().emit(requestId, "SUCCESS");
    } else {
      Port.get().emit(requestId, "ERROR");
    }
  }

  isReady() {
    return this.state.user !== null;
  }

  async getResources() {
    const storageData = await Storage.get().local.get(["resources"]);
    if (storageData.resources && storageData.resources.length) {
      const resources = storageData.resources;
      this.setState({resources: resources});
    }
  }

  async getFolders() {
    const storageData = await Storage.get().local.get(["folders"]);
    if (storageData.folders && storageData.folders.length) {
      const folders = storageData.folders;
      this.setState({folders: folders});
    }
  }

  async getUserSettings() {
    const storageData = await Storage.get().local.get(["_passbolt_data"]);
    this.setState({user: storageData._passbolt_data.config});
  }

  handleStorageChange(changes) {
    if (changes.resources) {
      const resources = changes.resources.newValue;
      this.setState({resources: resources});
    }
    if (changes.folders) {
      const folders = changes.folders.newValue;
      this.setState({folders: folders});
    }
  }

  /*
   * =============================================================
   *  Generic error dialog events
   * =============================================================
   */

  async rememberMeInfo() {
    const rememberMeOptions = await Port.get().request('passbolt.site.settings.plugins.rememberMe');
    this.setState({rememberMeOptions: rememberMeOptions});
  }

  handleErrorDialogOpenEvent(title, message) {
    const errorDialogProps = {title: title, message: message};
    this.setState({showErrorDialog: true, errorDialogProps: errorDialogProps});
  }

  handleErrorDialogCloseEvent() {
    const defaultState = this.getDefaultState();
    this.setState({showErrorDialog: false, errorDialogProps: defaultState.errorDialogProps});
    Port.get().emit('passbolt.app.hide');
  }

  /*
   * =============================================================
   *  Passphrase  Events
   * =============================================================
   */

  handlePassphraseEntryRequestEvent(requestId) {
    this.setState({showPassphraseEntryDialog: true, passphraseRequestId: requestId});
  }

  handlePassphraseDialogClose() {
    const defaultState = this.getDefaultState();
    this.setState({showPassphraseEntryDialog: false, passphraseRequestId: defaultState.passphraseRequestId});
  }

  /*
   * =============================================================
   *  Progress dialog events
   * =============================================================
   */

  handleProgressDialogOpenEvent(title, goals, message) {
    const progressDialogProps = {title: title, message: message, goals: goals};
    this.setState({showProgressDialog: true, progressDialogProps: progressDialogProps});
  }

  handleProgressDialogUpdateEvent(message, completed) {
    const progressDialogProps = this.state.progressDialogProps;
    progressDialogProps.message = message || progressDialogProps.message;
    progressDialogProps.completed = completed;
    this.setState({progressDialogProps: progressDialogProps});
  }

  handleProgressDialogUpdateGoalsEvent(goals) {
    const progressDialogProps = this.state.progressDialogProps;
    progressDialogProps.goals = goals;
    this.setState({progressDialogProps: progressDialogProps});
  }

  handleProgressDialogCloseEvent() {
    const defaultState = this.getDefaultState();
    this.setState({showProgressDialog: false, progressDialogProps: defaultState.progressDialogProps});
  }

  /*
   * =============================================================
   *  Resource Dialogs Events
   * =============================================================
   */

  handleResourceCreateDialogOpenEvent(folderParentId) {
    const resourceCreateDialogProps = {folderParentId: folderParentId};
    this.setState({showResourceCreateDialog: true, resourceCreateDialogProps: resourceCreateDialogProps});
  }

  handleResourceCreateDialogCloseEvent() {
    const defaultState = this.getDefaultState();
    this.setState({showResourceCreateDialog: false, resourceCreateDialogProps: defaultState.resourceCreateDialogProps});
    Port.get().emit('passbolt.app.hide');
  }

  handleResourceEditDialogOpenEvent(id) {
    this.setState({showPasswordEditDialog: true, passwordEditDialogProps: {id: id}});
  }

  handleResourceEditDialogCloseEvent() {
    const defaultState = this.getDefaultState();
    this.setState({showPasswordEditDialog: false, passwordEditDialogProps: defaultState.passwordEditDialogProps});
    Port.get().emit('passbolt.app.hide');
  }

  /*
   * =============================================================
   *  Share Dialog Events
   * =============================================================
   */

  handleShareDialogOpenEvent(itemsToShare) {
    this.setState({showShareDialog: true, shareDialogProps: itemsToShare});
  }

  handleShareDialogCloseEvent() {
    const defaultState = this.getDefaultState();
    this.setState({showShareDialog: false, shareDialogProps: defaultState.shareDialogProps});
    Port.get().emit('passbolt.app.hide');
  }

  /*
   * =============================================================
   *  Folder Dialogs Events
   * =============================================================
   */

  handleFolderCreateDialogOpenEvent(folderParentId) {
    const folderCreateDialogProps = {folderParentId: folderParentId};
    this.setState({showFolderCreateDialog: true, folderCreateDialogProps: folderCreateDialogProps});
  }

  handleFolderCreateDialogCloseEvent() {
    const defaultState = this.getDefaultState();
    this.setState({showFolderCreateDialog: false, folderCreateDialogProps: defaultState.folderCreateDialogProps});
    Port.get().emit('passbolt.app.hide');
  }

  handleFolderRenameDialogOpenEvent(folderId) {
    const folder = {id: folderId};
    this.setState({showFolderRenameDialog: true, folder: folder});
  }

  handleFolderRenameDialogCloseEvent() {
    const defaultState = this.getDefaultState();
    this.setState({showFolderRenameDialog: false, folder: defaultState.folder});
    Port.get().emit('passbolt.app.hide');
  }

  handleFolderDeleteDialogOpenEvent(folderId) {
    const folder = {id: folderId};
    this.setState({showFolderDeleteDialog: true, folder: folder});
  }

  handleFolderDeleteDialogCloseEvent() {
    const defaultState = this.getDefaultState();
    this.setState({showFolderDeleteDialog: false, folder: defaultState.folder});
    Port.get().emit('passbolt.app.hide');
  }

  handleFolderMoveStrategyRequestEvent(requestId, folderId, foldersIds, resourcesIds) {
    this.setState({
      showProgressDialog: false,
      showFolderMoveStrategyDialog: true,
      folderMoveStrategyProps: {requestId: requestId, folderId: folderId, foldersIds: foldersIds, resourcesIds: resourcesIds}
    });
  }

  handleFolderMoveStrategyDialogCloseEvent() {
    const defaultState = this.getDefaultState();
    this.setState({
      showProgressDialog: true,
      showFolderMoveStrategyDialog: false,
      folderMoveStrategyProps: defaultState.folderMoveStrategyProps
    });
  }

  /*
   * =============================================================
   *  View
   * =============================================================
   */
  render() {
    const isReady = this.isReady();
    const areResourcesLoaded = this.state.resources && this.state.resources.length;

    return (
      <Router>
        <Route render={() => (
          <Route  path="/">
            <AppContext.Provider value={this.state}>
              {isReady &&
              <div id="app" className={`app ${isReady ? "ready" : ""}`} tabIndex="1000">
                {this.state.showResourceCreateDialog &&
                <PasswordCreateDialog onClose={this.handleResourceCreateDialogCloseEvent}
                  folderParentId={this.state.resourceCreateDialogProps.folderParentId}/>
                }
                {this.state.showPasswordEditDialog && areResourcesLoaded &&
                <PasswordEditDialog onClose={this.handleResourceEditDialogCloseEvent}
                  id={this.state.passwordEditDialogProps.id}/>
                }
                {this.state.showFolderCreateDialog &&
                <FolderCreateDialog onClose={this.handleFolderCreateDialogCloseEvent}
                  folderParentId={this.state.folderCreateDialogProps.folderParentId}/>
                }
                {this.state.showFolderMoveStrategyDialog &&
                <FolderMoveStrategyDialog onClose={this.handleFolderMoveStrategyDialogCloseEvent}
                  folderId={this.state.folderMoveStrategyProps.folderId}
                  foldersIds={this.state.folderMoveStrategyProps.foldersIds}
                  resourcesIds={this.state.folderMoveStrategyProps.resourcesIds}
                  requestId={this.state.folderMoveStrategyProps.requestId}
                />
                }
                {this.state.showFolderRenameDialog &&
                <FolderRenameDialog onClose={this.handleFolderRenameDialogCloseEvent} folderId={this.state.folder.id}/>
                }
                {this.state.showFolderDeleteDialog &&
                <FolderDeleteDialog onClose={this.handleFolderDeleteDialogCloseEvent} folderId={this.state.folder.id}/>
                }
                {this.state.showShareDialog &&
                <ShareDialog resourcesIds={this.state.shareDialogProps.resourcesIds}
                  foldersIds={this.state.shareDialogProps.foldersIds}
                  onClose={this.handleShareDialogCloseEvent} />
                }
                {
                  /*
                   * Hello traveller, leave these dialogs at the end
                   * so that they are displayed on top of your new dialog
                   */
                }
                {this.state.showProgressDialog &&
                <ProgressDialog title={this.state.progressDialogProps.title}
                  goals={this.state.progressDialogProps.goals}
                  message={this.state.progressDialogProps.message}
                  completed={this.state.progressDialogProps.completed} />
                }
                {this.state.showPassphraseEntryDialog &&
                <PassphraseEntryDialog requestId={this.state.passphraseRequestId}
                  onClose={this.handlePassphraseDialogClose}/>
                }
                {this.state.showErrorDialog &&
                <ErrorDialog title={this.state.errorDialogProps.title}
                  message={this.state.errorDialogProps.message}
                  onClose={this.handleErrorDialogCloseEvent}/>
                }
              </div>
              }
            </AppContext.Provider>
          </Route>
        )}/>
      </Router>
    );
  }
}

ReactExtension.contextType = AppContext;

ReactExtension.propTypes = {
  onClose: PropTypes.func,
  disabled: PropTypes.bool,
  port: PropTypes.object,
  storage: PropTypes.object,
};

export default ReactExtension;
