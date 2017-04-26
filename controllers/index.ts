import { controller as users } from './users';
import { controller as item  } from './items';
import { controller as categories} from './categories';
import { controller as auth } from './auth';
import { controller as client_item} from "./client/itemsClient"

export namespace ControllerFactory {
    export let Users = users
    export let Auth = auth
    export let Item = item
    export let Caterogies = categories;
    export let ClientItems = client_item
}


