import { EnumType } from '../helpers/enum';
/** Usage:
    * 1) arrayShuffle(array, () => Math.random())
    * 2) arrayShuffle(array, () => rnd.next())
    */
export declare function randomWithoutSeed(): number;
export declare function arrayShuffle<T>(array: T[], rnd?: () => number): T[];
export declare function getRandomFunc(seed?: number): () => number;
/** Generate random number in range [0..1) like Math.random() or other, but can be pseudorandom with seed */
export declare class Random {
    private readonly _rnd;
    constructor(seed?: number);
    nextSeed(): number;
    nextRandom(): Random;
    next(): number;
    nextRange(from: number, to: number): number;
    nextInt(toExclusive: number): number;
    nextInt(from: number, toExclusive: number): number;
    nextBoolean(trueProbability?: number): boolean;
    nextBooleanOrNull(trueWeight?: number, falseWeight?: number, nullWeight?: number): boolean | null;
    nextTime(from: Date | number, toExclusive: Date | number): number;
    nextDate(from: Date | number, toExclusive: Date | number): Date;
    pullArrayItem<T>(array: T[]): T;
    nextArray<T>(minCount: number, maxCount: number, createItem: (rnd: Random) => T): T[];
    nextArrayItem<T>(array: T[]): T;
    static arrayShuffle: typeof arrayShuffle;
    nextArrayItems<T>(array: T[], minCount: number, maxCount: number, maxCountIsRelative?: boolean): T[];
    nextArrayItemsUnique<T>(array: T[], minCount: number, maxCount: number, maxCountRelative?: boolean): T[];
    nextColor(): string;
    nextEnum<TEnum extends string | number>(enumType: EnumType<TEnum>): TEnum;
    nextEnums<TEnum extends string | number>(enumType: EnumType<TEnum>): TEnum[];
    nextEnumFlags<TEnum extends number>(enumType: EnumType<TEnum>): TEnum;
    nextUuid(): string;
}
