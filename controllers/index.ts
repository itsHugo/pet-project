import { controller as users } from './users';
import { controller as item  } from './items';

import { controller as auth } from './auth';

export namespace ControllerFactory {
    export let Users = users
    export let Auth = auth
    export let Item = item
}


