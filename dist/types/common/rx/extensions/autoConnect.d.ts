declare module '../subjects/observable' {
    interface Observable<T> {
        autoConnect(connectPredicate: (value: any) => boolean, connectFunc: () => () => void): IUnsubscribe;
    }
}
export {};
