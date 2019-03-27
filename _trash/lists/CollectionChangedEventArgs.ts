/// <reference path="CollectionChangedType.ts" />
/// <reference path="../Events/EventArgs.ts" />

import EventArgs = utils.Events.EventArgs;

export class CollectionChangedEventArgs<T> extends EventArgs {
    private _OldIndex: number;

    /** индекс первого элемента OldItems */
    getOldIndex(): number { return this._OldIndex; }

    private _NewIndex: number;

    /** индекс первого элемента NewItems */
    getNewIndex(): number { return this._NewIndex; }

    private _OldItems: T[];

    getOldItems(): T[] { return this._OldItems; }

    private _NewItems: T[];

    getNewItems(): T[] { return this._NewItems; }

    private _ChangedType: CollectionChangedType;

    getChangedType(): CollectionChangedType { return this._ChangedType; }

    constructor(changedType: CollectionChangedType, oldIndex: number, newIndex: number, oldItems: T[], newItems: T[]) {
        super();
        this._NewIndex = newIndex;
        this._OldIndex = oldIndex;
        this._OldItems = oldItems;
        this._NewItems = newItems;
        this._ChangedType = changedType;
    }
}
