import { IUser } from "src/user/dto/user.interface";

export class JwtPayload implements IUser {
    id: number;
    email: string;
    name: string;
    verified: boolean;

    constructor(id: number, email: string, name: string, verified: boolean) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.verified = verified;
    }

    toPlainObject(): object {
        return Object.assign({}, this);
    }
}