export declare function getNextObjectId(): number;
export declare function hasObjectUniqueId(object: object): boolean;
export declare function canHaveUniqueId(object: object): boolean;
export declare function getObjectUniqueId(object: object): number;
export declare function freezeWithUniqueId<T extends object>(object: T): T;
export declare function isFrozenWithoutUniqueId(object: object): boolean;
