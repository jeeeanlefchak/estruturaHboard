import { Base } from "./base";
import { CssClassGroup } from "./cssClassGroup";

export class CssClass extends Base {
    name: string;
    description: string;
    content: string;
    groupId: number;
    group: CssClassGroup;
}
