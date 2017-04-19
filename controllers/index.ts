import { controller as users } from './users';
import { controller as auth } from './auth';

export namespace ControllerFactory {
    export let Users = users
    export let Auth = auth
}


