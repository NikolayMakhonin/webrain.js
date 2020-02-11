export function ArrayIncludes_Slow(a, b, c) {
	return %ArrayIncludes_Slow(a, b, c)
}

export function ArrayIndexOf(a, b, c) {
	return %ArrayIndexOf(a, b, c)
}

export function ArrayIsArray(a) {
	return %ArrayIsArray(a)
}

export function ArraySpeciesConstructor(a) {
	return %ArraySpeciesConstructor(a)
}

export function GrowArrayElements(a, b) {
	return %GrowArrayElements(a, b)
}

export function IsArray(a) {
	return %IsArray(a)
}

export function NewArray(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
	return %NewArray(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
}

export function NormalizeElements(a) {
	return %NormalizeElements(a)
}

export function TransitionElementsKind(a, b) {
	return %TransitionElementsKind(a, b)
}

export function TransitionElementsKindWithKind(a, b) {
	return %TransitionElementsKindWithKind(a, b)
}

export function AtomicsLoad64(a, b) {
	return %AtomicsLoad64(a, b)
}

export function AtomicsStore64(a, b, c) {
	return %AtomicsStore64(a, b, c)
}

export function AtomicsAdd(a, b, c) {
	return %AtomicsAdd(a, b, c)
}

export function AtomicsAnd(a, b, c) {
	return %AtomicsAnd(a, b, c)
}

export function AtomicsCompareExchange(a, b, c, d) {
	return %AtomicsCompareExchange(a, b, c, d)
}

export function AtomicsExchange(a, b, c) {
	return %AtomicsExchange(a, b, c)
}

export function AtomicsNumWaitersForTesting(a, b) {
	return %AtomicsNumWaitersForTesting(a, b)
}

export function AtomicsOr(a, b, c) {
	return %AtomicsOr(a, b, c)
}

export function AtomicsSub(a, b, c) {
	return %AtomicsSub(a, b, c)
}

export function AtomicsXor(a, b, c) {
	return %AtomicsXor(a, b, c)
}

export function SetAllowAtomicsWait(a) {
	return %SetAllowAtomicsWait(a)
}

export function BigIntBinaryOp(a, b, c) {
	return %BigIntBinaryOp(a, b, c)
}

export function BigIntCompareToBigInt(a, b, c) {
	return %BigIntCompareToBigInt(a, b, c)
}

export function BigIntCompareToNumber(a, b, c) {
	return %BigIntCompareToNumber(a, b, c)
}

export function BigIntCompareToString(a, b, c) {
	return %BigIntCompareToString(a, b, c)
}

export function BigIntEqualToBigInt(a, b) {
	return %BigIntEqualToBigInt(a, b)
}

export function BigIntEqualToNumber(a, b) {
	return %BigIntEqualToNumber(a, b)
}

export function BigIntEqualToString(a, b) {
	return %BigIntEqualToString(a, b)
}

export function BigIntToBoolean(a) {
	return %BigIntToBoolean(a)
}

export function BigIntToNumber(a) {
	return %BigIntToNumber(a)
}

export function BigIntUnaryOp(a, b) {
	return %BigIntUnaryOp(a, b)
}

export function ToBigInt(a) {
	return %ToBigInt(a)
}

export function DefineClass(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
	return %DefineClass(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
}

export function HomeObjectSymbol() {
	return %HomeObjectSymbol()
}

export function LoadFromSuper(a, b, c) {
	return %LoadFromSuper(a, b, c)
}

export function LoadKeyedFromSuper(a, b, c) {
	return %LoadKeyedFromSuper(a, b, c)
}

export function StoreKeyedToSuper(a, b, c, d) {
	return %StoreKeyedToSuper(a, b, c, d)
}

export function StoreToSuper(a, b, c, d) {
	return %StoreToSuper(a, b, c, d)
}

export function ThrowConstructorNonCallableError(a) {
	return %ThrowConstructorNonCallableError(a)
}

export function ThrowNotSuperConstructor(a, b) {
	return %ThrowNotSuperConstructor(a, b)
}

export function ThrowStaticPrototypeError() {
	return %ThrowStaticPrototypeError()
}

export function ThrowSuperAlreadyCalledError() {
	return %ThrowSuperAlreadyCalledError()
}

export function ThrowSuperNotCalled() {
	return %ThrowSuperNotCalled()
}

export function ThrowUnsupportedSuperError() {
	return %ThrowUnsupportedSuperError()
}

export function MapGrow(a) {
	return %MapGrow(a)
}

export function MapShrink(a) {
	return %MapShrink(a)
}

export function SetGrow(a) {
	return %SetGrow(a)
}

export function SetShrink(a) {
	return %SetShrink(a)
}

export function TheHole() {
	return %TheHole()
}

export function WeakCollectionDelete(a, b, c) {
	return %WeakCollectionDelete(a, b, c)
}

export function WeakCollectionSet(a, b, c, d) {
	return %WeakCollectionSet(a, b, c, d)
}

export function CompileForOnStackReplacement() {
	return %CompileForOnStackReplacement()
}

export function CompileLazy(a) {
	return %CompileLazy(a)
}

export function CompileOptimized_Concurrent(a) {
	return %CompileOptimized_Concurrent(a)
}

export function CompileOptimized_NotConcurrent(a) {
	return %CompileOptimized_NotConcurrent(a)
}

export function EvictOptimizedCodeSlot(a) {
	return %EvictOptimizedCodeSlot(a)
}

export function FunctionFirstExecution(a) {
	return %FunctionFirstExecution(a)
}

export function InstantiateAsmJs(a, b, c, d) {
	return %InstantiateAsmJs(a, b, c, d)
}

export function NotifyDeoptimized() {
	return %NotifyDeoptimized()
}

export function ResolvePossiblyDirectEval(a, b, c, d, e, f) {
	return %ResolvePossiblyDirectEval(a, b, c, d, e, f)
}

export function DateCurrentTime() {
	return %DateCurrentTime()
}

export function ClearStepping() {
	return %ClearStepping()
}

export function CollectGarbage(a) {
	return %CollectGarbage(a)
}

export function DebugAsyncFunctionEntered(a) {
	return %DebugAsyncFunctionEntered(a)
}

export function DebugAsyncFunctionSuspended(a) {
	return %DebugAsyncFunctionSuspended(a)
}

export function DebugAsyncFunctionResumed(a) {
	return %DebugAsyncFunctionResumed(a)
}

export function DebugAsyncFunctionFinished(a, b) {
	return %DebugAsyncFunctionFinished(a, b)
}

export function DebugBreakAtEntry(a) {
	return %DebugBreakAtEntry(a)
}

export function DebugCollectCoverage() {
	return %DebugCollectCoverage()
}

export function DebugGetLoadedScriptIds() {
	return %DebugGetLoadedScriptIds()
}

export function DebugOnFunctionCall(a, b) {
	return %DebugOnFunctionCall(a, b)
}

export function DebugPopPromise() {
	return %DebugPopPromise()
}

export function DebugPrepareStepInSuspendedGenerator() {
	return %DebugPrepareStepInSuspendedGenerator()
}

export function DebugPushPromise(a) {
	return %DebugPushPromise(a)
}

export function DebugToggleBlockCoverage(a) {
	return %DebugToggleBlockCoverage(a)
}

export function DebugTogglePreciseCoverage(a) {
	return %DebugTogglePreciseCoverage(a)
}

export function FunctionGetInferredName(a) {
	return %FunctionGetInferredName(a)
}

export function GetBreakLocations(a) {
	return %GetBreakLocations(a)
}

export function GetGeneratorScopeCount(a) {
	return %GetGeneratorScopeCount(a)
}

export function GetGeneratorScopeDetails(a, b) {
	return %GetGeneratorScopeDetails(a, b)
}

export function GetHeapUsage() {
	return %GetHeapUsage()
}

export function HandleDebuggerStatement() {
	return %HandleDebuggerStatement()
}

export function IsBreakOnException(a) {
	return %IsBreakOnException(a)
}

export function LiveEditPatchScript(a, b) {
	return %LiveEditPatchScript(a, b)
}

export function ProfileCreateSnapshotDataBlob() {
	return %ProfileCreateSnapshotDataBlob()
}

export function ScheduleBreak() {
	return %ScheduleBreak()
}

export function ScriptLocationFromLine2(a, b, c, d) {
	return %ScriptLocationFromLine2(a, b, c, d)
}

export function SetGeneratorScopeVariableValue(a, b, c, d) {
	return %SetGeneratorScopeVariableValue(a, b, c, d)
}

export function IncBlockCounter(a, b) {
	return %IncBlockCounter(a, b)
}

export function ForInEnumerate(a) {
	return %ForInEnumerate(a)
}

export function ForInHasProperty(a, b) {
	return %ForInHasProperty(a, b)
}

export function InterpreterTraceBytecodeEntry(a, b, c) {
	return %InterpreterTraceBytecodeEntry(a, b, c)
}

export function InterpreterTraceBytecodeExit(a, b, c) {
	return %InterpreterTraceBytecodeExit(a, b, c)
}

export function InterpreterTraceUpdateFeedback(a, b, c) {
	return %InterpreterTraceUpdateFeedback(a, b, c)
}

export function Call(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
	return %Call(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
}

export function FunctionGetScriptSource(a) {
	return %FunctionGetScriptSource(a)
}

export function FunctionGetScriptId(a) {
	return %FunctionGetScriptId(a)
}

export function FunctionGetScriptSourcePosition(a) {
	return %FunctionGetScriptSourcePosition(a)
}

export function FunctionGetSourceCode(a) {
	return %FunctionGetSourceCode(a)
}

export function FunctionIsAPIFunction(a) {
	return %FunctionIsAPIFunction(a)
}

export function IsFunction(a) {
	return %IsFunction(a)
}

export function AsyncFunctionAwaitCaught(a, b) {
	return %AsyncFunctionAwaitCaught(a, b)
}

export function AsyncFunctionAwaitUncaught(a, b) {
	return %AsyncFunctionAwaitUncaught(a, b)
}

export function AsyncFunctionEnter(a, b) {
	return %AsyncFunctionEnter(a, b)
}

export function AsyncFunctionReject(a, b, c) {
	return %AsyncFunctionReject(a, b, c)
}

export function AsyncFunctionResolve(a, b, c) {
	return %AsyncFunctionResolve(a, b, c)
}

export function AsyncGeneratorAwaitCaught(a, b) {
	return %AsyncGeneratorAwaitCaught(a, b)
}

export function AsyncGeneratorAwaitUncaught(a, b) {
	return %AsyncGeneratorAwaitUncaught(a, b)
}

export function AsyncGeneratorHasCatchHandlerForPC(a) {
	return %AsyncGeneratorHasCatchHandlerForPC(a)
}

export function AsyncGeneratorReject(a, b) {
	return %AsyncGeneratorReject(a, b)
}

export function AsyncGeneratorResolve(a, b, c) {
	return %AsyncGeneratorResolve(a, b, c)
}

export function AsyncGeneratorYield(a, b, c) {
	return %AsyncGeneratorYield(a, b, c)
}

export function CreateJSGeneratorObject(a, b) {
	return %CreateJSGeneratorObject(a, b)
}

export function GeneratorClose(a) {
	return %GeneratorClose(a)
}

export function GeneratorGetFunction(a) {
	return %GeneratorGetFunction(a)
}

export function GeneratorGetResumeMode(a) {
	return %GeneratorGetResumeMode(a)
}

export function FormatList(a, b) {
	return %FormatList(a, b)
}

export function FormatListToParts(a, b) {
	return %FormatListToParts(a, b)
}

export function StringToLowerCaseIntl(a) {
	return %StringToLowerCaseIntl(a)
}

export function StringToUpperCaseIntl(a) {
	return %StringToUpperCaseIntl(a)
}

export function AccessCheck(a) {
	return %AccessCheck(a)
}

export function AllocateByteArray(a) {
	return %AllocateByteArray(a)
}

export function AllocateInYoungGeneration(a, b) {
	return %AllocateInYoungGeneration(a, b)
}

export function AllocateInOldGeneration(a, b) {
	return %AllocateInOldGeneration(a, b)
}

export function AllocateSeqOneByteString(a) {
	return %AllocateSeqOneByteString(a)
}

export function AllocateSeqTwoByteString(a) {
	return %AllocateSeqTwoByteString(a)
}

export function AllowDynamicFunction(a) {
	return %AllowDynamicFunction(a)
}

export function CreateAsyncFromSyncIterator(a) {
	return %CreateAsyncFromSyncIterator(a)
}

export function CreateListFromArrayLike(a) {
	return %CreateListFromArrayLike(a)
}

export function DoubleToStringWithRadix(a, b) {
	return %DoubleToStringWithRadix(a, b)
}

export function FatalProcessOutOfMemoryInAllocateRaw() {
	return %FatalProcessOutOfMemoryInAllocateRaw()
}

export function FatalProcessOutOfMemoryInvalidArrayLength() {
	return %FatalProcessOutOfMemoryInvalidArrayLength()
}

export function GetAndResetRuntimeCallStats(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
	return %GetAndResetRuntimeCallStats(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
}

export function GetTemplateObject(a, b, c) {
	return %GetTemplateObject(a, b, c)
}

export function IncrementUseCounter(a) {
	return %IncrementUseCounter(a)
}

export function BytecodeBudgetInterrupt(a) {
	return %BytecodeBudgetInterrupt(a)
}

export function NewReferenceError(a, b) {
	return %NewReferenceError(a, b)
}

export function NewSyntaxError(a, b) {
	return %NewSyntaxError(a, b)
}

export function NewTypeError(a, b) {
	return %NewTypeError(a, b)
}

export function OrdinaryHasInstance(a, b) {
	return %OrdinaryHasInstance(a, b)
}

export function PromoteScheduledException() {
	return %PromoteScheduledException()
}

export function ReportMessage(a) {
	return %ReportMessage(a)
}

export function ReThrow(a) {
	return %ReThrow(a)
}

export function RunMicrotaskCallback(a, b) {
	return %RunMicrotaskCallback(a, b)
}

export function PerformMicrotaskCheckpoint() {
	return %PerformMicrotaskCheckpoint()
}

export function StackGuard() {
	return %StackGuard()
}

export function StackGuardWithGap(a) {
	return %StackGuardWithGap(a)
}

export function Throw(a) {
	return %Throw(a)
}

export function ThrowApplyNonFunction(a) {
	return %ThrowApplyNonFunction(a)
}

export function ThrowCalledNonCallable(a) {
	return %ThrowCalledNonCallable(a)
}

export function ThrowConstructedNonConstructable(a) {
	return %ThrowConstructedNonConstructable(a)
}

export function ThrowConstructorReturnedNonObject() {
	return %ThrowConstructorReturnedNonObject()
}

export function ThrowInvalidStringLength() {
	return %ThrowInvalidStringLength()
}

export function ThrowInvalidTypedArrayAlignment(a, b) {
	return %ThrowInvalidTypedArrayAlignment(a, b)
}

export function ThrowIteratorError(a) {
	return %ThrowIteratorError(a)
}

export function ThrowSpreadArgIsNullOrUndefined(a) {
	return %ThrowSpreadArgIsNullOrUndefined(a)
}

export function ThrowIteratorResultNotAnObject(a) {
	return %ThrowIteratorResultNotAnObject(a)
}

export function ThrowNotConstructor(a) {
	return %ThrowNotConstructor(a)
}

export function ThrowPatternAssignmentNonCoercible(a) {
	return %ThrowPatternAssignmentNonCoercible(a)
}

export function ThrowRangeError(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
	return %ThrowRangeError(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
}

export function ThrowReferenceError(a) {
	return %ThrowReferenceError(a)
}

export function ThrowAccessedUninitializedVariable(a) {
	return %ThrowAccessedUninitializedVariable(a)
}

export function ThrowStackOverflow() {
	return %ThrowStackOverflow()
}

export function ThrowSymbolAsyncIteratorInvalid() {
	return %ThrowSymbolAsyncIteratorInvalid()
}

export function ThrowSymbolIteratorInvalid() {
	return %ThrowSymbolIteratorInvalid()
}

export function ThrowThrowMethodMissing() {
	return %ThrowThrowMethodMissing()
}

export function ThrowTypeError(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
	return %ThrowTypeError(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
}

export function ThrowTypeErrorIfStrict(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
	return %ThrowTypeErrorIfStrict(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
}

export function Typeof(a) {
	return %Typeof(a)
}

export function UnwindAndFindExceptionHandler() {
	return %UnwindAndFindExceptionHandler()
}

export function CreateArrayLiteral(a, b, c, d) {
	return %CreateArrayLiteral(a, b, c, d)
}

export function CreateArrayLiteralWithoutAllocationSite(a, b) {
	return %CreateArrayLiteralWithoutAllocationSite(a, b)
}

export function CreateObjectLiteral(a, b, c, d) {
	return %CreateObjectLiteral(a, b, c, d)
}

export function CreateObjectLiteralWithoutAllocationSite(a, b) {
	return %CreateObjectLiteralWithoutAllocationSite(a, b)
}

export function CreateRegExpLiteral(a, b, c, d) {
	return %CreateRegExpLiteral(a, b, c, d)
}

export function DynamicImportCall(a, b) {
	return %DynamicImportCall(a, b)
}

export function GetImportMetaObject() {
	return %GetImportMetaObject()
}

export function GetModuleNamespace(a) {
	return %GetModuleNamespace(a)
}

export function ArrayBufferMaxByteLength() {
	return %ArrayBufferMaxByteLength()
}

export function GetHoleNaNLower() {
	return %GetHoleNaNLower()
}

export function GetHoleNaNUpper() {
	return %GetHoleNaNUpper()
}

export function IsSmi(a) {
	return %IsSmi(a)
}

export function IsValidSmi(a) {
	return %IsValidSmi(a)
}

export function MaxSmi() {
	return %MaxSmi()
}

export function NumberToString(a) {
	return %NumberToString(a)
}

export function StringParseFloat(a) {
	return %StringParseFloat(a)
}

export function StringParseInt(a, b) {
	return %StringParseInt(a, b)
}

export function StringToNumber(a) {
	return %StringToNumber(a)
}

export function TypedArrayMaxLength() {
	return %TypedArrayMaxLength()
}

export function AddDictionaryProperty(a, b, c) {
	return %AddDictionaryProperty(a, b, c)
}

export function AddPrivateField(a, b, c) {
	return %AddPrivateField(a, b, c)
}

export function AddPrivateBrand(a, b, c) {
	return %AddPrivateBrand(a, b, c)
}

export function AllocateHeapNumber() {
	return %AllocateHeapNumber()
}

export function ClassOf(a) {
	return %ClassOf(a)
}

export function CollectTypeProfile(a, b, c) {
	return %CollectTypeProfile(a, b, c)
}

export function CompleteInobjectSlackTrackingForMap(a) {
	return %CompleteInobjectSlackTrackingForMap(a)
}

export function CopyDataProperties(a, b) {
	return %CopyDataProperties(a, b)
}

export function CopyDataPropertiesWithExcludedProperties(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
	return %CopyDataPropertiesWithExcludedProperties(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
}

export function CreateDataProperty(a, b, c) {
	return %CreateDataProperty(a, b, c)
}

export function CreateIterResultObject(a, b) {
	return %CreateIterResultObject(a, b)
}

export function CreatePrivateAccessors(a, b) {
	return %CreatePrivateAccessors(a, b)
}

export function DefineAccessorPropertyUnchecked(a, b, c, d, e) {
	return %DefineAccessorPropertyUnchecked(a, b, c, d, e)
}

export function DefineDataPropertyInLiteral(a, b, c, d, e, f) {
	return %DefineDataPropertyInLiteral(a, b, c, d, e, f)
}

export function DefineGetterPropertyUnchecked(a, b, c, d) {
	return %DefineGetterPropertyUnchecked(a, b, c, d)
}

export function DefineSetterPropertyUnchecked(a, b, c, d) {
	return %DefineSetterPropertyUnchecked(a, b, c, d)
}

export function DeleteProperty(a, b, c) {
	return %DeleteProperty(a, b, c)
}

export function GetDerivedMap(a, b) {
	return %GetDerivedMap(a, b)
}

export function GetFunctionName(a) {
	return %GetFunctionName(a)
}

export function GetOwnPropertyDescriptor(a, b) {
	return %GetOwnPropertyDescriptor(a, b)
}

export function GetOwnPropertyKeys(a, b) {
	return %GetOwnPropertyKeys(a, b)
}

export function GetProperty(a, b) {
	return %GetProperty(a, b)
}

export function HasFastPackedElements(a) {
	return %HasFastPackedElements(a)
}

export function HasInPrototypeChain(a, b) {
	return %HasInPrototypeChain(a, b)
}

export function HasProperty(a, b) {
	return %HasProperty(a, b)
}

export function InternalSetPrototype(a, b) {
	return %InternalSetPrototype(a, b)
}

export function IsJSReceiver(a) {
	return %IsJSReceiver(a)
}

export function JSReceiverPreventExtensionsDontThrow(a) {
	return %JSReceiverPreventExtensionsDontThrow(a)
}

export function JSReceiverPreventExtensionsThrow(a) {
	return %JSReceiverPreventExtensionsThrow(a)
}

export function JSReceiverGetPrototypeOf(a) {
	return %JSReceiverGetPrototypeOf(a)
}

export function JSReceiverSetPrototypeOfDontThrow(a, b) {
	return %JSReceiverSetPrototypeOfDontThrow(a, b)
}

export function JSReceiverSetPrototypeOfThrow(a, b) {
	return %JSReceiverSetPrototypeOfThrow(a, b)
}

export function LoadPrivateGetter(a) {
	return %LoadPrivateGetter(a)
}

export function LoadPrivateSetter(a) {
	return %LoadPrivateSetter(a)
}

export function NewObject(a, b) {
	return %NewObject(a, b)
}

export function ObjectCreate(a, b) {
	return %ObjectCreate(a, b)
}

export function ObjectEntries(a) {
	return %ObjectEntries(a)
}

export function ObjectEntriesSkipFastPath(a) {
	return %ObjectEntriesSkipFastPath(a)
}

export function ObjectGetOwnPropertyNames(a) {
	return %ObjectGetOwnPropertyNames(a)
}

export function ObjectGetOwnPropertyNamesTryFast(a) {
	return %ObjectGetOwnPropertyNamesTryFast(a)
}

export function ObjectHasOwnProperty(a, b) {
	return %ObjectHasOwnProperty(a, b)
}

export function ObjectIsExtensible(a) {
	return %ObjectIsExtensible(a)
}

export function ObjectKeys(a) {
	return %ObjectKeys(a)
}

export function ObjectValues(a) {
	return %ObjectValues(a)
}

export function ObjectValuesSkipFastPath(a) {
	return %ObjectValuesSkipFastPath(a)
}

export function OptimizeObjectForAddingMultipleProperties(a, b) {
	return %OptimizeObjectForAddingMultipleProperties(a, b)
}

export function SetDataProperties(a, b) {
	return %SetDataProperties(a, b)
}

export function SetKeyedProperty(a, b, c) {
	return %SetKeyedProperty(a, b, c)
}

export function SetNamedProperty(a, b, c) {
	return %SetNamedProperty(a, b, c)
}

export function StoreDataPropertyInLiteral(a, b, c) {
	return %StoreDataPropertyInLiteral(a, b, c)
}

export function ShrinkPropertyDictionary(a) {
	return %ShrinkPropertyDictionary(a)
}

export function ToFastProperties(a) {
	return %ToFastProperties(a)
}

export function ToLength(a) {
	return %ToLength(a)
}

export function ToName(a) {
	return %ToName(a)
}

export function ToNumber(a) {
	return %ToNumber(a)
}

export function ToNumeric(a) {
	return %ToNumeric(a)
}

export function ToObject(a) {
	return %ToObject(a)
}

export function ToStringRT(a) {
	return %ToStringRT(a)
}

export function TryMigrateInstance(a) {
	return %TryMigrateInstance(a)
}

export function Add(a, b) {
	return %Add(a, b)
}

export function Equal(a, b) {
	return %Equal(a, b)
}

export function GreaterThan(a, b) {
	return %GreaterThan(a, b)
}

export function GreaterThanOrEqual(a, b) {
	return %GreaterThanOrEqual(a, b)
}

export function LessThan(a, b) {
	return %LessThan(a, b)
}

export function LessThanOrEqual(a, b) {
	return %LessThanOrEqual(a, b)
}

export function NotEqual(a, b) {
	return %NotEqual(a, b)
}

export function StrictEqual(a, b) {
	return %StrictEqual(a, b)
}

export function StrictNotEqual(a, b) {
	return %StrictNotEqual(a, b)
}

export function EnqueueMicrotask(a) {
	return %EnqueueMicrotask(a)
}

export function PromiseHookAfter(a) {
	return %PromiseHookAfter(a)
}

export function PromiseHookBefore(a) {
	return %PromiseHookBefore(a)
}

export function PromiseHookInit(a, b) {
	return %PromiseHookInit(a, b)
}

export function AwaitPromisesInit(a, b, c, d, e) {
	return %AwaitPromisesInit(a, b, c, d, e)
}

export function AwaitPromisesInitOld(a, b, c, d, e) {
	return %AwaitPromisesInitOld(a, b, c, d, e)
}

export function PromiseMarkAsHandled(a) {
	return %PromiseMarkAsHandled(a)
}

export function PromiseRejectEventFromStack(a, b) {
	return %PromiseRejectEventFromStack(a, b)
}

export function PromiseRevokeReject(a) {
	return %PromiseRevokeReject(a)
}

export function PromiseStatus(a) {
	return %PromiseStatus(a)
}

export function RejectPromise(a, b, c) {
	return %RejectPromise(a, b, c)
}

export function ResolvePromise(a, b) {
	return %ResolvePromise(a, b)
}

export function PromiseRejectAfterResolved(a, b) {
	return %PromiseRejectAfterResolved(a, b)
}

export function PromiseResolveAfterResolved(a, b) {
	return %PromiseResolveAfterResolved(a, b)
}

export function CheckProxyGetSetTrapResult(a, b) {
	return %CheckProxyGetSetTrapResult(a, b)
}

export function CheckProxyHasTrapResult(a, b) {
	return %CheckProxyHasTrapResult(a, b)
}

export function CheckProxyDeleteTrapResult(a, b) {
	return %CheckProxyDeleteTrapResult(a, b)
}

export function GetPropertyWithReceiver(a, b, c) {
	return %GetPropertyWithReceiver(a, b, c)
}

export function SetPropertyWithReceiver(a, b, c, d) {
	return %SetPropertyWithReceiver(a, b, c, d)
}

export function IsRegExp(a) {
	return %IsRegExp(a)
}

export function RegExpExec(a, b, c, d) {
	return %RegExpExec(a, b, c, d)
}

export function RegExpExecMultiple(a, b, c, d) {
	return %RegExpExecMultiple(a, b, c, d)
}

export function RegExpInitializeAndCompile(a, b, c) {
	return %RegExpInitializeAndCompile(a, b, c)
}

export function RegExpReplaceRT(a, b, c) {
	return %RegExpReplaceRT(a, b, c)
}

export function RegExpSplit(a, b, c) {
	return %RegExpSplit(a, b, c)
}

export function StringReplaceNonGlobalRegExpWithFunction(a, b, c) {
	return %StringReplaceNonGlobalRegExpWithFunction(a, b, c)
}

export function StringSplit(a, b, c) {
	return %StringSplit(a, b, c)
}

export function DeclareEvalFunction(a, b) {
	return %DeclareEvalFunction(a, b)
}

export function DeclareEvalVar(a) {
	return %DeclareEvalVar(a)
}

export function DeclareGlobals(a, b) {
	return %DeclareGlobals(a, b)
}

export function DeclareModuleExports(a, b) {
	return %DeclareModuleExports(a, b)
}

export function DeleteLookupSlot(a) {
	return %DeleteLookupSlot(a)
}

export function LoadLookupSlot(a) {
	return %LoadLookupSlot(a)
}

export function LoadLookupSlotInsideTypeof(a) {
	return %LoadLookupSlotInsideTypeof(a)
}

export function NewArgumentsElements(a, b, c) {
	return %NewArgumentsElements(a, b, c)
}

export function NewClosure(a, b) {
	return %NewClosure(a, b)
}

export function NewClosure_Tenured(a, b) {
	return %NewClosure_Tenured(a, b)
}

export function NewFunctionContext(a) {
	return %NewFunctionContext(a)
}

export function NewRestParameter(a) {
	return %NewRestParameter(a)
}

export function NewSloppyArguments(a, b, c) {
	return %NewSloppyArguments(a, b, c)
}

export function NewSloppyArguments_Generic(a) {
	return %NewSloppyArguments_Generic(a)
}

export function NewStrictArguments(a) {
	return %NewStrictArguments(a)
}

export function PushBlockContext(a) {
	return %PushBlockContext(a)
}

export function PushCatchContext(a, b) {
	return %PushCatchContext(a, b)
}

export function PushWithContext(a, b) {
	return %PushWithContext(a, b)
}

export function StoreGlobalNoHoleCheckForReplLet(a, b) {
	return %StoreGlobalNoHoleCheckForReplLet(a, b)
}

export function StoreLookupSlot_Sloppy(a, b) {
	return %StoreLookupSlot_Sloppy(a, b)
}

export function StoreLookupSlot_SloppyHoisting(a, b) {
	return %StoreLookupSlot_SloppyHoisting(a, b)
}

export function StoreLookupSlot_Strict(a, b) {
	return %StoreLookupSlot_Strict(a, b)
}

export function ThrowConstAssignError() {
	return %ThrowConstAssignError()
}

export function FlattenString(a) {
	return %FlattenString(a)
}

export function GetSubstitution(a, b, c, d, e) {
	return %GetSubstitution(a, b, c, d, e)
}

export function InternalizeString(a) {
	return %InternalizeString(a)
}

export function StringAdd(a, b) {
	return %StringAdd(a, b)
}

export function StringBuilderConcat(a, b, c) {
	return %StringBuilderConcat(a, b, c)
}

export function StringCharCodeAt(a, b) {
	return %StringCharCodeAt(a, b)
}

export function StringEqual(a, b) {
	return %StringEqual(a, b)
}

export function StringEscapeQuotes(a) {
	return %StringEscapeQuotes(a)
}

export function StringGreaterThan(a, b) {
	return %StringGreaterThan(a, b)
}

export function StringGreaterThanOrEqual(a, b) {
	return %StringGreaterThanOrEqual(a, b)
}

export function StringIncludes(a, b, c) {
	return %StringIncludes(a, b, c)
}

export function StringIndexOf(a, b, c) {
	return %StringIndexOf(a, b, c)
}

export function StringIndexOfUnchecked(a, b, c) {
	return %StringIndexOfUnchecked(a, b, c)
}

export function StringLastIndexOf(a, b) {
	return %StringLastIndexOf(a, b)
}

export function StringLessThan(a, b) {
	return %StringLessThan(a, b)
}

export function StringLessThanOrEqual(a, b) {
	return %StringLessThanOrEqual(a, b)
}

export function StringMaxLength() {
	return %StringMaxLength()
}

export function StringReplaceOneCharWithString(a, b, c) {
	return %StringReplaceOneCharWithString(a, b, c)
}

export function StringCompareSequence(a, b, c) {
	return %StringCompareSequence(a, b, c)
}

export function StringSubstring(a, b, c) {
	return %StringSubstring(a, b, c)
}

export function StringToArray(a, b) {
	return %StringToArray(a, b)
}

export function StringTrim(a, b) {
	return %StringTrim(a, b)
}

export function CreatePrivateNameSymbol(a) {
	return %CreatePrivateNameSymbol(a)
}

export function CreatePrivateBrandSymbol(a) {
	return %CreatePrivateBrandSymbol(a)
}

export function CreatePrivateSymbol(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
	return %CreatePrivateSymbol(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
}

export function SymbolDescriptiveString(a) {
	return %SymbolDescriptiveString(a)
}

export function SymbolIsPrivate(a) {
	return %SymbolIsPrivate(a)
}

export function Abort(a) {
	return %Abort(a)
}

export function AbortJS(a) {
	return %AbortJS(a)
}

export function AbortCSAAssert(a) {
	return %AbortCSAAssert(a)
}

export function ArraySpeciesProtector() {
	return %ArraySpeciesProtector()
}

export function ClearFunctionFeedback(a) {
	return %ClearFunctionFeedback(a)
}

export function ClearMegamorphicStubCache() {
	return %ClearMegamorphicStubCache()
}

export function CloneWasmModule(a) {
	return %CloneWasmModule(a)
}

export function CompleteInobjectSlackTracking(a) {
	return %CompleteInobjectSlackTracking(a)
}

export function ConstructConsString(a, b) {
	return %ConstructConsString(a, b)
}

export function ConstructDouble(a, b) {
	return %ConstructDouble(a, b)
}

export function ConstructSlicedString(a, b) {
	return %ConstructSlicedString(a, b)
}

export function DebugPrint(a) {
	return %DebugPrint(a)
}

export function DebugTrace() {
	return %DebugTrace()
}

export function DebugTrackRetainingPath(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
	return %DebugTrackRetainingPath(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
}

export function DeoptimizeFunction(a) {
	return %DeoptimizeFunction(a)
}

export function DeserializeWasmModule(a, b) {
	return %DeserializeWasmModule(a, b)
}

export function DisallowCodegenFromStrings(a) {
	return %DisallowCodegenFromStrings(a)
}

export function DisallowWasmCodegen(a) {
	return %DisallowWasmCodegen(a)
}

export function DisassembleFunction(a) {
	return %DisassembleFunction(a)
}

export function EnableCodeLoggingForTesting() {
	return %EnableCodeLoggingForTesting()
}

export function EnsureFeedbackVectorForFunction(a) {
	return %EnsureFeedbackVectorForFunction(a)
}

export function FreezeWasmLazyCompilation(a) {
	return %FreezeWasmLazyCompilation(a)
}

export function GetCallable() {
	return %GetCallable()
}

export function GetInitializerFunction(a) {
	return %GetInitializerFunction(a)
}

export function GetOptimizationStatus(fn) {
	return %GetOptimizationStatus(fn)
}

export function GetUndetectable() {
	return %GetUndetectable()
}

export function GetWasmExceptionId(a, b) {
	return %GetWasmExceptionId(a, b)
}

export function GetWasmExceptionValues(a) {
	return %GetWasmExceptionValues(a)
}

export function GetWasmRecoveredTrapCount() {
	return %GetWasmRecoveredTrapCount()
}

export function GlobalPrint(a) {
	return %GlobalPrint(a)
}

export function HasDictionaryElements(a) {
	return %HasDictionaryElements(a)
}

export function HasDoubleElements(a) {
	return %HasDoubleElements(a)
}

export function HasElementsInALargeObjectSpace(a) {
	return %HasElementsInALargeObjectSpace(a)
}

export function HasFastElements(a) {
	return %HasFastElements(a)
}

export function HasFastProperties(a) {
	return %HasFastProperties(a)
}

export function HasFixedBigInt64Elements(a) {
	return %HasFixedBigInt64Elements(a)
}

export function HasFixedBigUint64Elements(a) {
	return %HasFixedBigUint64Elements(a)
}

export function HasFixedFloat32Elements(a) {
	return %HasFixedFloat32Elements(a)
}

export function HasFixedFloat64Elements(a) {
	return %HasFixedFloat64Elements(a)
}

export function HasFixedInt16Elements(a) {
	return %HasFixedInt16Elements(a)
}

export function HasFixedInt32Elements(a) {
	return %HasFixedInt32Elements(a)
}

export function HasFixedInt8Elements(a) {
	return %HasFixedInt8Elements(a)
}

export function HasFixedUint16Elements(a) {
	return %HasFixedUint16Elements(a)
}

export function HasFixedUint32Elements(a) {
	return %HasFixedUint32Elements(a)
}

export function HasFixedUint8ClampedElements(a) {
	return %HasFixedUint8ClampedElements(a)
}

export function HasFixedUint8Elements(a) {
	return %HasFixedUint8Elements(a)
}

export function HasHoleyElements(a) {
	return %HasHoleyElements(a)
}

export function HasObjectElements(a) {
	return %HasObjectElements(a)
}

export function HasPackedElements(a) {
	return %HasPackedElements(a)
}

export function HasSloppyArgumentsElements(a) {
	return %HasSloppyArgumentsElements(a)
}

export function HasSmiElements(a) {
	return %HasSmiElements(a)
}

export function HasSmiOrObjectElements(a) {
	return %HasSmiOrObjectElements(a)
}

export function HaveSameMap(a, b) {
	return %HaveSameMap(a, b)
}

export function HeapObjectVerify(a) {
	return %HeapObjectVerify(a)
}

export function ICsAreEnabled() {
	return %ICsAreEnabled()
}

export function InYoungGeneration(a) {
	return %InYoungGeneration(a)
}

export function IsAsmWasmCode(a) {
	return %IsAsmWasmCode(a)
}

export function IsBeingInterpreted() {
	return %IsBeingInterpreted()
}

export function IsConcurrentRecompilationSupported() {
	return %IsConcurrentRecompilationSupported()
}

export function IsLiftoffFunction(a) {
	return %IsLiftoffFunction(a)
}

export function IsThreadInWasm() {
	return %IsThreadInWasm()
}

export function IsWasmCode(a) {
	return %IsWasmCode(a)
}

export function IsWasmTrapHandlerEnabled() {
	return %IsWasmTrapHandlerEnabled()
}

export function RegexpHasBytecode(a, b) {
	return %RegexpHasBytecode(a, b)
}

export function RegexpHasNativeCode(a, b) {
	return %RegexpHasNativeCode(a, b)
}

export function MapIteratorProtector() {
	return %MapIteratorProtector()
}

export function NeverOptimizeFunction(a) {
	return %NeverOptimizeFunction(a)
}

export function NotifyContextDisposed() {
	return %NotifyContextDisposed()
}

export function OptimizeFunctionOnNextCall(fn) {
	return %OptimizeFunctionOnNextCall(fn)
}

export function OptimizeOsr(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
	return %OptimizeOsr(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
}

export function NewRegExpWithBacktrackLimit(a, b, c) {
	return %NewRegExpWithBacktrackLimit(a, b, c)
}

export function PrepareFunctionForOptimization(fn) {
	return %PrepareFunctionForOptimization(fn)
}

export function PrintWithNameForAssert(a, b) {
	return %PrintWithNameForAssert(a, b)
}

export function RedirectToWasmInterpreter(a, b) {
	return %RedirectToWasmInterpreter(a, b)
}

export function RunningInSimulator() {
	return %RunningInSimulator()
}

export function RuntimeEvaluateREPL(a) {
	return %RuntimeEvaluateREPL(a)
}

export function SerializeWasmModule(a) {
	return %SerializeWasmModule(a)
}

export function SetAllocationTimeout(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
	return %SetAllocationTimeout(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
}

export function SetForceSlowPath(a) {
	return %SetForceSlowPath(a)
}

export function SetIteratorProtector() {
	return %SetIteratorProtector()
}

export function SetWasmCompileControls(a, b) {
	return %SetWasmCompileControls(a, b)
}

export function SetWasmInstantiateControls() {
	return %SetWasmInstantiateControls()
}

export function SetWasmThreadsEnabled(a) {
	return %SetWasmThreadsEnabled(a)
}

export function SimulateNewspaceFull() {
	return %SimulateNewspaceFull()
}

export function StringIteratorProtector() {
	return %StringIteratorProtector()
}

export function SystemBreak() {
	return %SystemBreak()
}

export function TraceEnter() {
	return %TraceEnter()
}

export function TraceExit(a) {
	return %TraceExit(a)
}

export function TurbofanStaticAssert(a) {
	return %TurbofanStaticAssert(a)
}

export function UnblockConcurrentRecompilation() {
	return %UnblockConcurrentRecompilation()
}

export function WasmGetNumberOfInstances(a) {
	return %WasmGetNumberOfInstances(a)
}

export function WasmNumInterpretedCalls(a) {
	return %WasmNumInterpretedCalls(a)
}

export function WasmNumCodeSpaces(a) {
	return %WasmNumCodeSpaces(a)
}

export function WasmTierDownModule(a) {
	return %WasmTierDownModule(a)
}

export function WasmTierUpFunction(a, b) {
	return %WasmTierUpFunction(a, b)
}

export function WasmTierUpModule(a) {
	return %WasmTierUpModule(a)
}

export function WasmTraceMemory(a) {
	return %WasmTraceMemory(a)
}

export function DeoptimizeNow() {
	return %DeoptimizeNow()
}

export function ArrayBufferDetach(a) {
	return %ArrayBufferDetach(a)
}

export function TypedArrayCopyElements(a, b, c) {
	return %TypedArrayCopyElements(a, b, c)
}

export function TypedArrayGetBuffer(a) {
	return %TypedArrayGetBuffer(a)
}

export function TypedArraySet(a, b) {
	return %TypedArraySet(a, b)
}

export function TypedArraySortFast(a) {
	return %TypedArraySortFast(a)
}

export function ThrowWasmError(a) {
	return %ThrowWasmError(a)
}

export function ThrowWasmStackOverflow() {
	return %ThrowWasmStackOverflow()
}

export function WasmI32AtomicWait(a, b, c, d) {
	return %WasmI32AtomicWait(a, b, c, d)
}

export function WasmI64AtomicWait(a, b, c, d, e) {
	return %WasmI64AtomicWait(a, b, c, d, e)
}

export function WasmAtomicNotify(a, b, c) {
	return %WasmAtomicNotify(a, b, c)
}

export function WasmExceptionGetValues(a) {
	return %WasmExceptionGetValues(a)
}

export function WasmExceptionGetTag(a) {
	return %WasmExceptionGetTag(a)
}

export function WasmMemoryGrow(a, b) {
	return %WasmMemoryGrow(a, b)
}

export function WasmRunInterpreter(a, b) {
	return %WasmRunInterpreter(a, b)
}

export function WasmStackGuard() {
	return %WasmStackGuard()
}

export function WasmThrowCreate(a, b) {
	return %WasmThrowCreate(a, b)
}

export function WasmThrowTypeError() {
	return %WasmThrowTypeError()
}

export function WasmRefFunc(a) {
	return %WasmRefFunc(a)
}

export function WasmFunctionTableGet(a, b, c) {
	return %WasmFunctionTableGet(a, b, c)
}

export function WasmFunctionTableSet(a, b, c, d) {
	return %WasmFunctionTableSet(a, b, c, d)
}

export function WasmTableInit(a, b, c, d, e) {
	return %WasmTableInit(a, b, c, d, e)
}

export function WasmTableCopy(a, b, c, d, e) {
	return %WasmTableCopy(a, b, c, d, e)
}

export function WasmTableGrow(a, b, c) {
	return %WasmTableGrow(a, b, c)
}

export function WasmTableFill(a, b, c, d) {
	return %WasmTableFill(a, b, c, d)
}

export function WasmIsValidFuncRefValue(a) {
	return %WasmIsValidFuncRefValue(a)
}

export function WasmCompileLazy(a, b) {
	return %WasmCompileLazy(a, b)
}

export function WasmNewMultiReturnFixedArray(a) {
	return %WasmNewMultiReturnFixedArray(a)
}

export function WasmNewMultiReturnJSArray(a) {
	return %WasmNewMultiReturnJSArray(a)
}

export function WasmDebugBreak() {
	return %WasmDebugBreak()
}

export function DebugBreakOnBytecode(a) {
	return %DebugBreakOnBytecode(a)
}

export function LoadLookupSlotForCall(a) {
	return %LoadLookupSlotForCall(a)
}

export function ElementsTransitionAndStoreIC_Miss(a, b, c, d, e, f) {
	return %ElementsTransitionAndStoreIC_Miss(a, b, c, d, e, f)
}

export function KeyedLoadIC_Miss(a, b, c, d) {
	return %KeyedLoadIC_Miss(a, b, c, d)
}

export function KeyedStoreIC_Miss(a, b, c, d, e) {
	return %KeyedStoreIC_Miss(a, b, c, d, e)
}

export function StoreInArrayLiteralIC_Miss(a, b, c, d, e) {
	return %StoreInArrayLiteralIC_Miss(a, b, c, d, e)
}

export function KeyedStoreIC_Slow(a, b, c) {
	return %KeyedStoreIC_Slow(a, b, c)
}

export function LoadElementWithInterceptor(a, b) {
	return %LoadElementWithInterceptor(a, b)
}

export function LoadGlobalIC_Miss(a, b, c, d) {
	return %LoadGlobalIC_Miss(a, b, c, d)
}

export function LoadGlobalIC_Slow(a, b, c) {
	return %LoadGlobalIC_Slow(a, b, c)
}

export function LoadIC_Miss(a, b, c, d) {
	return %LoadIC_Miss(a, b, c, d)
}

export function LoadNoFeedbackIC_Miss(a, b, c, d) {
	return %LoadNoFeedbackIC_Miss(a, b, c, d)
}

export function LoadPropertyWithInterceptor(a, b, c, d, e) {
	return %LoadPropertyWithInterceptor(a, b, c, d, e)
}

export function StoreCallbackProperty(a, b, c, d, e) {
	return %StoreCallbackProperty(a, b, c, d, e)
}

export function StoreGlobalIC_Miss(a, b, c, d) {
	return %StoreGlobalIC_Miss(a, b, c, d)
}

export function StoreGlobalICNoFeedback_Miss(a, b) {
	return %StoreGlobalICNoFeedback_Miss(a, b)
}

export function StoreGlobalIC_Slow(a, b, c, d, e) {
	return %StoreGlobalIC_Slow(a, b, c, d, e)
}

export function StoreIC_Miss(a, b, c, d, e) {
	return %StoreIC_Miss(a, b, c, d, e)
}

export function StoreInArrayLiteralIC_Slow(a, b, c, d, e) {
	return %StoreInArrayLiteralIC_Slow(a, b, c, d, e)
}

export function StorePropertyWithInterceptor(a, b, c, d, e) {
	return %StorePropertyWithInterceptor(a, b, c, d, e)
}

export function CloneObjectIC_Miss(a, b, c, d) {
	return %CloneObjectIC_Miss(a, b, c, d)
}

export function KeyedHasIC_Miss(a, b, c, d) {
	return %KeyedHasIC_Miss(a, b, c, d)
}

export function HasElementWithInterceptor(a, b) {
	return %HasElementWithInterceptor(a, b)
}

