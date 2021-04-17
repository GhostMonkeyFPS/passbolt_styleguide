/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         2.13.0
 */

import React from "react";
import PropTypes from "prop-types";
import AppContext from "../../../contexts/AppContext";
import UserAvatar from "../../Common/Avatar/UserAvatar";
import DeleteComment from "../DeleteResourceComment/DeleteComment";
import {Trans, withTranslation} from "react-i18next";
import {DateTime} from "luxon";

class DisplayResourceCommentList extends React.Component {
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
      comments: [], // The list of comments to display
      actions: { // The ongoing action
        loading: false, // A loading action
      }
    };
  }

  /**
   * Whenever the component has been mounted
   */
  async componentDidMount() {
    await this.fetch();
  }

  /**
   * Whenever the component props or state change
   * @param prevProps Previous props value
   */
  componentDidUpdate(prevProps) {
    this.checkRefresh(prevProps.mustRefresh);
  }

  /**
   * Fetch the comments of the resource
   */
  async fetch() {
    await this.setState({actions: {loading: true}});

    const resourceId = this.props.resource.id;
    const comments = await this.context.port.request('passbolt.comments.find-all-by-resource', resourceId);

    const commentsSorter = (comment1, comment2) => DateTime.fromISO(comment2.created) < DateTime.fromISO(comment1.created) ? -1 : 1;
    await this.setState({comments: comments.sort(commentsSorter)});

    this.props.onFetch(comments);

    await this.setState({actions: {loading: false}});
  }

  /**
   * Check if the comment list must be refreshed
   * @param previousValue The previous props value of the mustRefresh flag
   */
  checkRefresh(previousValue) {
    // Either refresh comes from parent or from the application context
    const mustRefresh = (this.props.mustRefresh && !previousValue) || this.context.mustRefreshComments;
    if (mustRefresh) {
      this.fetch();
    }

    if (this.context.mustRefreshComments) {
      this.context.setContext({mustRefreshComments: false});
    }
  }

  /**
   * Returns true if the givne comment can be deleted
   * @param comment A comment
   */
  canDeleteComment(comment) {
    return this.isOwner(comment);
  }

  /**
   * Returns true if the the comment owner is the current logged in user
   * @param comment A comment
   */
  isOwner(comment) {
    const isOwner = this.context.loggedInUser.id === comment.created_by;
    return isOwner;
  }

  /**
   * Get the translate function
   * @returns {function(...[*]=)}
   */
  get translate() {
    return this.props.t;
  }

  /**
   * Render the component
   * @returns {JSX}
   */
  render() {
    return (
      <>
        {!this.state.actions.loading &&
        <ul>
          {
            this.state.comments.map((comment, index) => (
              <li
                key={index}
                className="comment">

                <div className="wrap-right-column">
                  <div className="right-column">
                    <p> {comment.content} </p>
                    <div className="metadata">
                      {this.isOwner(comment) &&
                      <span className="author username">
                        <Trans>You</Trans>
                      </span>
                      }
                      {!this.isOwner(comment) &&
                      <span className="author username">
                        {comment.creator.profile.first_name} {comment.creator.profile.last_name}
                      </span>
                      }
                      <span
                        className="modified">{DateTime.fromISO(comment.created).toRelative({locale: this.props.i18n.lng})}
                      </span>
                    </div>
                    <div className="actions">
                      <ul>
                        <li>
                          {this.canDeleteComment(comment) &&
                          <DeleteComment commentId={comment.id}/>
                          }
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="left-column">
                  <UserAvatar
                    user={comment.creator}
                    baseUrl={this.context.siteSettings.settings.app.url}
                    className="author profile picture avatar"/>
                </div>

              </li>
            ))
          }
        </ul>
        }
        {this.state.actions.loading &&
        <div className="processing-wrapper">
          <span className="processing-text"><Trans>Retrieving comments</Trans></span>
        </div>
        }
      </>
    );
  }
}

export default withTranslation('common')(DisplayResourceCommentList);

DisplayResourceCommentList.contextType = AppContext;

DisplayResourceCommentList.propTypes = {
  resource: PropTypes.object, // The resource from which the comments will be provided
  onFetch: PropTypes.func, // Callback when the comments are fetched
  mustRefresh: PropTypes.bool, // Flag to force the refresh of the list
  t: PropTypes.func, // The translation function
  i18n: PropTypes.any // The i18n context translation
};