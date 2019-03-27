import {IIterable} from "../../src/main/common/lists/IIterable";

export interface ICollection<T> extends IIterable<T> {
    add(item: T): boolean;
    remove(item: T): boolean;
    size(): number;
    contains(item: T): boolean;
    clear();
}
