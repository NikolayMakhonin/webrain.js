import {ICollection} from "./ICollection";
import {IIterable} from "../../src/main/common/lists/IIterable";
import {ISet} from "./ISet";

export interface IList<T> extends ISet<T> {
    setSize(value: number, defaultValue?: T);
    insertAll<T2 extends T>(collection: ICollection<T2>, index: number): boolean;
    addAll<T2 extends T>(collection: IIterable<T2>): boolean;
}
