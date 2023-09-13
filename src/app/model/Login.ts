import {User} from "./User";
import {Authorisation} from "./Authorisation";

export class Login{
  status:string|null = null;
  user:User|null = null;
  authorisation: Authorisation|null = null;
  message:string|null = null;
}
