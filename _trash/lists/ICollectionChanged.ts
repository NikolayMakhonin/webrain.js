module mika.utils.List {
    import EventHandler = utils.Events.IEventHandler;

    export interface ICollectionChanged<T> {
        collectionChanged(): EventHandler<CollectionChangedEventArgs<T>>;

        onItemModified(index: number, oldItem?: T);
    }

}