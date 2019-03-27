///<reference path="IList.ts"/>
///<reference path="ICollectionChanged.ts"/>

module mika.utils.List {

    export interface ICollectionChangedList<T> extends IList<T>, ICollectionChanged<T> {
    }

}