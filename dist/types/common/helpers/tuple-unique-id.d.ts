export interface ITupleIdMap extends Map<any, any> {
    getTupleIdMap(item: any, ...items: any[]): ITupleIdMap;
    getTupleIdMap(this: ITupleIdMap, item: any, ...items: any[]): ITupleIdMap;
    getTupleId(item: any, ...items: any[]): number;
    getTupleId(this: ITupleIdMap, item: any, ...items: any[]): number;
}
export declare function getTupleIdMap(item: any, ...items: any[]): ITupleIdMap;
export declare function getTupleIdMap(this: ITupleIdMap, item: any, ...items: any[]): ITupleIdMap;
export declare function getTupleId(item: any, ...items: any[]): number;
export declare function getTupleId(this: ITupleIdMap, item: any, ...items: any[]): number;
