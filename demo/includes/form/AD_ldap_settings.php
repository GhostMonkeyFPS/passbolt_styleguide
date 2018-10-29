<?
$edit = isset($_GET['ldap_settings']['edit']) && $_GET['ldap_settings']['edit'];
$disabledAttribute = !$edit ? 'disabled="disabled"' : '';
$enabled = isset($_GET['ldap_settings']['enabled']) && $_GET['ldap_settings']['enabled'];
?>
<h3><span class="input toggle-switch">
    <input class="toggle-switch-checkbox checkbox" id="ldap-enable" type="checkbox" <?= $enabled ? 'checked="true"': '' ?> <?=$disabledAttribute?>>
    <label class="toggle-switch-button" for="provider_yubikey"></label>
</span><label for="provider_yubikey">Users Directory</label></h3>
<p class="description enabled">
    A Users Directory is configured. The users and groups of passbolt are synchronise with it.
</p>
<p class="description disabled">
    No Users Directory is configured. Enable it to synchronise your users and groups with passbolt.
</p>

<div class="form-content">
    <h3>Credentials</h3>
    <div class="radiolist">
        <label>Directory type</label>
        <div class="input radio">
            <input name="data[User][field]" value="1" id="UserField1" type="radio" checked="checked" <?=$disabledAttribute?>>
            <label for="UserField1">Active Directory</label>
        </div>
        <div class="input radio">
            <input name="data[User][field]" value="2" id="UserField2" type="radio" <?=$disabledAttribute?>>
            <label for="UserField2">Open Ldap</label>
        </div>
    </div>
    <div class="input text">
        <label>Domain</label>
        <input type="text" class="required fluid" placeholder="domain.ext" <?=$disabledAttribute?>>
    </div>
    <div class="singleline connection_info protocol_host_port clearfix">
        <label>Server url</label>
        <div class="input text field_protocol_host">
            <div class="input text protocol">
                <select name="data[ldap][connection_type]" class="required fluid" id="ConnectionProtocol" required="required" <?=$disabledAttribute?>>
                    <option value="1">ldap://</option>
                    <option value="2">ldaps:// (ssl)</option>
                    <option value="3">ldaps:// (tls)</option>
                </select>
            </div>
            <div class="input text host">
                <input type="text" class="required fluid" placeholder="host or ip" <?=$disabledAttribute?>>
            </div>
        </div>
        <div class="input text port">
            <input type="number" class="required fluid" placeholder="port" value="389" <?=$disabledAttribute?>>
        </div>
    </div>
    <div class="singleline clearfix">
        <div class="input text first-field">
            <label>Username</label>
            <input type="text" class="required fluid" placeholder="username" <?=$disabledAttribute?>>
        </div>
        <div class="input text last-field">
            <label>Password</label>
            <input type="password" class="required fluid" placeholder="password" <?=$disabledAttribute?>>
        </div>
    </div>
    <div class="input text">
        <label>Base DN</label>
        <input type="text" class="required fluid" placeholder="OU=OrgUsers,DC=mydomain,DC=local" <?=$disabledAttribute?>>
        <div class="message">The base DN (default naming context) for the domain. If this is empty then it will be queried from the RootDSE.</div>
    </div>

    <h3>Directory configuration</h3>
    <div class="input text">
        <label>Group path</label>
        <input type="text" class="required fluid" placeholder="Group Path" <?=$disabledAttribute?>>
        <div class="message">Group path is used in addition to the base DN while searching groups.</div>
    </div>
    <div class="input text">
        <label>User path</label>
        <input type="text" class="required fluid" placeholder="User Path" <?=$disabledAttribute?>>
        <div class="message">User path is used in addition to base DN while searching users.</div>
    </div>
    <div class="input text">
        <label>Group object class</label>
        <input type="text" class="required fluid" placeholder="GroupObjectClass" <?=$disabledAttribute?>>
        <div class="message">For Openldap only. Defines which group object to use. (Default: posixGroup)</div>
    </div>
    <div class="input text">
        <label>User object class</label>
        <input type="text" class="required fluid" placeholder="UserObjectClass" <?=$disabledAttribute?>>
        <div class="message">For Openldap only. Defines which user object to use. (Default: inetOrgPerson)</div>
    </div>

    <h3>Synchronization options</h3>
    <div class="input text">
        <label>Default admin</label>
        <select name="data[ldap][defaultUser]" class="required fluid" id="DefaultUser" required="required" <?=$disabledAttribute?>>
            <option value="1">admin@passbolt.com</option>
            <option value="2">ada@passbolt.com</option>
            <option value="3">lynne@passbolt.com</option>
        </select>
        <div class="message">The default admin user is the admin user that will perform the operations for the the directory.</div>
    </div>
    <div class="input text">
        <label>Default group admin</label>
        <select name="data[ldap][defaultGroupAdminUser]" class="required fluid" id="DefaultGroupAdminUser" required="required" <?=$disabledAttribute?>>
            <option value="1">admin@passbolt.com</option>
            <option value="2">ada@passbolt.com</option>
            <option value="3">lynne@passbolt.com</option>
            <option value="3">frances@passbolt.com</option>
            <option value="3">danna@passbolt.com</option>
        </select>
        <div class="message">The default group admin user is the admin user that will be the group manager of newly created group.</div>
    </div>

    <div class="input text">
        <label>Sync operations</label>
        <div class="col6">
            <div class="input toggle-switch">
                <label for="create_users">Create users</label>
                <input class="toggle-switch-checkbox checkbox" id="create_users" type="checkbox" checked="checked" <?=$disabledAttribute?>>
                <label class="toggle-switch-button" for="create_users"></label>
            </div>
            <div class="input toggle-switch">
                <label for="delete_users">Delete users</label>
                <input class="toggle-switch-checkbox checkbox" id="delete_users" type="checkbox" checked="checked" <?=$disabledAttribute?>>
                <label class="toggle-switch-button" for="delete_users"></label>
            </div>
        </div>
        <div class="col6 last">
            <div class="input toggle-switch">
                <label for="create_groups">Create groups</label>
                <input class="toggle-switch-checkbox checkbox" id="create_groups" type="checkbox" checked="checked" <?=$disabledAttribute?>>
                <label class="toggle-switch-button" for="create_groups"></label>
            </div>
            <div class="input toggle-switch">
                <label for="delete_groups">Delete groups</label>
                <input class="toggle-switch-checkbox checkbox" id="delete_groups" type="checkbox" checked="checked" <?=$disabledAttribute?>>
                <label class="toggle-switch-button" for="delete_groups"></label>
            </div>
            <div class="input toggle-switch">
                <label for="update_group_memberships">Update group memberships</label>
                <input class="toggle-switch-checkbox checkbox" id="update_group_memberships" type="checkbox" checked="checked" <?=$disabledAttribute?>>
                <label class="toggle-switch-button" for="update_group_memberships"></label>
            </div>
        </div>
    </div>
</div>
<script type="application/javascript">
    let disabled = <?= $enabled == 1 ? 'false' : 'true' ?>;
    $('.toggle-switch-button').on('click', () => {
        disabled = !disabled;
        $('.ldap-settings').toggleClass('enabled');
        $('.toggle-switch-checkbox').attr('checked', !disabled);
    });
</script>