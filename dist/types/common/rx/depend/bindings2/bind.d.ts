import { IBinder, IGetSetValue, TGetValue, TSetValue } from './contracts';
export declare function getOneWayBinder<TSource, TDest, TValue>(source: TSource, getValue: TGetValue<TSource, TValue>, dest: TDest, setValue: TSetValue<TDest, TValue>): IBinder;
export declare function getTwoWayBinder<TSourceDest1, TSourceDest2, TValue>(sourceDest1: TSourceDest1, getSetValue1: IGetSetValue<TSourceDest1, TValue>, sourceDest2: TSourceDest2, getSetValue2: IGetSetValue<TSourceDest2, TValue>): IBinder;
