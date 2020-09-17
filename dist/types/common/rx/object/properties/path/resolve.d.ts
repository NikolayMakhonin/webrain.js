import { ThenableOrIteratorOrValue } from '../../../../async/async';
import { TGetPropertyValue } from './constracts';
export declare function resolveValueProperty(value: any, getValue?: (value: any) => any): any;
export declare function resolvePath<TValue>(value: ThenableOrIteratorOrValue<TValue>): TGetPropertyValue<TValue>;
