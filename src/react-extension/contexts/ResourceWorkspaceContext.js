
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



import * as React from "react";
import PropTypes from "prop-types";
import AppContext from "./AppContext";
import {withRouter} from "react-router-dom";


/**
 * Context related to resources ( filter, current selections, etc.)
 */
export const ResourceWorkspaceContext = React.createContext({
    filter: {
        type: null, // Filter type
        payload: null // Filter payload
    },
    filteredResources: [], // The current list of filtered resources
    details: {
        resource: null, // The resource to focus details on
        folder: null,// The folder to focus details on
    },
    onTextFilterChanged: () => {}, // Whenever the search text filter changed
    onAllFilterRequired: () => {}, // filter on all required
    onFilterTagChanged: () => {} // filter by tag
});

/**
 * The related context provider
 */
class ResourceWorkspaceContextProvider extends React.Component {

    /**
     * Default constructor
     * @param props The component props
     */
    constructor(props) {
        super(props);
        this.state = this.defaultState;
        this.initializeProperties();
    }


    /**
     * Returns the default component state
     */
    get defaultState() {
        return {
            filter: { type: ResourceWorkspaceFilterTypes.NONE }, // The current resource search filter
            filteredResources: [], // The current list of filtered resources
            details: {
                resource: null, // The resource to focus details on
                folder: null,// The folder to focus details on
            },
            onTextFilterChanged: this.handleTextFilterChange.bind(this), // Whenever the search text filter changed
            onAllFilterRequired: this.handleAllFilterRequired.bind(this), // filter on all required
            onFilterTagChanged: this.handleFilterTagChanged.bind(this), // filter by tag
        }
    }




    /**
     * Initialize class properties out of the state ( for performance purpose )
     */
    initializeProperties() {
        this.resources = []; // A cache of the last known list of resources from the App context
    }

    /**
     * Whenever the component is mounted
     */
    componentDidMount() {
        this.populate();
    }


    /**
     * Whenever the component has updated in terms of props or state
     * @param prevProps
     */
    async componentDidUpdate(prevProps, prevState) {
        await this.handleFilterChange(prevState.filter)
        await this.handleResourcesChange();
        await this.handleRouteChange(prevProps.location);
    }

    /**
     * Handles the resource search filter change
     */
    handleFilterChange(previousFilter) {
        const hasFilterChanged = previousFilter !== this.state.filter;
        if (hasFilterChanged) {
            this.populate();
        }
    }

    /**
     * Handles the resource search text filter change
     * @param text The filter text
     */
    async handleTextFilterChange(text) {
        await this.search({type: ResourceWorkspaceFilterTypes.TEXT, payload: text});
        await this.detailNothing();
    }

    /**
     * Handle the resources changes
     */
    async handleResourcesChange() {
        // We check the equality of the context resources and its last known value through the resources identifiers
        const localResourcesIdsAsSet = new Set(this.resources.map(resource => resource.id));
        const areResourcesChanged = ! this.context.resources.every(resource => localResourcesIdsAsSet.has(resource.id));

        if (areResourcesChanged) {
            this.resources = this.context.resources;
            await this.search(this.state.filter);
        }
    }

    /**
     * Handle the route location change
     * @param previousLocation Previous router location
     */
    async handleRouteChange(previousLocation) {
        const hasLocationChanged = this.props.location.key !== previousLocation.key;
        const isAppFirstLoad = this.state.filter.type === ResourceWorkspaceFilterTypes.NONE;
        if (hasLocationChanged || isAppFirstLoad) {
            await this.handleFolderRouteChange();
            await this.handleResourceRouteChange();
        }
    }

    /**
     * Handle the folder view route change
     * E.g. /folder/view.:filterByFolderId
     */
    async handleFolderRouteChange() {
        const folderId = this.props.match.params.filterByFolderId;
        if (folderId) {
            const folder = this.context.folders.find(folder => folder.id === folderId);
            await this.search({type: ResourceWorkspaceFilterTypes.FOLDER, payload: {folder}});
            await this.detailFolder(folder);
        }
    }

    /**
     * Handle the resource view route change
     */
    async handleResourceRouteChange() {
        const isResourceLocation = this.props.location.pathname.includes('passwords');
        const resourceId = this.props.match.params.selectedResourceId;
        const isTextFilter = this.state.filter.type === ResourceWorkspaceFilterTypes.TEXT;
        if (isResourceLocation) {
            if (resourceId) { // Case of password view
               this.handleSingleResourceRouteChange(resourceId);
            } else if (!isTextFilter) { // Case of all
                this.handleAllResourceRouteChange();
            }
            // Case of text filter, so filter has already been performed
        }
    }

    /**
     * Handle the resource view route change with a resource id
     * E.g. /password/view/:resourceId
     */
    async handleSingleResourceRouteChange(resourceId) {
        const resource = this.resources.find(resource => resource.id === resourceId);
        const hasNoneFilter = this.state.filter.type === ResourceWorkspaceFilterTypes.NONE;
        if (hasNoneFilter) { // Case of password view by url bar inputting
            await this.search({type: ResourceWorkspaceFilterTypes.ALL});
        }
        await this.detailResource(resource);
    }

