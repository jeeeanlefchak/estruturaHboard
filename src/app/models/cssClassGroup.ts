import { Base } from "./base";

export class CssClassGroup extends Base{
    name: string;
    description: string;
    uid: string;
    parentId: number;
    parent: CssClassGroup;
}
