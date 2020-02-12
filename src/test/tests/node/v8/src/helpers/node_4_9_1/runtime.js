export function FinishArrayPrototypeSetup(a) {
	return %FinishArrayPrototypeSetup(a)
}

export function SpecialArrayFunctions() {
	return %SpecialArrayFunctions()
}

export function TransitionElementsKind(a, b) {
	return %TransitionElementsKind(a, b)
}

export function PushIfAbsent(a, b) {
	return %PushIfAbsent(a, b)
}

export function ArrayConcat(a) {
	return %ArrayConcat(a)
}

export function RemoveArrayHoles(a, b) {
	return %RemoveArrayHoles(a, b)
}

export function MoveArrayContents(a, b) {
	return %MoveArrayContents(a, b)
}

export function EstimateNumberOfElements(a) {
	return %EstimateNumberOfElements(a)
}

export function GetArrayKeys(a, b) {
	return %GetArrayKeys(a, b)
}

export function ArrayConstructor(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
	return %ArrayConstructor(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
}

export function ArrayConstructorWithSubclassing(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
	return %ArrayConstructorWithSubclassing(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
}

export function InternalArrayConstructor(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
	return %InternalArrayConstructor(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
}

export function NormalizeElements(a) {
	return %NormalizeElements(a)
}

export function GrowArrayElements(a, b) {
	return %GrowArrayElements(a, b)
}

export function HasComplexElements(a) {
	return %HasComplexElements(a)
}

export function IsArray(a) {
	return %IsArray(a)
}

export function HasCachedArrayIndex(a) {
	return %HasCachedArrayIndex(a)
}

export function GetCachedArrayIndex(a) {
	return %GetCachedArrayIndex(a)
}

export function FixedArrayGet(a, b) {
	return %FixedArrayGet(a, b)
}

export function FixedArraySet(a, b, c) {
	return %FixedArraySet(a, b, c)
}

export function FastOneByteArrayJoin(a, b) {
	return %FastOneByteArrayJoin(a, b)
}

export function AtomicsCompareExchange(a, b, c, d) {
	return %AtomicsCompareExchange(a, b, c, d)
}

export function AtomicsLoad(a, b) {
	return %AtomicsLoad(a, b)
}

export function AtomicsStore(a, b, c) {
	return %AtomicsStore(a, b, c)
}

export function AtomicsAdd(a, b, c) {
	return %AtomicsAdd(a, b, c)
}

export function AtomicsSub(a, b, c) {
	return %AtomicsSub(a, b, c)
}

export function AtomicsAnd(a, b, c) {
	return %AtomicsAnd(a, b, c)
}

export function AtomicsOr(a, b, c) {
	return %AtomicsOr(a, b, c)
}

export function AtomicsXor(a, b, c) {
	return %AtomicsXor(a, b, c)
}

export function AtomicsExchange(a, b, c) {
	return %AtomicsExchange(a, b, c)
}

export function AtomicsIsLockFree(a) {
	return %AtomicsIsLockFree(a)
}

export function ThrowNonMethodError() {
	return %ThrowNonMethodError()
}

export function ThrowUnsupportedSuperError() {
	return %ThrowUnsupportedSuperError()
}

export function ThrowConstructorNonCallableError() {
	return %ThrowConstructorNonCallableError()
}

export function ThrowArrayNotSubclassableError() {
	return %ThrowArrayNotSubclassableError()
}

export function ThrowStaticPrototypeError() {
	return %ThrowStaticPrototypeError()
}

export function ThrowIfStaticPrototype(a) {
	return %ThrowIfStaticPrototype(a)
}

export function ToMethod(a, b) {
	return %ToMethod(a, b)
}

export function HomeObjectSymbol() {
	return %HomeObjectSymbol()
}

export function DefineClass(a, b, c, d, e, f) {
	return %DefineClass(a, b, c, d, e, f)
}

export function DefineClassMethod(a, b, c) {
	return %DefineClassMethod(a, b, c)
}

export function ClassGetSourceCode(a) {
	return %ClassGetSourceCode(a)
}

export function LoadFromSuper(a, b, c, d) {
	return %LoadFromSuper(a, b, c, d)
}

export function LoadKeyedFromSuper(a, b, c, d) {
	return %LoadKeyedFromSuper(a, b, c, d)
}

export function StoreToSuper_Strict(a, b, c, d) {
	return %StoreToSuper_Strict(a, b, c, d)
}

export function StoreToSuper_Sloppy(a, b, c, d) {
	return %StoreToSuper_Sloppy(a, b, c, d)
}

export function StoreKeyedToSuper_Strict(a, b, c, d) {
	return %StoreKeyedToSuper_Strict(a, b, c, d)
}

export function StoreKeyedToSuper_Sloppy(a, b, c, d) {
	return %StoreKeyedToSuper_Sloppy(a, b, c, d)
}

export function HandleStepInForDerivedConstructors(a) {
	return %HandleStepInForDerivedConstructors(a)
}

export function DefaultConstructorCallSuper(a, b) {
	return %DefaultConstructorCallSuper(a, b)
}

export function CallSuperWithSpread(a) {
	return %CallSuperWithSpread(a)
}

export function StringGetRawHashField(a) {
	return %StringGetRawHashField(a)
}

export function TheHole() {
	return %TheHole()
}

export function JSCollectionGetTable(a) {
	return %JSCollectionGetTable(a)
}

export function GenericHash(a) {
	return %GenericHash(a)
}

export function SetInitialize(a) {
	return %SetInitialize(a)
}

export function SetGrow(a) {
	return %SetGrow(a)
}

export function SetShrink(a) {
	return %SetShrink(a)
}

export function SetClear(a) {
	return %SetClear(a)
}

export function SetIteratorInitialize(a, b, c) {
	return %SetIteratorInitialize(a, b, c)
}

export function SetIteratorClone(a) {
	return %SetIteratorClone(a)
}

export function SetIteratorNext(a, b) {
	return %SetIteratorNext(a, b)
}

export function SetIteratorDetails(a) {
	return %SetIteratorDetails(a)
}

export function MapInitialize(a) {
	return %MapInitialize(a)
}

export function MapShrink(a) {
	return %MapShrink(a)
}

export function MapClear(a) {
	return %MapClear(a)
}

export function MapGrow(a) {
	return %MapGrow(a)
}

export function MapIteratorInitialize(a, b, c) {
	return %MapIteratorInitialize(a, b, c)
}

export function MapIteratorClone(a) {
	return %MapIteratorClone(a)
}

export function MapIteratorDetails(a) {
	return %MapIteratorDetails(a)
}

export function GetWeakMapEntries(a, b) {
	return %GetWeakMapEntries(a, b)
}

export function MapIteratorNext(a, b) {
	return %MapIteratorNext(a, b)
}

export function WeakCollectionInitialize(a) {
	return %WeakCollectionInitialize(a)
}

export function WeakCollectionGet(a, b, c) {
	return %WeakCollectionGet(a, b, c)
}

export function WeakCollectionHas(a, b, c) {
	return %WeakCollectionHas(a, b, c)
}

export function WeakCollectionDelete(a, b, c) {
	return %WeakCollectionDelete(a, b, c)
}

export function WeakCollectionSet(a, b, c, d) {
	return %WeakCollectionSet(a, b, c, d)
}

export function GetWeakSetValues(a, b) {
	return %GetWeakSetValues(a, b)
}

export function ObservationWeakMapCreate() {
	return %ObservationWeakMapCreate()
}

export function CompileLazy(a) {
	return %CompileLazy(a)
}

export function CompileOptimized(a, b) {
	return %CompileOptimized(a, b)
}

export function NotifyStubFailure() {
	return %NotifyStubFailure()
}

export function NotifyDeoptimized(a) {
	return %NotifyDeoptimized(a)
}

export function CompileForOnStackReplacement(a) {
	return %CompileForOnStackReplacement(a)
}

export function TryInstallOptimizedCode(a) {
	return %TryInstallOptimizedCode(a)
}

export function CompileString(a, b) {
	return %CompileString(a, b)
}

export function ResolvePossiblyDirectEval(a, b, c, d, e) {
	return %ResolvePossiblyDirectEval(a, b, c, d, e)
}

export function DateMakeDay(a, b) {
	return %DateMakeDay(a, b)
}

export function DateSetValue(a, b, c) {
	return %DateSetValue(a, b, c)
}

export function IsDate(a) {
	return %IsDate(a)
}

export function ThrowNotDateError() {
	return %ThrowNotDateError()
}

export function DateCurrentTime() {
	return %DateCurrentTime()
}

export function DateParseString(a, b) {
	return %DateParseString(a, b)
}

export function DateLocalTimezone(a) {
	return %DateLocalTimezone(a)
}

export function DateToUTC(a) {
	return %DateToUTC(a)
}

export function DateCacheVersion() {
	return %DateCacheVersion()
}

export function DateField(a, b) {
	return %DateField(a, b)
}

export function DebugBreak() {
	return %DebugBreak()
}

export function SetDebugEventListener(a, b) {
	return %SetDebugEventListener(a, b)
}

export function ScheduleBreak() {
	return %ScheduleBreak()
}

export function DebugGetInternalProperties(a) {
	return %DebugGetInternalProperties(a)
}

export function DebugGetPropertyDetails(a, b) {
	return %DebugGetPropertyDetails(a, b)
}

export function DebugGetProperty(a, b) {
	return %DebugGetProperty(a, b)
}

export function DebugPropertyTypeFromDetails(a) {
	return %DebugPropertyTypeFromDetails(a)
}

export function DebugPropertyAttributesFromDetails(a) {
	return %DebugPropertyAttributesFromDetails(a)
}

export function DebugPropertyIndexFromDetails(a) {
	return %DebugPropertyIndexFromDetails(a)
}

export function DebugNamedInterceptorPropertyValue(a, b) {
	return %DebugNamedInterceptorPropertyValue(a, b)
}

export function DebugIndexedInterceptorElementValue(a, b) {
	return %DebugIndexedInterceptorElementValue(a, b)
}

export function CheckExecutionState(a) {
	return %CheckExecutionState(a)
}

export function GetFrameCount(a) {
	return %GetFrameCount(a)
}

export function GetFrameDetails(a, b) {
	return %GetFrameDetails(a, b)
}

export function GetScopeCount(a, b) {
	return %GetScopeCount(a, b)
}

export function GetStepInPositions(a, b) {
	return %GetStepInPositions(a, b)
}

export function GetScopeDetails(a, b, c, d) {
	return %GetScopeDetails(a, b, c, d)
}

export function GetAllScopesDetails(a, b, c, d) {
	return %GetAllScopesDetails(a, b, c, d)
}

export function GetFunctionScopeCount(a) {
	return %GetFunctionScopeCount(a)
}

export function GetFunctionScopeDetails(a, b) {
	return %GetFunctionScopeDetails(a, b)
}

export function SetScopeVariableValue(a, b, c, d, e, f) {
	return %SetScopeVariableValue(a, b, c, d, e, f)
}

export function DebugPrintScopes() {
	return %DebugPrintScopes()
}

export function GetThreadCount(a) {
	return %GetThreadCount(a)
}

export function GetThreadDetails(a, b) {
	return %GetThreadDetails(a, b)
}

export function SetDisableBreak(a) {
	return %SetDisableBreak(a)
}

export function GetBreakLocations(a, b) {
	return %GetBreakLocations(a, b)
}

export function SetFunctionBreakPoint(a, b, c) {
	return %SetFunctionBreakPoint(a, b, c)
}

export function SetScriptBreakPoint(a, b, c, d) {
	return %SetScriptBreakPoint(a, b, c, d)
}

export function ClearBreakPoint(a) {
	return %ClearBreakPoint(a)
}

export function ChangeBreakOnException(a, b) {
	return %ChangeBreakOnException(a, b)
}

export function IsBreakOnException(a) {
	return %IsBreakOnException(a)
}

export function PrepareStep(a, b, c, d) {
	return %PrepareStep(a, b, c, d)
}

export function ClearStepping() {
	return %ClearStepping()
}

export function DebugEvaluate(a, b, c, d, e, f) {
	return %DebugEvaluate(a, b, c, d, e, f)
}

export function DebugEvaluateGlobal(a, b, c, d) {
	return %DebugEvaluateGlobal(a, b, c, d)
}

export function DebugGetLoadedScripts() {
	return %DebugGetLoadedScripts()
}

export function DebugReferencedBy(a, b, c) {
	return %DebugReferencedBy(a, b, c)
}

export function DebugConstructedBy(a, b) {
	return %DebugConstructedBy(a, b)
}

export function DebugGetPrototype(a) {
	return %DebugGetPrototype(a)
}

export function DebugSetScriptSource(a, b) {
	return %DebugSetScriptSource(a, b)
}

export function FunctionGetInferredName(a) {
	return %FunctionGetInferredName(a)
}

export function GetFunctionCodePositionFromSource(a, b) {
	return %GetFunctionCodePositionFromSource(a, b)
}

export function ExecuteInDebugContext(a) {
	return %ExecuteInDebugContext(a)
}

export function GetDebugContext() {
	return %GetDebugContext()
}

export function CollectGarbage(a) {
	return %CollectGarbage(a)
}

export function GetHeapUsage() {
	return %GetHeapUsage()
}

export function GetScript(a) {
	return %GetScript(a)
}

export function DebugCallbackSupportsStepping(a) {
	return %DebugCallbackSupportsStepping(a)
}

export function DebugPrepareStepInIfStepping(a) {
	return %DebugPrepareStepInIfStepping(a)
}

export function DebugPushPromise(a, b) {
	return %DebugPushPromise(a, b)
}

export function DebugPopPromise() {
	return %DebugPopPromise()
}

export function DebugPromiseEvent(a) {
	return %DebugPromiseEvent(a)
}

export function DebugAsyncTaskEvent(a) {
	return %DebugAsyncTaskEvent(a)
}

export function DebugIsActive() {
	return %DebugIsActive()
}

export function DebugBreakInOptimizedCode() {
	return %DebugBreakInOptimizedCode()
}

export function ForInDone(a, b) {
	return %ForInDone(a, b)
}

export function ForInFilter(a, b) {
	return %ForInFilter(a, b)
}

export function ForInNext(a, b, c, d) {
	return %ForInNext(a, b, c, d)
}

export function ForInStep(a) {
	return %ForInStep(a)
}

export function IsSloppyModeFunction(a) {
	return %IsSloppyModeFunction(a)
}

export function FunctionGetName(a) {
	return %FunctionGetName(a)
}

export function FunctionSetName(a, b) {
	return %FunctionSetName(a, b)
}

export function FunctionNameShouldPrintAsAnonymous(a) {
	return %FunctionNameShouldPrintAsAnonymous(a)
}

export function FunctionMarkNameShouldPrintAsAnonymous(a) {
	return %FunctionMarkNameShouldPrintAsAnonymous(a)
}

export function FunctionIsArrow(a) {
	return %FunctionIsArrow(a)
}

export function FunctionIsConciseMethod(a) {
	return %FunctionIsConciseMethod(a)
}

export function FunctionRemovePrototype(a) {
	return %FunctionRemovePrototype(a)
}

export function FunctionGetScript(a) {
	return %FunctionGetScript(a)
}

export function FunctionGetSourceCode(a) {
	return %FunctionGetSourceCode(a)
}

export function FunctionGetScriptSourcePosition(a) {
	return %FunctionGetScriptSourcePosition(a)
}

export function FunctionGetPositionForOffset(a, b) {
	return %FunctionGetPositionForOffset(a, b)
}

export function FunctionSetInstanceClassName(a, b) {
	return %FunctionSetInstanceClassName(a, b)
}

export function FunctionSetLength(a, b) {
	return %FunctionSetLength(a, b)
}

export function FunctionSetPrototype(a, b) {
	return %FunctionSetPrototype(a, b)
}

export function FunctionIsAPIFunction(a) {
	return %FunctionIsAPIFunction(a)
}

export function FunctionIsBuiltin(a) {
	return %FunctionIsBuiltin(a)
}

export function SetCode(a, b) {
	return %SetCode(a, b)
}

export function SetNativeFlag(a) {
	return %SetNativeFlag(a)
}

export function ThrowStrongModeTooFewArguments() {
	return %ThrowStrongModeTooFewArguments()
}

export function IsConstructor(a) {
	return %IsConstructor(a)
}

export function SetForceInlineFlag(a) {
	return %SetForceInlineFlag(a)
}

export function FunctionBindArguments(a, b, c, d) {
	return %FunctionBindArguments(a, b, c, d)
}

export function BoundFunctionGetBindings(a) {
	return %BoundFunctionGetBindings(a)
}

export function NewObjectFromBound(a) {
	return %NewObjectFromBound(a)
}

export function Call(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
	return %Call(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
}

export function Apply(a, b, c, d, e) {
	return %Apply(a, b, c, d, e)
}

export function GetFunctionDelegate(a) {
	return %GetFunctionDelegate(a)
}

export function GetConstructorDelegate(a) {
	return %GetConstructorDelegate(a)
}

export function GetOriginalConstructor() {
	return %GetOriginalConstructor()
}

export function CallFunction(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
	return %CallFunction(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
}

export function IsConstructCall() {
	return %IsConstructCall()
}

export function IsFunction(a) {
	return %IsFunction(a)
}

export function CreateJSGeneratorObject() {
	return %CreateJSGeneratorObject()
}

export function SuspendJSGeneratorObject(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
	return %SuspendJSGeneratorObject(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
}

export function ResumeJSGeneratorObject(a, b, c) {
	return %ResumeJSGeneratorObject(a, b, c)
}

export function GeneratorClose(a) {
	return %GeneratorClose(a)
}

export function GeneratorGetFunction(a) {
	return %GeneratorGetFunction(a)
}

export function GeneratorGetContext(a) {
	return %GeneratorGetContext(a)
}

export function GeneratorGetReceiver(a) {
	return %GeneratorGetReceiver(a)
}

export function GeneratorGetContinuation(a) {
	return %GeneratorGetContinuation(a)
}

export function GeneratorGetSourcePosition(a) {
	return %GeneratorGetSourcePosition(a)
}

export function FunctionIsGenerator(a) {
	return %FunctionIsGenerator(a)
}

export function GeneratorNext(a, b) {
	return %GeneratorNext(a, b)
}

export function GeneratorThrow(a, b) {
	return %GeneratorThrow(a, b)
}

export function CanonicalizeLanguageTag(a) {
	return %CanonicalizeLanguageTag(a)
}

export function AvailableLocalesOf(a) {
	return %AvailableLocalesOf(a)
}

export function GetDefaultICULocale() {
	return %GetDefaultICULocale()
}

export function GetLanguageTagVariants(a) {
	return %GetLanguageTagVariants(a)
}

export function IsInitializedIntlObject(a) {
	return %IsInitializedIntlObject(a)
}

export function IsInitializedIntlObjectOfType(a, b) {
	return %IsInitializedIntlObjectOfType(a, b)
}

export function MarkAsInitializedIntlObjectOfType(a, b, c) {
	return %MarkAsInitializedIntlObjectOfType(a, b, c)
}

export function GetImplFromInitializedIntlObject(a) {
	return %GetImplFromInitializedIntlObject(a)
}

export function CreateDateTimeFormat(a, b, c) {
	return %CreateDateTimeFormat(a, b, c)
}

export function InternalDateFormat(a, b) {
	return %InternalDateFormat(a, b)
}

export function InternalDateParse(a, b) {
	return %InternalDateParse(a, b)
}

export function CreateNumberFormat(a, b, c) {
	return %CreateNumberFormat(a, b, c)
}

export function InternalNumberFormat(a, b) {
	return %InternalNumberFormat(a, b)
}

export function InternalNumberParse(a, b) {
	return %InternalNumberParse(a, b)
}

export function CreateCollator(a, b, c) {
	return %CreateCollator(a, b, c)
}

export function InternalCompare(a, b, c) {
	return %InternalCompare(a, b, c)
}

export function StringNormalize(a, b) {
	return %StringNormalize(a, b)
}

export function CreateBreakIterator(a, b, c) {
	return %CreateBreakIterator(a, b, c)
}

export function BreakIteratorAdoptText(a, b) {
	return %BreakIteratorAdoptText(a, b)
}

export function BreakIteratorFirst(a) {
	return %BreakIteratorFirst(a)
}

export function BreakIteratorNext(a) {
	return %BreakIteratorNext(a)
}

export function BreakIteratorCurrent(a) {
	return %BreakIteratorCurrent(a)
}

export function BreakIteratorBreakType(a) {
	return %BreakIteratorBreakType(a)
}

export function CheckIsBootstrapping() {
	return %CheckIsBootstrapping()
}

export function Throw(a) {
	return %Throw(a)
}

export function ReThrow(a) {
	return %ReThrow(a)
}

export function UnwindAndFindExceptionHandler() {
	return %UnwindAndFindExceptionHandler()
}

export function PromoteScheduledException() {
	return %PromoteScheduledException()
}

export function ThrowReferenceError(a) {
	return %ThrowReferenceError(a)
}

export function NewTypeError(a, b) {
	return %NewTypeError(a, b)
}

export function NewSyntaxError(a, b) {
	return %NewSyntaxError(a, b)
}

export function NewReferenceError(a, b) {
	return %NewReferenceError(a, b)
}

export function ThrowIteratorResultNotAnObject(a) {
	return %ThrowIteratorResultNotAnObject(a)
}

export function ThrowStrongModeImplicitConversion() {
	return %ThrowStrongModeImplicitConversion()
}

export function PromiseRejectEvent(a, b, c) {
	return %PromiseRejectEvent(a, b, c)
}

export function PromiseRevokeReject(a) {
	return %PromiseRevokeReject(a)
}

export function PromiseHasHandlerSymbol() {
	return %PromiseHasHandlerSymbol()
}

export function StackGuard() {
	return %StackGuard()
}

export function Interrupt() {
	return %Interrupt()
}

export function AllocateInNewSpace(a) {
	return %AllocateInNewSpace(a)
}

export function AllocateInTargetSpace(a, b) {
	return %AllocateInTargetSpace(a, b)
}

export function CollectStackTrace(a, b) {
	return %CollectStackTrace(a, b)
}

export function RenderCallSite() {
	return %RenderCallSite()
}

export function GetFromCacheRT(a, b) {
	return %GetFromCacheRT(a, b)
}

export function MessageGetStartPosition(a) {
	return %MessageGetStartPosition(a)
}

export function MessageGetScript(a) {
	return %MessageGetScript(a)
}

export function FormatMessageString(a, b, c, d) {
	return %FormatMessageString(a, b, c, d)
}

export function CallSiteGetFileNameRT(a, b, c) {
	return %CallSiteGetFileNameRT(a, b, c)
}

export function CallSiteGetFunctionNameRT(a, b, c) {
	return %CallSiteGetFunctionNameRT(a, b, c)
}

export function CallSiteGetScriptNameOrSourceUrlRT(a, b, c) {
	return %CallSiteGetScriptNameOrSourceUrlRT(a, b, c)
}

export function CallSiteGetMethodNameRT(a, b, c) {
	return %CallSiteGetMethodNameRT(a, b, c)
}

export function CallSiteGetLineNumberRT(a, b, c) {
	return %CallSiteGetLineNumberRT(a, b, c)
}

export function CallSiteGetColumnNumberRT(a, b, c) {
	return %CallSiteGetColumnNumberRT(a, b, c)
}

export function CallSiteIsNativeRT(a, b, c) {
	return %CallSiteIsNativeRT(a, b, c)
}

export function CallSiteIsToplevelRT(a, b, c) {
	return %CallSiteIsToplevelRT(a, b, c)
}

export function CallSiteIsEvalRT(a, b, c) {
	return %CallSiteIsEvalRT(a, b, c)
}

export function CallSiteIsConstructorRT(a, b, c) {
	return %CallSiteIsConstructorRT(a, b, c)
}

export function IS_VAR(a) {
	return %IS_VAR(a)
}

export function GetFromCache(a, b) {
	return %GetFromCache(a, b)
}

export function IncrementStatsCounter(a) {
	return %IncrementStatsCounter(a)
}

export function Likely(a) {
	return %Likely(a)
}

export function Unlikely(a) {
	return %Unlikely(a)
}

export function HarmonyToString() {
	return %HarmonyToString()
}

export function GetTypeFeedbackVector(a) {
	return %GetTypeFeedbackVector(a)
}

export function GetCallerJSFunction() {
	return %GetCallerJSFunction()
}

export function QuoteJSONString(a) {
	return %QuoteJSONString(a)
}

export function BasicJSONStringify(a) {
	return %BasicJSONStringify(a)
}

export function ParseJson(a) {
	return %ParseJson(a)
}

export function CreateObjectLiteral(a, b, c, d) {
	return %CreateObjectLiteral(a, b, c, d)
}

export function CreateArrayLiteral(a, b, c, d) {
	return %CreateArrayLiteral(a, b, c, d)
}

export function CreateArrayLiteralStubBailout(a, b, c) {
	return %CreateArrayLiteralStubBailout(a, b, c)
}

export function StoreArrayLiteralElement(a, b, c, d, e) {
	return %StoreArrayLiteralElement(a, b, c, d, e)
}

export function LiveEditFindSharedFunctionInfosForScript(a) {
	return %LiveEditFindSharedFunctionInfosForScript(a)
}

export function LiveEditGatherCompileInfo(a, b) {
	return %LiveEditGatherCompileInfo(a, b)
}

export function LiveEditReplaceScript(a, b, c) {
	return %LiveEditReplaceScript(a, b, c)
}

export function LiveEditFunctionSourceUpdated(a) {
	return %LiveEditFunctionSourceUpdated(a)
}

export function LiveEditReplaceFunctionCode(a, b) {
	return %LiveEditReplaceFunctionCode(a, b)
}

export function LiveEditFunctionSetScript(a, b) {
	return %LiveEditFunctionSetScript(a, b)
}

export function LiveEditReplaceRefToNestedFunction(a, b, c) {
	return %LiveEditReplaceRefToNestedFunction(a, b, c)
}

export function LiveEditPatchFunctionPositions(a, b) {
	return %LiveEditPatchFunctionPositions(a, b)
}

export function LiveEditCheckAndDropActivations(a, b) {
	return %LiveEditCheckAndDropActivations(a, b)
}

export function LiveEditCompareStrings(a, b) {
	return %LiveEditCompareStrings(a, b)
}

export function LiveEditRestartFrame(a, b) {
	return %LiveEditRestartFrame(a, b)
}

export function MathAcos(a) {
	return %MathAcos(a)
}

export function MathAsin(a) {
	return %MathAsin(a)
}

export function MathAtan(a) {
	return %MathAtan(a)
}

export function MathLogRT(a) {
	return %MathLogRT(a)
}

export function DoubleHi(a) {
	return %DoubleHi(a)
}

export function DoubleLo(a) {
	return %DoubleLo(a)
}

export function ConstructDouble(a, b) {
	return %ConstructDouble(a, b)
}

export function RemPiO2(a, b) {
	return %RemPiO2(a, b)
}

export function MathAtan2(a, b) {
	return %MathAtan2(a, b)
}

export function MathExpRT(a) {
	return %MathExpRT(a)
}

export function MathClz32(a) {
	return %MathClz32(a)
}

export function MathFloor(a) {
	return %MathFloor(a)
}

export function MathPowSlow(a, b) {
	return %MathPowSlow(a, b)
}

export function MathPowRT(a, b) {
	return %MathPowRT(a, b)
}

export function RoundNumber(a) {
	return %RoundNumber(a)
}

export function MathSqrt(a) {
	return %MathSqrt(a)
}

export function MathFround(a) {
	return %MathFround(a)
}

export function MathPow(a, b) {
	return %MathPow(a, b)
}

export function IsMinusZero(a) {
	return %IsMinusZero(a)
}

export function NumberToRadixString(a, b) {
	return %NumberToRadixString(a, b)
}

export function NumberToFixed(a, b) {
	return %NumberToFixed(a, b)
}

export function NumberToExponential(a, b) {
	return %NumberToExponential(a, b)
}

export function NumberToPrecision(a, b) {
	return %NumberToPrecision(a, b)
}

export function IsValidSmi(a) {
	return %IsValidSmi(a)
}

export function StringToNumber(a) {
	return %StringToNumber(a)
}

export function StringParseInt(a, b) {
	return %StringParseInt(a, b)
}

export function StringParseFloat(a) {
	return %StringParseFloat(a)
}

export function NumberToStringRT(a) {
	return %NumberToStringRT(a)
}

export function NumberToStringSkipCache(a) {
	return %NumberToStringSkipCache(a)
}

export function NumberToInteger(a) {
	return %NumberToInteger(a)
}

export function NumberToIntegerMapMinusZero(a) {
	return %NumberToIntegerMapMinusZero(a)
}

export function NumberToJSUint32(a) {
	return %NumberToJSUint32(a)
}

export function NumberToJSInt32(a) {
	return %NumberToJSInt32(a)
}

export function NumberToSmi(a) {
	return %NumberToSmi(a)
}

export function NumberAdd(a, b) {
	return %NumberAdd(a, b)
}

export function NumberSub(a, b) {
	return %NumberSub(a, b)
}

export function NumberMul(a, b) {
	return %NumberMul(a, b)
}

export function NumberUnaryMinus(a) {
	return %NumberUnaryMinus(a)
}

export function NumberDiv(a, b) {
	return %NumberDiv(a, b)
}

export function NumberMod(a, b) {
	return %NumberMod(a, b)
}

export function NumberImul(a, b) {
	return %NumberImul(a, b)
}

export function NumberOr(a, b) {
	return %NumberOr(a, b)
}

export function NumberAnd(a, b) {
	return %NumberAnd(a, b)
}

export function NumberXor(a, b) {
	return %NumberXor(a, b)
}

export function NumberShl(a, b) {
	return %NumberShl(a, b)
}

export function NumberShr(a, b) {
	return %NumberShr(a, b)
}

export function NumberSar(a, b) {
	return %NumberSar(a, b)
}

export function NumberEquals(a, b) {
	return %NumberEquals(a, b)
}

export function NumberCompare(a, b, c) {
	return %NumberCompare(a, b, c)
}

export function SmiLexicographicCompare(a, b) {
	return %SmiLexicographicCompare(a, b)
}

export function MaxSmi() {
	return %MaxSmi()
}

export function NumberToString(a) {
	return %NumberToString(a)
}

export function IsSmi(a) {
	return %IsSmi(a)
}

export function IsNonNegativeSmi(a) {
	return %IsNonNegativeSmi(a)
}

export function GetRootNaN() {
	return %GetRootNaN()
}

export function GetPrototype(a) {
	return %GetPrototype(a)
}

export function InternalSetPrototype(a, b) {
	return %InternalSetPrototype(a, b)
}

export function SetPrototype(a, b) {
	return %SetPrototype(a, b)
}

export function IsInPrototypeChain(a, b) {
	return %IsInPrototypeChain(a, b)
}

export function GetOwnProperty(a, b) {
	return %GetOwnProperty(a, b)
}

export function PreventExtensions(a) {
	return %PreventExtensions(a)
}

export function IsExtensible(a) {
	return %IsExtensible(a)
}

export function OptimizeObjectForAddingMultipleProperties(a, b) {
	return %OptimizeObjectForAddingMultipleProperties(a, b)
}

export function ObjectFreeze(a) {
	return %ObjectFreeze(a)
}

export function ObjectSeal(a) {
	return %ObjectSeal(a)
}

export function GetProperty(a, b) {
	return %GetProperty(a, b)
}

export function GetPropertyStrong(a, b) {
	return %GetPropertyStrong(a, b)
}

export function KeyedGetProperty(a, b) {
	return %KeyedGetProperty(a, b)
}

export function KeyedGetPropertyStrong(a, b) {
	return %KeyedGetPropertyStrong(a, b)
}

export function AddNamedProperty(a, b, c, d) {
	return %AddNamedProperty(a, b, c, d)
}

export function SetProperty(a, b, c, d) {
	return %SetProperty(a, b, c, d)
}

export function AddElement(a, b, c) {
	return %AddElement(a, b, c)
}

export function AppendElement(a, b) {
	return %AppendElement(a, b)
}

export function DeleteProperty(a, b, c) {
	return %DeleteProperty(a, b, c)
}

export function HasOwnProperty(a, b) {
	return %HasOwnProperty(a, b)
}

export function HasProperty(a, b) {
	return %HasProperty(a, b)
}

export function HasElement(a, b) {
	return %HasElement(a, b)
}

export function IsPropertyEnumerable(a, b) {
	return %IsPropertyEnumerable(a, b)
}

export function GetPropertyNames(a) {
	return %GetPropertyNames(a)
}

export function GetPropertyNamesFast(a) {
	return %GetPropertyNamesFast(a)
}

export function GetOwnPropertyNames(a, b) {
	return %GetOwnPropertyNames(a, b)
}

export function GetOwnElementNames(a) {
	return %GetOwnElementNames(a)
}

export function GetInterceptorInfo(a) {
	return %GetInterceptorInfo(a)
}

export function GetNamedInterceptorPropertyNames(a) {
	return %GetNamedInterceptorPropertyNames(a)
}

export function GetIndexedInterceptorElementNames(a) {
	return %GetIndexedInterceptorElementNames(a)
}

export function OwnKeys(a) {
	return %OwnKeys(a)
}

export function ToFastProperties(a) {
	return %ToFastProperties(a)
}

export function ToBool(a) {
	return %ToBool(a)
}

export function NewStringWrapper(a) {
	return %NewStringWrapper(a)
}

export function AllocateHeapNumber() {
	return %AllocateHeapNumber()
}

export function NewObject(a, b) {
	return %NewObject(a, b)
}

export function NewObjectWithAllocationSite(a, b, c) {
	return %NewObjectWithAllocationSite(a, b, c)
}

export function FinalizeInstanceSize(a) {
	return %FinalizeInstanceSize(a)
}

export function GlobalProxy(a) {
	return %GlobalProxy(a)
}

export function LookupAccessor(a, b, c) {
	return %LookupAccessor(a, b, c)
}

export function LoadMutableDouble(a, b) {
	return %LoadMutableDouble(a, b)
}

export function TryMigrateInstance(a) {
	return %TryMigrateInstance(a)
}

export function IsJSGlobalProxy(a) {
	return %IsJSGlobalProxy(a)
}

export function DefineAccessorPropertyUnchecked(a, b, c, d, e) {
	return %DefineAccessorPropertyUnchecked(a, b, c, d, e)
}

export function DefineDataPropertyUnchecked(a, b, c, d) {
	return %DefineDataPropertyUnchecked(a, b, c, d)
}

export function GetDataProperty(a, b) {
	return %GetDataProperty(a, b)
}

export function HasFastPackedElements(a) {
	return %HasFastPackedElements(a)
}

export function ValueOf(a) {
	return %ValueOf(a)
}

export function SetValueOf(a, b) {
	return %SetValueOf(a, b)
}

export function JSValueGetValue(a) {
	return %JSValueGetValue(a)
}

export function HeapObjectGetMap(a) {
	return %HeapObjectGetMap(a)
}

export function MapGetInstanceType(a) {
	return %MapGetInstanceType(a)
}

export function ObjectEquals(a, b) {
	return %ObjectEquals(a, b)
}

export function IsObject(a) {
	return %IsObject(a)
}

export function IsUndetectableObject(a) {
	return %IsUndetectableObject(a)
}

export function IsSpecObject(a) {
	return %IsSpecObject(a)
}

export function IsStrong(a) {
	return %IsStrong(a)
}

export function ClassOf(a) {
	return %ClassOf(a)
}

export function DefineGetterPropertyUnchecked(a, b, c, d) {
	return %DefineGetterPropertyUnchecked(a, b, c, d)
}

export function DefineSetterPropertyUnchecked(a, b, c, d) {
	return %DefineSetterPropertyUnchecked(a, b, c, d)
}

export function IsObserved(a) {
	return %IsObserved(a)
}

export function SetIsObserved(a) {
	return %SetIsObserved(a)
}

export function EnqueueMicrotask(a) {
	return %EnqueueMicrotask(a)
}

export function RunMicrotasks() {
	return %RunMicrotasks()
}

export function DeliverObservationChangeRecords(a, b) {
	return %DeliverObservationChangeRecords(a, b)
}

export function GetObservationState() {
	return %GetObservationState()
}

export function ObserverObjectAndRecordHaveSameOrigin(a, b, c) {
	return %ObserverObjectAndRecordHaveSameOrigin(a, b, c)
}

export function ObjectWasCreatedInCurrentOrigin(a) {
	return %ObjectWasCreatedInCurrentOrigin(a)
}

export function GetObjectContextObjectObserve(a) {
	return %GetObjectContextObjectObserve(a)
}

export function GetObjectContextObjectGetNotifier(a) {
	return %GetObjectContextObjectGetNotifier(a)
}

export function GetObjectContextNotifierPerformChange(a) {
	return %GetObjectContextNotifierPerformChange(a)
}

export function CreateJSProxy(a, b) {
	return %CreateJSProxy(a, b)
}

export function CreateJSFunctionProxy(a, b, c, d) {
	return %CreateJSFunctionProxy(a, b, c, d)
}

export function IsJSProxy(a) {
	return %IsJSProxy(a)
}

export function IsJSFunctionProxy(a) {
	return %IsJSFunctionProxy(a)
}

export function GetHandler(a) {
	return %GetHandler(a)
}

export function GetCallTrap(a) {
	return %GetCallTrap(a)
}

export function GetConstructTrap(a) {
	return %GetConstructTrap(a)
}

export function Fix(a) {
	return %Fix(a)
}

export function StringReplaceGlobalRegExpWithString(a, b, c, d) {
	return %StringReplaceGlobalRegExpWithString(a, b, c, d)
}

export function StringSplit(a, b, c) {
	return %StringSplit(a, b, c)
}

export function RegExpExec(a, b, c, d) {
	return %RegExpExec(a, b, c, d)
}

export function RegExpConstructResultRT(a, b, c) {
	return %RegExpConstructResultRT(a, b, c)
}

export function RegExpConstructResult(a, b, c) {
	return %RegExpConstructResult(a, b, c)
}

export function RegExpInitializeAndCompile(a, b, c) {
	return %RegExpInitializeAndCompile(a, b, c)
}

export function MaterializeRegExpLiteral(a, b, c, d) {
	return %MaterializeRegExpLiteral(a, b, c, d)
}

export function RegExpExecMultiple(a, b, c, d) {
	return %RegExpExecMultiple(a, b, c, d)
}

export function RegExpExecReThrow(a, b, c, d) {
	return %RegExpExecReThrow(a, b, c, d)
}

export function IsRegExp(a) {
	return %IsRegExp(a)
}

export function ThrowConstAssignError() {
	return %ThrowConstAssignError()
}

export function DeclareGlobals(a, b, c) {
	return %DeclareGlobals(a, b, c)
}

export function InitializeVarGlobal(a, b, c) {
	return %InitializeVarGlobal(a, b, c)
}

export function InitializeConstGlobal(a, b) {
	return %InitializeConstGlobal(a, b)
}

export function DeclareLookupSlot(a, b, c, d) {
	return %DeclareLookupSlot(a, b, c, d)
}

export function InitializeLegacyConstLookupSlot(a, b, c) {
	return %InitializeLegacyConstLookupSlot(a, b, c)
}

export function NewArguments(a) {
	return %NewArguments(a)
}

export function NewSloppyArguments(a, b, c) {
	return %NewSloppyArguments(a, b, c)
}

export function NewStrictArguments(a, b, c) {
	return %NewStrictArguments(a, b, c)
}

export function NewRestParam(a, b, c, d) {
	return %NewRestParam(a, b, c, d)
}

export function NewRestParamSlow(a, b) {
	return %NewRestParamSlow(a, b)
}

export function NewClosureFromStubFailure(a) {
	return %NewClosureFromStubFailure(a)
}

export function NewClosure(a, b, c) {
	return %NewClosure(a, b, c)
}

export function NewScriptContext(a, b) {
	return %NewScriptContext(a, b)
}

export function NewFunctionContext(a) {
	return %NewFunctionContext(a)
}

export function PushWithContext(a, b) {
	return %PushWithContext(a, b)
}

export function PushCatchContext(a, b, c) {
	return %PushCatchContext(a, b, c)
}

export function PushBlockContext(a, b) {
	return %PushBlockContext(a, b)
}

export function IsJSModule(a) {
	return %IsJSModule(a)
}

export function PushModuleContext(a, b) {
	return %PushModuleContext(a, b)
}

export function DeclareModules(a) {
	return %DeclareModules(a)
}

export function DeleteLookupSlot(a, b) {
	return %DeleteLookupSlot(a, b)
}

export function StoreLookupSlot(a, b, c, d) {
	return %StoreLookupSlot(a, b, c, d)
}

export function GetArgumentsProperty(a) {
	return %GetArgumentsProperty(a)
}

export function ArgumentsLength() {
	return %ArgumentsLength()
}

export function Arguments(a) {
	return %Arguments(a)
}

export function StringReplaceOneCharWithString(a, b, c) {
	return %StringReplaceOneCharWithString(a, b, c)
}

export function StringIndexOf(a, b, c) {
	return %StringIndexOf(a, b, c)
}

export function StringLastIndexOf(a, b, c) {
	return %StringLastIndexOf(a, b, c)
}

export function StringLocaleCompare(a, b) {
	return %StringLocaleCompare(a, b)
}

export function SubStringRT(a, b, c) {
	return %SubStringRT(a, b, c)
}

export function SubString(a, b, c) {
	return %SubString(a, b, c)
}

export function StringAddRT(a, b) {
	return %StringAddRT(a, b)
}

export function StringAdd(a, b) {
	return %StringAdd(a, b)
}

export function InternalizeString(a) {
	return %InternalizeString(a)
}

export function StringMatch(a, b, c) {
	return %StringMatch(a, b, c)
}

export function StringCharCodeAtRT(a, b) {
	return %StringCharCodeAtRT(a, b)
}

export function CharFromCode(a) {
	return %CharFromCode(a)
}

export function StringCompareRT(a, b) {
	return %StringCompareRT(a, b)
}

export function StringCompare(a, b) {
	return %StringCompare(a, b)
}

export function StringBuilderConcat(a, b, c) {
	return %StringBuilderConcat(a, b, c)
}

export function StringBuilderJoin(a, b, c) {
	return %StringBuilderJoin(a, b, c)
}

export function SparseJoinWithSeparator(a, b, c) {
	return %SparseJoinWithSeparator(a, b, c)
}

export function StringToArray(a, b) {
	return %StringToArray(a, b)
}

export function StringToLowerCase(a) {
	return %StringToLowerCase(a)
}

export function StringToUpperCase(a) {
	return %StringToUpperCase(a)
}

export function StringTrim(a, b, c) {
	return %StringTrim(a, b, c)
}

export function TruncateString(a, b) {
	return %TruncateString(a, b)
}

export function NewString(a, b) {
	return %NewString(a, b)
}

export function NewConsString(a, b, c, d) {
	return %NewConsString(a, b, c, d)
}

export function StringEquals(a, b) {
	return %StringEquals(a, b)
}

export function FlattenString(a) {
	return %FlattenString(a)
}

export function StringCharFromCode(a) {
	return %StringCharFromCode(a)
}

export function StringCharAt(a, b) {
	return %StringCharAt(a, b)
}

export function OneByteSeqStringGetChar(a, b) {
	return %OneByteSeqStringGetChar(a, b)
}

export function OneByteSeqStringSetChar(a, b, c) {
	return %OneByteSeqStringSetChar(a, b, c)
}

export function TwoByteSeqStringGetChar(a, b) {
	return %TwoByteSeqStringGetChar(a, b)
}

export function TwoByteSeqStringSetChar(a, b, c) {
	return %TwoByteSeqStringSetChar(a, b, c)
}

export function StringCharCodeAt(a, b) {
	return %StringCharCodeAt(a, b)
}

export function IsStringWrapperSafeForDefaultValueOf(a) {
	return %IsStringWrapperSafeForDefaultValueOf(a)
}

export function StringGetLength(a) {
	return %StringGetLength(a)
}

export function CreateSymbol(a) {
	return %CreateSymbol(a)
}

export function CreatePrivateSymbol(a) {
	return %CreatePrivateSymbol(a)
}

export function CreateGlobalPrivateSymbol(a) {
	return %CreateGlobalPrivateSymbol(a)
}

export function NewSymbolWrapper(a) {
	return %NewSymbolWrapper(a)
}

export function SymbolDescription(a) {
	return %SymbolDescription(a)
}

export function SymbolRegistry() {
	return %SymbolRegistry()
}

export function SymbolIsPrivate(a) {
	return %SymbolIsPrivate(a)
}

export function DeoptimizeFunction(a) {
	return %DeoptimizeFunction(a)
}

export function DeoptimizeNow() {
	return %DeoptimizeNow()
}

export function RunningInSimulator() {
	return %RunningInSimulator()
}

export function IsConcurrentRecompilationSupported() {
	return %IsConcurrentRecompilationSupported()
}

export function OptimizeFunctionOnNextCall(a) {
	return %OptimizeFunctionOnNextCall(a)
}

export function OptimizeOsr(a) {
	return %OptimizeOsr(a)
}

export function NeverOptimizeFunction(a) {
	return %NeverOptimizeFunction(a)
}

export function GetOptimizationStatus(a) {
	return %GetOptimizationStatus(a)
}

export function UnblockConcurrentRecompilation() {
	return %UnblockConcurrentRecompilation()
}

export function GetOptimizationCount(a) {
	return %GetOptimizationCount(a)
}

export function GetUndetectable() {
	return %GetUndetectable()
}

export function ClearFunctionTypeFeedback(a) {
	return %ClearFunctionTypeFeedback(a)
}

export function NotifyContextDisposed() {
	return %NotifyContextDisposed()
}

export function SetAllocationTimeout(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
	return %SetAllocationTimeout(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
}

export function DebugPrint(a) {
	return %DebugPrint(a)
}

export function DebugTrace() {
	return %DebugTrace()
}

export function GlobalPrint(a) {
	return %GlobalPrint(a)
}

export function SystemBreak() {
	return %SystemBreak()
}

export function SetFlags(a) {
	return %SetFlags(a)
}

export function Abort(a) {
	return %Abort(a)
}

export function AbortJS(a) {
	return %AbortJS(a)
}

export function NativeScriptsCount() {
	return %NativeScriptsCount()
}

export function GetV8Version() {
	return %GetV8Version()
}

export function DisassembleFunction(a) {
	return %DisassembleFunction(a)
}

export function TraceEnter() {
	return %TraceEnter()
}

export function TraceExit(a) {
	return %TraceExit(a)
}

export function HaveSameMap(a, b) {
	return %HaveSameMap(a, b)
}

export function HasFastSmiElements(a) {
	return %HasFastSmiElements(a)
}

export function HasFastObjectElements(a) {
	return %HasFastObjectElements(a)
}

export function HasFastSmiOrObjectElements(a) {
	return %HasFastSmiOrObjectElements(a)
}

export function HasFastDoubleElements(a) {
	return %HasFastDoubleElements(a)
}

export function HasFastHoleyElements(a) {
	return %HasFastHoleyElements(a)
}

export function HasDictionaryElements(a) {
	return %HasDictionaryElements(a)
}

export function HasSloppyArgumentsElements(a) {
	return %HasSloppyArgumentsElements(a)
}

export function HasExternalArrayElements(a) {
	return %HasExternalArrayElements(a)
}

export function HasFastProperties(a) {
	return %HasFastProperties(a)
}

export function HasExternalUint8Elements(a) {
	return %HasExternalUint8Elements(a)
}

export function HasExternalInt8Elements(a) {
	return %HasExternalInt8Elements(a)
}

export function HasExternalUint16Elements(a) {
	return %HasExternalUint16Elements(a)
}

export function HasExternalInt16Elements(a) {
	return %HasExternalInt16Elements(a)
}

export function HasExternalUint32Elements(a) {
	return %HasExternalUint32Elements(a)
}

export function HasExternalInt32Elements(a) {
	return %HasExternalInt32Elements(a)
}

export function HasExternalFloat32Elements(a) {
	return %HasExternalFloat32Elements(a)
}

export function HasExternalFloat64Elements(a) {
	return %HasExternalFloat64Elements(a)
}

export function HasExternalUint8ClampedElements(a) {
	return %HasExternalUint8ClampedElements(a)
}

export function HasFixedUint8Elements(a) {
	return %HasFixedUint8Elements(a)
}

export function HasFixedInt8Elements(a) {
	return %HasFixedInt8Elements(a)
}

export function HasFixedUint16Elements(a) {
	return %HasFixedUint16Elements(a)
}

export function HasFixedInt16Elements(a) {
	return %HasFixedInt16Elements(a)
}

export function HasFixedUint32Elements(a) {
	return %HasFixedUint32Elements(a)
}

export function HasFixedInt32Elements(a) {
	return %HasFixedInt32Elements(a)
}

export function HasFixedFloat32Elements(a) {
	return %HasFixedFloat32Elements(a)
}

export function HasFixedFloat64Elements(a) {
	return %HasFixedFloat64Elements(a)
}

export function HasFixedUint8ClampedElements(a) {
	return %HasFixedUint8ClampedElements(a)
}

export function ArrayBufferInitialize(a, b, c) {
	return %ArrayBufferInitialize(a, b, c)
}

export function ArrayBufferGetByteLength(a) {
	return %ArrayBufferGetByteLength(a)
}

export function ArrayBufferSliceImpl(a, b, c) {
	return %ArrayBufferSliceImpl(a, b, c)
}

export function ArrayBufferIsView(a) {
	return %ArrayBufferIsView(a)
}

export function ArrayBufferNeuter(a) {
	return %ArrayBufferNeuter(a)
}

export function TypedArrayInitialize(a, b, c, d, e, f) {
	return %TypedArrayInitialize(a, b, c, d, e, f)
}

export function TypedArrayInitializeFromArrayLike(a, b, c, d) {
	return %TypedArrayInitializeFromArrayLike(a, b, c, d)
}

export function ArrayBufferViewGetByteLength(a) {
	return %ArrayBufferViewGetByteLength(a)
}

export function ArrayBufferViewGetByteOffset(a) {
	return %ArrayBufferViewGetByteOffset(a)
}

export function TypedArrayGetLength(a) {
	return %TypedArrayGetLength(a)
}

export function DataViewGetBuffer(a) {
	return %DataViewGetBuffer(a)
}

export function TypedArrayGetBuffer(a) {
	return %TypedArrayGetBuffer(a)
}

export function TypedArraySetFastCases(a, b, c) {
	return %TypedArraySetFastCases(a, b, c)
}

export function TypedArrayMaxSizeInHeap() {
	return %TypedArrayMaxSizeInHeap()
}

export function IsTypedArray(a) {
	return %IsTypedArray(a)
}

export function IsSharedTypedArray(a) {
	return %IsSharedTypedArray(a)
}

export function IsSharedIntegerTypedArray(a) {
	return %IsSharedIntegerTypedArray(a)
}

export function DataViewInitialize(a, b, c, d) {
	return %DataViewInitialize(a, b, c, d)
}

export function DataViewGetUint8(a, b, c) {
	return %DataViewGetUint8(a, b, c)
}

export function DataViewGetInt8(a, b, c) {
	return %DataViewGetInt8(a, b, c)
}

export function DataViewGetUint16(a, b, c) {
	return %DataViewGetUint16(a, b, c)
}

export function DataViewGetInt16(a, b, c) {
	return %DataViewGetInt16(a, b, c)
}

export function DataViewGetUint32(a, b, c) {
	return %DataViewGetUint32(a, b, c)
}

export function DataViewGetInt32(a, b, c) {
	return %DataViewGetInt32(a, b, c)
}

export function DataViewGetFloat32(a, b, c) {
	return %DataViewGetFloat32(a, b, c)
}

export function DataViewGetFloat64(a, b, c) {
	return %DataViewGetFloat64(a, b, c)
}

export function DataViewSetUint8(a, b, c, d) {
	return %DataViewSetUint8(a, b, c, d)
}

export function DataViewSetInt8(a, b, c, d) {
	return %DataViewSetInt8(a, b, c, d)
}

export function DataViewSetUint16(a, b, c, d) {
	return %DataViewSetUint16(a, b, c, d)
}

export function DataViewSetInt16(a, b, c, d) {
	return %DataViewSetInt16(a, b, c, d)
}

export function DataViewSetUint32(a, b, c, d) {
	return %DataViewSetUint32(a, b, c, d)
}

export function DataViewSetInt32(a, b, c, d) {
	return %DataViewSetInt32(a, b, c, d)
}

export function DataViewSetFloat32(a, b, c, d) {
	return %DataViewSetFloat32(a, b, c, d)
}

export function DataViewSetFloat64(a, b, c, d) {
	return %DataViewSetFloat64(a, b, c, d)
}

export function URIEscape(a) {
	return %URIEscape(a)
}

export function URIUnescape(a) {
	return %URIUnescape(a)
}

export function LoadLookupSlot(a, b) {
	return %LoadLookupSlot(a, b)
}

export function LoadLookupSlotNoReferenceError(a, b) {
	return %LoadLookupSlotNoReferenceError(a, b)
}

