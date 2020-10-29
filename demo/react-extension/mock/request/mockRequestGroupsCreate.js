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
 * @since         3.0.0
 */

import {v4 as uuidv4} from "uuid";
import moment from 'moment/moment';

export default (groupDto, storage) => {
  return new Promise(async (resolve) => {
    const {groups} = await storage.local.get(["groups"]);
    groupDto.id = uuidv4();
    groupDto.created = moment().format("YYYY-MM-DD[T]HH:mm:ss[+]00:00");
    groupDto.created_by = "f848277c-5398-58f8-a82a-72397af2d450";
    groupDto.modified = moment().format("YYYY-MM-DD[T]HH:mm:ss[+]00:00");
    groupDto.modified_by = "f848277c-5398-58f8-a82a-72397af2d450";
    groupDto.groups_users.forEach(groupUser => {
      groupUser.id = groupUser.id || uuidv4();
    });
    groups.push(groupDto);
    await storage.local.set({groups});
    resolve(groupDto);
  });
};
