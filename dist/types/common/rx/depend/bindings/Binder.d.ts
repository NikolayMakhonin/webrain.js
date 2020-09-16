import { IUnbind } from './contracts';
export declare class Binder {
    private readonly _bind;
    constructor(bind: () => IUnbind);
    private _bindsCount;
    private __unbind;
    private _unbind;
    bind(): IUnbind;
}