    /**
     * Handle the resource view route change without a resource id in the path
     * E.g. /password
     */
    async handleAllResourceRouteChange() {
        await this.search({type: ResourceWorkspaceFilterTypes.ALL});
        await this.detailNothing();
    }

    /**
     * Handle the filter by all is required
     */
    async handleAllFilterRequired() {
        const filter = {
            type: ResourceWorkspaceFilterTypes.ALL,
            payload: null
        }
        await this.search(filter);
        await this.detailNothing();
    }

    /**
     * Handle the filter by tag
     * @param tag
     */
    async handleFilterTagChanged(tag) {
        const filter = {
            type: ResourceWorkspaceFilterTypes.TAG,
            payload: {
                tag : tag
            }
        }
        await  this.search(filter);
        await  this.detailNothing();
    }

    /**
     * Populate the context with initial data such as resources and folders
     */
    populate() {
        this.context.port.request("passbolt.plugin.folders.update-local-storage");
        this.context.port.request("passbolt.plugin.resources.update-local-storage");
    }

    /**
     * Search for the resources which matches the given filter
     * @param filter
     */
    async search(filter) {
        const searchOperations = {
            [ResourceWorkspaceFilterTypes.FOLDER]: this.searchByFolder.bind(this),
            [ResourceWorkspaceFilterTypes.TAG]: this.searchByTag.bind(this),
            [ResourceWorkspaceFilterTypes.TEXT]: this.searchByText.bind(this),
            [ResourceWorkspaceFilterTypes.ALL]: this.searchAll.bind(this),
            [ResourceWorkspaceFilterTypes.NONE]: () => {/* No search */}
        }
        await searchOperations[filter.type](filter);
    }

    /**
     * All filter ( no filter at all )
     * @param filter The All filter
     */
    async searchAll(filter) {
        await this.setState({filter, filteredResources: [...this.resources]});
    }

    /**
     * Filter the resources which belongs to the filter folder
     */
    async searchByFolder(filter) {
        const folderId = filter.payload.folder.id;
        const folderResources = this.resources.filter(resource => resource.folder_parent_id === folderId);
        await this.setState({filter, filteredResources: folderResources});
    }

  /**
   * Filter the resources which belongs to the filter tag
   */
  async searchByTag(filter) {
    const tagId = filter.payload.tag.id;
    const tagResources = this.resources.filter(resource => resource.tags && resource.tags.length > 0 && resource.tags.filter(tag => tag.id === tagId).length > 0);
    await this.setState({filter, filteredResources: tagResources});
  }

    /**
     * Filter the resources which textual properties matched some user text words
     */
    async searchByText(filter) {
        const text = filter.payload;
        const words =  ( text && text.split(/\s+/) ) || [''];

        // Test match of some escaped test words against the name / usernmae / uri / description resource properties
        const escapeWord = word =>  word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const wordToRegex = word =>  new RegExp(escapeWord(word), 'i');
        const matchSomeWords = value => words.some( word => wordToRegex(word).test(value));
        const matchText = resource => ['name', 'username', 'uri', 'description'].some( key => matchSomeWords(resource[key]));
        const filteredResources = this.resources.filter(matchText);
        await this.setState({filter, filteredResources});
    }

    /**
     * Set the details focus on the given folder
     * @param folder The folder to focus on
     */
    async detailFolder(folder) {
        await this.setState({details: {folder:folder, resource: null}});
    }

    /**
     * Set the details focus on the given resource
     * @param resource The resource to focus on
     */
    async detailResource(resource) {
        await this.setState({details: {folder:null, resource: resource}});
    }

    /**
     * Remove the details on something
     */
    async detailNothing() {
        await this.setState({details: {folder:null, resource: null}});
    }

    /**
     * Render the component
     * @returns {JSX}
     */
    render() {
        return (
            <ResourceWorkspaceContext.Provider value={this.state}>
                {this.props.children}
            </ResourceWorkspaceContext.Provider>
        )
    }

}
ResourceWorkspaceContextProvider.displayName = 'ResourceWorkspaceContextProvider';
ResourceWorkspaceContextProvider.contextType = AppContext;
ResourceWorkspaceContextProvider.propTypes = {
    children: PropTypes.any,
    location: PropTypes.object,
    match: PropTypes.object
};

export default withRouter(ResourceWorkspaceContextProvider);


/**
 * Resource Workspace Context Consumer HOC
 * @param WrappedComponent
 */
export function withResourceWorkspace(WrappedComponent) {

    return class WithResourceWorkspace extends React.Component {
        render() {
            return (
                <ResourceWorkspaceContext.Consumer>
                    {
                        ResourceWorkspaceContext => <WrappedComponent resourceWorkspaceContext={ResourceWorkspaceContext} {...this.props} />
                    }
                </ResourceWorkspaceContext.Consumer>
            )
        }

    }
}

/**
 * The list of resource workspace search filter types
 */
export const ResourceWorkspaceFilterTypes = {
    NONE: 'NONE', // Initial filter at page load
    ALL: 'ALL', // All resources
    FOLDER: 'FILTER-BY-FOLDER', // Resources for a given folder
    TAG: 'FILTER-BY-TAG', // Resources for a given tag
    TEXT: 'FILTER-BY-TEXT-SEARCH'// Resources matching some text words
}

