export interface ISortedCollection {
    getAutoSort(): boolean;
    setAutoSort(value: boolean);
    sort();
    reSort();
}
