import {Uuid} from "~/common--type-definitions/typeDefinitions";

export enum AccountsPages {
    googleSignIn = "sign-in",
    googleSignUp = "sign-up",
}

export type User = {
    id: Uuid;
    email: string;
    profilePicture: string;
}
