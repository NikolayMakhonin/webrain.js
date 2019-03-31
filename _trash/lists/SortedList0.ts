/// <reference path="ArrayUtils.ts" />
/// <reference path="../Exceptions.ts" />
/// <reference path="../Events/EventHandler.ts" />
/// <reference path="CollectionChangedEventArgs.ts" />
/// <reference path="../Strings/StringUtils.ts" />
/// <reference path="Queue.ts" />
/// <reference path="ISortedCollection.ts" />
/// <reference path="ICollectionChangedList.ts" />

import EventHandler = utils.Events.EventHandler;
import IEventHandler = utils.Events.IEventHandler;
import {ISortedCollection} from "./ISortedCollection";

export class SortedList<T> implements ICollectionChangedList<T>, ISortedCollection {
    private _notAddIfExists: boolean = false;

    getNotAddIfExists(): boolean { return this._notAddIfExists; }

    setNotAddIfExists(value: boolean) { this._notAddIfExists = value; }

    private static RESIZE_COEF = 2.0;
    private static RESIZE_COEF_2 = SortedList.RESIZE_COEF * SortedList.RESIZE_COEF;
    private _list: T[];
    private _comparator: List.IComparator<T>;
    private _countSorted: number = 0;
    private _defaultValue: T;

    countSorted(): number { return this._countSorted; }

    private _autoSort: boolean = false;

    getAutoSort(): boolean { return this._autoSort; }

    setAutoSort(value: boolean) {
        if (this._autoSort === value) return;
        this._autoSort = value;
    }

    private compare = (o1: T, o2: T): number => {
        if (this._comparator != undefined) return this._comparator(o1, o2);
        return CompareUtils.CompareObjects(o1, o2);
    }

    getComparator(): List.IComparator<T> { return this._comparator; }

    setComparator<T2 extends T>(value: List.IComparator<T2>) {
        if (this._comparator === value) return;
        if (value != null || this._comparator != null) {
            this._countSorted = 0;
        }
        this._comparator = value;
    }

    constructor(autoSort: boolean = false, notAddIfExists: boolean = false, list?: T[], comparator?: List.IComparator<T>, defaultValue?: T) {
        this._autoSort = autoSort;
        this._notAddIfExists = notAddIfExists;
        this._comparator = comparator;
        this._defaultValue = defaultValue;
        if (list != null) {
            if (this._notAddIfExists) {
                var listCopy = list.copyOf<T>();
                list.clear();
                this._list = list;
                this.addAll(listCopy);
            } else this._list = list;
        } else this._list = [];
    }

    private _collectionChanged: EventHandler<CollectionChangedEventArgs<T>> = new EventHandler<CollectionChangedEventArgs<T>>();

    collectionChanged(): IEventHandler<CollectionChangedEventArgs<T>> { return this._collectionChanged; }

    //private _queueCollectionChanged = new mika.utils.List.Queue<CollectionChangedEventArgs<T>>();
    //private _queueCollectionChangedHandling: boolean = false;

    private OnCollectionChanged(eventArgs: CollectionChangedEventArgs<T>) {
        this._collectionChanged.invoke(this, eventArgs);
        //this._queueCollectionChanged.enqueue(eventArgs);
        //if (this._queueCollectionChangedHandling) return;
        //this._queueCollectionChangedHandling = true;
        //while (this._queueCollectionChanged.size() > 0) {
        //    var queueEventArgs = this._queueCollectionChanged.dequeue();
        //    this._collectionChanged.invoke(this, queueEventArgs);
        //}
        //this._queueCollectionChangedHandling = false;
    }

    size(): number { return this._list.length; }

    setSize(value: number, defaultValue?: T) { this.setSizePrivate(value, defaultValue); }

    private setSizePrivate(value: number, defaultValue?: T, enableCollectionChanged: boolean = true) {
        var oldCount = this._list.length;
        if (defaultValue === undefined) defaultValue = this._defaultValue;
        if (value < this._countSorted) this._countSorted = value;

        var removedList;
        if (value < oldCount) {
            if (enableCollectionChanged && this._collectionChanged.count() > 0) {
                removedList = this._list.copyOf<T>(value, oldCount - value);
            }
        }

        if (value > this._list.length) this._list[value - 1] = defaultValue;
        else if (value < this._list.length) this._list.splice(value, this._list.length - value);

        if (removedList != null) {
            this.OnCollectionChanged(new CollectionChangedEventArgs<T>(CollectionChangedType.Removed, value, -1, removedList, null));
        }

        if (value > oldCount) {
            if (defaultValue !== undefined) this._list.fill(defaultValue, oldCount, value - oldCount);
            if (enableCollectionChanged && this._collectionChanged.count() > 0) {
                var addedList = this._list.copyOf<T>(oldCount, value - oldCount);
                this.OnCollectionChanged(new CollectionChangedEventArgs<T>(CollectionChangedType.Added, -1, oldCount, null, addedList));
            }
        }
    }

