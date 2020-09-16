
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
import AddComment from "./AddComment";
import PropTypes from "prop-types";
import AppContext from "../../../contexts/AppContext";
import DisplayCommentList from "./DisplayCommentList";


class PasswordSidebarCommentSection extends React.Component {


    /**
     * Constructor
     * @param {Object} props
     */
    constructor(props) {
        super(props);
        this.state = this.getDefaultState();
        this.bindCallbacks();
    }

    /**
     * Get default state
     * @returns {*}
     */
    getDefaultState() {
        return {
            open: false, // Flag to determine the expand / collapse of the section
            canAdd: false,// Flag to determine the display of the "Add Comment" area,
            canAddByIcon: false, // Flag to determine the display of the "Add Icons"
            mustRefresh: false, // Flag to determine if the comment list must be refreshed
        };
    }


    /**
     * Bind callbacks methods
     */
    bindCallbacks() {
        this.handleTitleClickedEvent = this.handleTitleClickedEvent.bind(this);
        this.handleAddedEvent = this.handleAddedEvent.bind(this);
        this.handleCancelledAddEvent = this.handleCancelledAddEvent.bind(this);
        this.handleRequestedAddEvent = this.handleRequestedAddEvent.bind(this);
        this.handleFetchedEvent = this.handleFetchedEvent.bind(this);
    }


    /**
     * Whenever the user clicks on the section title
     */
    async handleTitleClickedEvent() {
        const open = !this.state.open;
        this.setState({open});
    }


    /**
     * Whenever the user added a new comment
     * @returns {Promise<void>}
     */
    async handleAddedEvent() {
        await this.setState({mustRefresh: true, canAdd: false, canAddByIcon: true});
    }

    /**
     * Whenever the user cancelled the adding of new comment
     */
    async handleCancelledAddEvent() {
        await this.setState({canAdd: false });
    }

    /**
     * Whenever the user requested to add a new comment ( call-to-action )
     */
    async handleRequestedAddEvent() {
        await this.setState({canAdd: true });
    }

    /**
     * Whenever the comments to display has been fetched
     * @param comments The fetched comments
     */
    async handleFetchedEvent(comments) {
        const hasComments = comments && comments.length > 0;
        await this.setState({mustRefresh: false, canAdd: !hasComments, canAddByIcon: hasComments});
    }

    /**
     * Render the component
     * @returns {JSX}
     */
    render() {
        return (
            <div className={`comments accordion sidebar-section ${this.state.open ? "" : "closed"}`}>
                <div className="accordion-header">
                    <h4>
                        <a
                            onClick={this.handleTitleClickedEvent}
                            role="button">
                            Comments
                        </a>
                    </h4>
                </div>
                { this.state.open &&
                    <div className="accordion-content">
                    {this.state.canAddByIcon &&
                    <a
                        className="section-action"
                        href="#"
                        onClick={this.handleRequestedAddEvent}>
                            <span className="svg-icon">
                                <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M1344 960v-128q0-26-19-45t-45-19h-256v-256q0-26-19-45t-45-19h-128q-26 0-45 19t-19 45v256h-256q-26 0-45 19t-19 45v128q0 26 19 45t45 19h256v256q0 26 19 45t45 19h128q26 0 45-19t19-45v-256h256q26 0 45-19t19-45zm320-64q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"/>
                                </svg>
                            </span>
                        <span className="visuallyhidden">Create</span>
                    </a>
                    }

                    { this.state.canAdd &&
                        <AddComment
                            resource={this.props.resource}
                            onAdd={this.handleAddedEvent}
                            onCancel={this.handleCancelledAddEvent}
                            cancellable={this.state.canAddByIcon}/>
                    }
                    <DisplayCommentList
                        resource={this.props.resource}
                        onFetch={this.handleFetchedEvent}
                        mustRefresh={this.state.mustRefresh}/>
                </div>
                }

            </div>
        );
    }

}

PasswordSidebarCommentSection.contextType = AppContext;

PasswordSidebarCommentSection.propTypes = {
    resource: PropTypes.object,
};

export default PasswordSidebarCommentSection;