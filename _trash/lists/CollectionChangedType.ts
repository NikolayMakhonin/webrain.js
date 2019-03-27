export enum CollectionChangedType {
    /** is set properties: OldIndex, OldItems */
    Removed,

    /** is set properties: NewIndex, NewItems */
    Added,

    /** is set properties: OldIndex == NewIndex, OldItems[1], NewItems[1], */
    Set,

    /** is not set properties */
    Resorted,

    /** is set properties: OldIndex, NewIndex, NewItems[1] */
    Moved,

    /** is set properties: OldIndex, NewIndex */
    Shift,
}