    private binarySearch(startIndex: number, length: number, item: T): number { return this._list.binarySearch(item, this.compare, startIndex, length); }

    indexOf(item: T): number {
        if (this._autoSort) this.sort();
        var index = this.binarySearch(0, this._countSorted, item);
        if (index < 0 && this._countSorted < this._list.length) {
            for (var i = this._countSorted; i < this._list.length; i++) {
                var item2 = this._list[i];
                var Comparatoresult = this.compare(item, item2);
                if (Comparatoresult === 0) return i;
            }
        }
        return index;
    }

    insert(index: number, item: T): boolean {
        if (this._autoSort) {
            return this.add(item);
        }
        if (this._notAddIfExists && this.contains(item)) return false;
        if (index < this._countSorted) this._countSorted = index;
        this.insertPrivate(index, item);
        return true;
    }

    private insertPrivate(index: number, item: T) {
        this._list.splice(index, 0, item);
        if (this._collectionChanged.count() > 0) {
            if (index < this._list.length - 1) this.OnCollectionChanged(new CollectionChangedEventArgs<T>(CollectionChangedType.Shift, index, index + 1, null, null));
            this.OnCollectionChanged(new CollectionChangedEventArgs<T>(CollectionChangedType.Added, -1, index, null, [item]));
        }
    }

    remove(item: T): boolean {
        var i = this.indexOf(item);
        if (i >= 0) this.removeAtPrivate(i);
        return i >= 0;
    }

    removeAt(index: number): T {
        if (index >= this._list.length) throw new IllegalArgumentException("SortedList: this.index({0}) >= this.count({1})".format(index, this._list.length));
        if (this._autoSort) this.sort();
        return this.removeAtPrivate(index);
    }

    private removeAtPrivate(index: number): T {
        var oldItem = this._list[index];
        this._list.splice(index, 1);
        if (index < this._countSorted) this._countSorted--;
        if (this._collectionChanged.count() > 0) {
            this.OnCollectionChanged(new CollectionChangedEventArgs<T>(CollectionChangedType.Removed, index, -1, [oldItem], null));
            if (index < this._list.length) this.OnCollectionChanged(new CollectionChangedEventArgs<T>(CollectionChangedType.Shift, index + 1, index, null, null));
        }
        return oldItem;
    }

    get(index: number): T {
        if (index >= this._list.length) throw new IllegalArgumentException("SortedList: this.index({0}) >= this.count({1})".format(index, this._list.length));
        if (this._autoSort) this.sort();
        return this._list[index];
    }

    set(index: number, value: T): T {
        if (index >= this._list.length) throw new IllegalArgumentException("SortedList: this.index({0}) >= this.count({1})".format(index, this._list.length));
        if (this._autoSort) this.sort();
        var oldItem = this._list[index];
        if (this._autoSort || this._notAddIfExists) {
            var i = this.indexOf(value);
            if (i < 0) {
                i = ~i;
                if (i > index) i--;
            } else if (this._notAddIfExists && i !== index) {
                var existsValue = this._list[i];
                this.removeAtPrivate(index);
                return existsValue;
            }
            this._list[index] = value;
            if (this._collectionChanged.count() > 0) this.OnCollectionChanged(new CollectionChangedEventArgs<T>(CollectionChangedType.Setted, index, index, [oldItem], [value]));
            if (this._autoSort) {
                this.movePrivate(index, i);
                if (index < this._countSorted && i >= this._countSorted) this._countSorted--;
                if (index !== i && this._collectionChanged.count() > 0) this.OnCollectionChanged(new CollectionChangedEventArgs<T>(CollectionChangedType.Moved, index, i, null, [value]));
            } else {
                if (index < this._countSorted) this._countSorted = index;
            }
        } else {
            this._list[index] = value;
            if (index < this._countSorted) this._countSorted = index;
            if (this._collectionChanged.count() > 0) this.OnCollectionChanged(new CollectionChangedEventArgs<T>(CollectionChangedType.Setted, index, index, [oldItem], [value]));
        }

        return value;
    }

    move(oldIndex: number, newIndex: number): boolean {
        if (this._autoSort) {
            console.error("SortedList", "Попытка переместить объект в сортированной коллекции");
            return false;
        }
        if (this.movePrivate(oldIndex, newIndex)) {
            if (oldIndex !== newIndex && this._collectionChanged.count() > 0) this.OnCollectionChanged(new CollectionChangedEventArgs<T>(CollectionChangedType.Moved, oldIndex, newIndex, null, [this._list[newIndex]]));
            return true;
        }
        return false;
    }

    private movePrivate(oldIndex: number, newIndex: number): boolean {
        if (oldIndex === newIndex) return true;
        if (oldIndex < 0) {
            console.error("SortedList", "oldIndex < 0");
            return false;
        }
        if (oldIndex >= this._list.length) {
            console.error("SortedList", "oldIndex >= count");
            return false;
        }
        if (newIndex < 0) newIndex = 0;
        if (newIndex >= this._list.length) newIndex = this._list.length - 1;
        var moveObject = this._list[oldIndex];
        var step = (newIndex > oldIndex) ? 1 : -1;
        for (var i = oldIndex; i !== newIndex; i += step) this._list[i] = this._list[i + step];
        this._list[newIndex] = moveObject;
        return true;
    }

    add(item: T): boolean {
        if (this._notAddIfExists || this._autoSort) {
            var i = this.indexOf(item);
            if (i < 0) i = ~i;
            else if (this._notAddIfExists) return false;
            if (this._autoSort) this._countSorted++;
            this.insertPrivate((this._autoSort) ? i : this._list.length, item);
            return true;
        }
        this.insertPrivate(this._list.length, item);
        return true;
    }

    insertAll<T2 extends T>(collection: List.ICollection<T2>, index: number): boolean {
        if (!this._autoSort) {
            var oldCount = this._list.length;
            var collectionCount = collection.size();
            if (collectionCount <= 0) return true;
            if (index < this._countSorted) this._countSorted = index;
            this._list.copyTo(this._list, index, oldCount - index, index + collectionCount);

            if (this._collectionChanged.count() > 0) this.OnCollectionChanged(new CollectionChangedEventArgs<T>(CollectionChangedType.Shift, index, index + collectionCount, null, null));

            var i = index;
            for (var iter = collection.iterator(); iter.hasNext();) {
                var item: T = iter.next();
                this._list[i++] = item;
            }

            if (this._collectionChanged.count() > 0) {
                var addedList = this._list.copyOf<T>(index, collectionCount);
                this.OnCollectionChanged(new CollectionChangedEventArgs<T>(CollectionChangedType.Added, -1, index, null, addedList));
            }
        } else this.addAll(collection);
        return true;
    }

    addAll<T2 extends T>(collection: List.IIterable<T2>): boolean {
        if (collection.constructor === Array) return this.addArray<T2>(<T2[]>collection);
        var iter: List.IIterator<T2>;
        var item: T2;
        if (!this._autoSort) {
            var oldCount = this._list.length;
            for (iter = collection.iterator(); iter.hasNext();) {
                item = iter.next();
                this._list[this._list.length] = item;
            }
            if (this._list.length > oldCount) {
                if (this._collectionChanged.count() > 0) {
                    var addedList = this._list.copyOf<T>(oldCount, this._list.length - oldCount);
                    this.OnCollectionChanged(new CollectionChangedEventArgs<T>(CollectionChangedType.Added, -1, oldCount, null, addedList));
                }
            }
        } else {
            for (iter = collection.iterator(); iter.hasNext();) {
                item = iter.next();
                this.add(item);
            }
        }
        return true;
    }

    private addArray<T2 extends T>(array: T2[]): boolean {
        var len = array.length;
        var i: number;
        if (!this._autoSort) {
            var oldCount = this._list.length;
            for (i = 0; i < len; i++) this._list[this._list.length] = array[i];
            if (this._list.length > oldCount) {
                if (this._collectionChanged.count() > 0) {
                    var addedList = this._list.copyOf<T>(oldCount, this._list.length - oldCount);
                    this.OnCollectionChanged(new CollectionChangedEventArgs<T>(CollectionChangedType.Added, -1, oldCount, null, addedList));
                }
            }
        } else for (i = 0; i < len; i++) this.add(<T> array[i]);
        return true;
    }

    reSort() {
        this._countSorted = 0;
        this.sort();
    }

    sort() {
        if (this._countSorted === this._list.length) return;
        this._list.sort(this.compare);
        this._countSorted = this._list.length;
        if (this._collectionChanged.count() > 0) this.OnCollectionChanged(new CollectionChangedEventArgs<T>(CollectionChangedType.Resorted, -1, -1, null, null));
    }

    clear() { this.setSize(0); }

    contains(item: T): boolean { return this.indexOf(item) >= 0; }

    toArray<T2 extends T>(): T2[] {
        if (this._autoSort) this.sort();
        return this._list.copyOf<T2>();
    }

    isReadOnly(): boolean { return false; }

    iterator(): List.IIterator<T> {
        if (this._autoSort) this.sort();
        return this._list.iterator();
    }

    isEmpty(): boolean { return this._list.length === 0; }

    onItemModified(index: number, oldItem?: T) {
        if (oldItem === undefined) oldItem = this.get(index);
        if (this._collectionChanged.count() > 0) this.OnCollectionChanged(new CollectionChangedEventArgs<T>(CollectionChangedType.Setted, index, index, [oldItem], [this.get(index)]));
    }
}

