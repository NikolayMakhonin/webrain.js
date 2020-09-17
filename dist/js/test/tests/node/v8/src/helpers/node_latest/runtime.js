"use strict";

exports.__esModule = true;
exports.ArrayIncludes_Slow = ArrayIncludes_Slow;
exports.ArrayIndexOf = ArrayIndexOf;
exports.ArrayIsArray = ArrayIsArray;
exports.ArraySpeciesConstructor = ArraySpeciesConstructor;
exports.GrowArrayElements = GrowArrayElements;
exports.IsArray = IsArray;
exports.NewArray = NewArray;
exports.NormalizeElements = NormalizeElements;
exports.TransitionElementsKind = TransitionElementsKind;
exports.TransitionElementsKindWithKind = TransitionElementsKindWithKind;
exports.AtomicsLoad64 = AtomicsLoad64;
exports.AtomicsStore64 = AtomicsStore64;
exports.AtomicsAdd = AtomicsAdd;
exports.AtomicsAnd = AtomicsAnd;
exports.AtomicsCompareExchange = AtomicsCompareExchange;
exports.AtomicsExchange = AtomicsExchange;
exports.AtomicsNumWaitersForTesting = AtomicsNumWaitersForTesting;
exports.AtomicsOr = AtomicsOr;
exports.AtomicsSub = AtomicsSub;
exports.AtomicsXor = AtomicsXor;
exports.SetAllowAtomicsWait = SetAllowAtomicsWait;
exports.BigIntBinaryOp = BigIntBinaryOp;
exports.BigIntCompareToBigInt = BigIntCompareToBigInt;
exports.BigIntCompareToNumber = BigIntCompareToNumber;
exports.BigIntCompareToString = BigIntCompareToString;
exports.BigIntEqualToBigInt = BigIntEqualToBigInt;
exports.BigIntEqualToNumber = BigIntEqualToNumber;
exports.BigIntEqualToString = BigIntEqualToString;
exports.BigIntToBoolean = BigIntToBoolean;
exports.BigIntToNumber = BigIntToNumber;
exports.BigIntUnaryOp = BigIntUnaryOp;
exports.ToBigInt = ToBigInt;
exports.DefineClass = DefineClass;
exports.HomeObjectSymbol = HomeObjectSymbol;
exports.LoadFromSuper = LoadFromSuper;
exports.LoadKeyedFromSuper = LoadKeyedFromSuper;
exports.StoreKeyedToSuper = StoreKeyedToSuper;
exports.StoreToSuper = StoreToSuper;
exports.ThrowConstructorNonCallableError = ThrowConstructorNonCallableError;
exports.ThrowNotSuperConstructor = ThrowNotSuperConstructor;
exports.ThrowStaticPrototypeError = ThrowStaticPrototypeError;
exports.ThrowSuperAlreadyCalledError = ThrowSuperAlreadyCalledError;
exports.ThrowSuperNotCalled = ThrowSuperNotCalled;
exports.ThrowUnsupportedSuperError = ThrowUnsupportedSuperError;
exports.MapGrow = MapGrow;
exports.MapShrink = MapShrink;
exports.SetGrow = SetGrow;
exports.SetShrink = SetShrink;
exports.TheHole = TheHole;
exports.WeakCollectionDelete = WeakCollectionDelete;
exports.WeakCollectionSet = WeakCollectionSet;
exports.CompileForOnStackReplacement = CompileForOnStackReplacement;
exports.CompileLazy = CompileLazy;
exports.CompileOptimized_Concurrent = CompileOptimized_Concurrent;
exports.CompileOptimized_NotConcurrent = CompileOptimized_NotConcurrent;
exports.EvictOptimizedCodeSlot = EvictOptimizedCodeSlot;
exports.FunctionFirstExecution = FunctionFirstExecution;
exports.InstantiateAsmJs = InstantiateAsmJs;
exports.NotifyDeoptimized = NotifyDeoptimized;
exports.ResolvePossiblyDirectEval = ResolvePossiblyDirectEval;
exports.DateCurrentTime = DateCurrentTime;
exports.ClearStepping = ClearStepping;
exports.CollectGarbage = CollectGarbage;
exports.DebugAsyncFunctionEntered = DebugAsyncFunctionEntered;
exports.DebugAsyncFunctionSuspended = DebugAsyncFunctionSuspended;
exports.DebugAsyncFunctionResumed = DebugAsyncFunctionResumed;
exports.DebugAsyncFunctionFinished = DebugAsyncFunctionFinished;
exports.DebugBreakAtEntry = DebugBreakAtEntry;
exports.DebugCollectCoverage = DebugCollectCoverage;
exports.DebugGetLoadedScriptIds = DebugGetLoadedScriptIds;
exports.DebugOnFunctionCall = DebugOnFunctionCall;
exports.DebugPopPromise = DebugPopPromise;
exports.DebugPrepareStepInSuspendedGenerator = DebugPrepareStepInSuspendedGenerator;
exports.DebugPushPromise = DebugPushPromise;
exports.DebugToggleBlockCoverage = DebugToggleBlockCoverage;
exports.DebugTogglePreciseCoverage = DebugTogglePreciseCoverage;
exports.FunctionGetInferredName = FunctionGetInferredName;
exports.GetBreakLocations = GetBreakLocations;
exports.GetGeneratorScopeCount = GetGeneratorScopeCount;
exports.GetGeneratorScopeDetails = GetGeneratorScopeDetails;
exports.GetHeapUsage = GetHeapUsage;
exports.HandleDebuggerStatement = HandleDebuggerStatement;
exports.IsBreakOnException = IsBreakOnException;
exports.LiveEditPatchScript = LiveEditPatchScript;
exports.ProfileCreateSnapshotDataBlob = ProfileCreateSnapshotDataBlob;
exports.ScheduleBreak = ScheduleBreak;
exports.ScriptLocationFromLine2 = ScriptLocationFromLine2;
exports.SetGeneratorScopeVariableValue = SetGeneratorScopeVariableValue;
exports.IncBlockCounter = IncBlockCounter;
exports.ForInEnumerate = ForInEnumerate;
exports.ForInHasProperty = ForInHasProperty;
exports.InterpreterTraceBytecodeEntry = InterpreterTraceBytecodeEntry;
exports.InterpreterTraceBytecodeExit = InterpreterTraceBytecodeExit;
exports.InterpreterTraceUpdateFeedback = InterpreterTraceUpdateFeedback;
exports.Call = Call;
exports.FunctionGetScriptSource = FunctionGetScriptSource;
exports.FunctionGetScriptId = FunctionGetScriptId;
exports.FunctionGetScriptSourcePosition = FunctionGetScriptSourcePosition;
exports.FunctionGetSourceCode = FunctionGetSourceCode;
exports.FunctionIsAPIFunction = FunctionIsAPIFunction;
exports.IsFunction = IsFunction;
exports.AsyncFunctionAwaitCaught = AsyncFunctionAwaitCaught;
exports.AsyncFunctionAwaitUncaught = AsyncFunctionAwaitUncaught;
exports.AsyncFunctionEnter = AsyncFunctionEnter;
exports.AsyncFunctionReject = AsyncFunctionReject;
exports.AsyncFunctionResolve = AsyncFunctionResolve;
exports.AsyncGeneratorAwaitCaught = AsyncGeneratorAwaitCaught;
exports.AsyncGeneratorAwaitUncaught = AsyncGeneratorAwaitUncaught;
exports.AsyncGeneratorHasCatchHandlerForPC = AsyncGeneratorHasCatchHandlerForPC;
exports.AsyncGeneratorReject = AsyncGeneratorReject;
exports.AsyncGeneratorResolve = AsyncGeneratorResolve;
exports.AsyncGeneratorYield = AsyncGeneratorYield;
exports.CreateJSGeneratorObject = CreateJSGeneratorObject;
exports.GeneratorClose = GeneratorClose;
exports.GeneratorGetFunction = GeneratorGetFunction;
exports.GeneratorGetResumeMode = GeneratorGetResumeMode;
exports.FormatList = FormatList;
exports.FormatListToParts = FormatListToParts;
exports.StringToLowerCaseIntl = StringToLowerCaseIntl;
exports.StringToUpperCaseIntl = StringToUpperCaseIntl;
exports.AccessCheck = AccessCheck;
exports.AllocateByteArray = AllocateByteArray;
exports.AllocateInYoungGeneration = AllocateInYoungGeneration;
exports.AllocateInOldGeneration = AllocateInOldGeneration;
exports.AllocateSeqOneByteString = AllocateSeqOneByteString;
exports.AllocateSeqTwoByteString = AllocateSeqTwoByteString;
exports.AllowDynamicFunction = AllowDynamicFunction;
exports.CreateAsyncFromSyncIterator = CreateAsyncFromSyncIterator;
exports.CreateListFromArrayLike = CreateListFromArrayLike;
exports.DoubleToStringWithRadix = DoubleToStringWithRadix;
exports.FatalProcessOutOfMemoryInAllocateRaw = FatalProcessOutOfMemoryInAllocateRaw;
exports.FatalProcessOutOfMemoryInvalidArrayLength = FatalProcessOutOfMemoryInvalidArrayLength;
exports.GetAndResetRuntimeCallStats = GetAndResetRuntimeCallStats;
exports.GetTemplateObject = GetTemplateObject;
exports.IncrementUseCounter = IncrementUseCounter;
exports.BytecodeBudgetInterrupt = BytecodeBudgetInterrupt;
exports.NewReferenceError = NewReferenceError;
exports.NewSyntaxError = NewSyntaxError;
exports.NewTypeError = NewTypeError;
exports.OrdinaryHasInstance = OrdinaryHasInstance;
exports.PromoteScheduledException = PromoteScheduledException;
exports.ReportMessage = ReportMessage;
exports.ReThrow = ReThrow;
exports.RunMicrotaskCallback = RunMicrotaskCallback;
exports.PerformMicrotaskCheckpoint = PerformMicrotaskCheckpoint;
exports.StackGuard = StackGuard;
exports.StackGuardWithGap = StackGuardWithGap;
exports.Throw = Throw;
exports.ThrowApplyNonFunction = ThrowApplyNonFunction;
exports.ThrowCalledNonCallable = ThrowCalledNonCallable;
exports.ThrowConstructedNonConstructable = ThrowConstructedNonConstructable;
exports.ThrowConstructorReturnedNonObject = ThrowConstructorReturnedNonObject;
exports.ThrowInvalidStringLength = ThrowInvalidStringLength;
exports.ThrowInvalidTypedArrayAlignment = ThrowInvalidTypedArrayAlignment;
exports.ThrowIteratorError = ThrowIteratorError;
exports.ThrowSpreadArgIsNullOrUndefined = ThrowSpreadArgIsNullOrUndefined;
exports.ThrowIteratorResultNotAnObject = ThrowIteratorResultNotAnObject;
exports.ThrowNotConstructor = ThrowNotConstructor;
exports.ThrowPatternAssignmentNonCoercible = ThrowPatternAssignmentNonCoercible;
exports.ThrowRangeError = ThrowRangeError;
exports.ThrowReferenceError = ThrowReferenceError;
exports.ThrowAccessedUninitializedVariable = ThrowAccessedUninitializedVariable;
exports.ThrowStackOverflow = ThrowStackOverflow;
exports.ThrowSymbolAsyncIteratorInvalid = ThrowSymbolAsyncIteratorInvalid;
exports.ThrowSymbolIteratorInvalid = ThrowSymbolIteratorInvalid;
exports.ThrowThrowMethodMissing = ThrowThrowMethodMissing;
exports.ThrowTypeError = ThrowTypeError;
exports.ThrowTypeErrorIfStrict = ThrowTypeErrorIfStrict;
exports.Typeof = Typeof;
exports.UnwindAndFindExceptionHandler = UnwindAndFindExceptionHandler;
exports.CreateArrayLiteral = CreateArrayLiteral;
exports.CreateArrayLiteralWithoutAllocationSite = CreateArrayLiteralWithoutAllocationSite;
exports.CreateObjectLiteral = CreateObjectLiteral;
exports.CreateObjectLiteralWithoutAllocationSite = CreateObjectLiteralWithoutAllocationSite;
exports.CreateRegExpLiteral = CreateRegExpLiteral;
exports.DynamicImportCall = DynamicImportCall;
exports.GetImportMetaObject = GetImportMetaObject;
exports.GetModuleNamespace = GetModuleNamespace;
exports.ArrayBufferMaxByteLength = ArrayBufferMaxByteLength;
exports.GetHoleNaNLower = GetHoleNaNLower;
exports.GetHoleNaNUpper = GetHoleNaNUpper;
exports.IsSmi = IsSmi;
exports.IsValidSmi = IsValidSmi;
exports.MaxSmi = MaxSmi;
exports.NumberToString = NumberToString;
exports.StringParseFloat = StringParseFloat;
exports.StringParseInt = StringParseInt;
exports.StringToNumber = StringToNumber;
exports.TypedArrayMaxLength = TypedArrayMaxLength;
exports.AddDictionaryProperty = AddDictionaryProperty;
exports.AddPrivateField = AddPrivateField;
exports.AddPrivateBrand = AddPrivateBrand;
exports.AllocateHeapNumber = AllocateHeapNumber;
exports.ClassOf = ClassOf;
exports.CollectTypeProfile = CollectTypeProfile;
exports.CompleteInobjectSlackTrackingForMap = CompleteInobjectSlackTrackingForMap;
exports.CopyDataProperties = CopyDataProperties;
exports.CopyDataPropertiesWithExcludedProperties = CopyDataPropertiesWithExcludedProperties;
exports.CreateDataProperty = CreateDataProperty;
exports.CreateIterResultObject = CreateIterResultObject;
exports.CreatePrivateAccessors = CreatePrivateAccessors;
exports.DefineAccessorPropertyUnchecked = DefineAccessorPropertyUnchecked;
exports.DefineDataPropertyInLiteral = DefineDataPropertyInLiteral;
exports.DefineGetterPropertyUnchecked = DefineGetterPropertyUnchecked;
exports.DefineSetterPropertyUnchecked = DefineSetterPropertyUnchecked;
exports.DeleteProperty = DeleteProperty;
exports.GetDerivedMap = GetDerivedMap;
exports.GetFunctionName = GetFunctionName;
exports.GetOwnPropertyDescriptor = GetOwnPropertyDescriptor;
exports.GetOwnPropertyKeys = GetOwnPropertyKeys;
exports.GetProperty = GetProperty;
exports.HasFastPackedElements = HasFastPackedElements;
exports.HasInPrototypeChain = HasInPrototypeChain;
exports.HasProperty = HasProperty;
exports.InternalSetPrototype = InternalSetPrototype;
exports.IsJSReceiver = IsJSReceiver;
exports.JSReceiverPreventExtensionsDontThrow = JSReceiverPreventExtensionsDontThrow;
exports.JSReceiverPreventExtensionsThrow = JSReceiverPreventExtensionsThrow;
exports.JSReceiverGetPrototypeOf = JSReceiverGetPrototypeOf;
exports.JSReceiverSetPrototypeOfDontThrow = JSReceiverSetPrototypeOfDontThrow;
exports.JSReceiverSetPrototypeOfThrow = JSReceiverSetPrototypeOfThrow;
exports.LoadPrivateGetter = LoadPrivateGetter;
exports.LoadPrivateSetter = LoadPrivateSetter;
exports.NewObject = NewObject;
exports.ObjectCreate = ObjectCreate;
exports.ObjectEntries = ObjectEntries;
exports.ObjectEntriesSkipFastPath = ObjectEntriesSkipFastPath;
exports.ObjectGetOwnPropertyNames = ObjectGetOwnPropertyNames;
exports.ObjectGetOwnPropertyNamesTryFast = ObjectGetOwnPropertyNamesTryFast;
exports.ObjectHasOwnProperty = ObjectHasOwnProperty;
exports.ObjectIsExtensible = ObjectIsExtensible;
exports.ObjectKeys = ObjectKeys;
exports.ObjectValues = ObjectValues;
exports.ObjectValuesSkipFastPath = ObjectValuesSkipFastPath;
exports.OptimizeObjectForAddingMultipleProperties = OptimizeObjectForAddingMultipleProperties;
exports.SetDataProperties = SetDataProperties;
exports.SetKeyedProperty = SetKeyedProperty;
exports.SetNamedProperty = SetNamedProperty;
exports.StoreDataPropertyInLiteral = StoreDataPropertyInLiteral;
exports.ShrinkPropertyDictionary = ShrinkPropertyDictionary;
exports.ToFastProperties = ToFastProperties;
exports.ToLength = ToLength;
exports.ToName = ToName;
exports.ToNumber = ToNumber;
exports.ToNumeric = ToNumeric;
exports.ToObject = ToObject;
exports.ToStringRT = ToStringRT;
exports.TryMigrateInstance = TryMigrateInstance;
exports.Add = Add;
exports.Equal = Equal;
exports.GreaterThan = GreaterThan;
exports.GreaterThanOrEqual = GreaterThanOrEqual;
exports.LessThan = LessThan;
exports.LessThanOrEqual = LessThanOrEqual;
exports.NotEqual = NotEqual;
exports.StrictEqual = StrictEqual;
exports.StrictNotEqual = StrictNotEqual;
exports.EnqueueMicrotask = EnqueueMicrotask;
exports.PromiseHookAfter = PromiseHookAfter;
exports.PromiseHookBefore = PromiseHookBefore;
exports.PromiseHookInit = PromiseHookInit;
exports.AwaitPromisesInit = AwaitPromisesInit;
exports.AwaitPromisesInitOld = AwaitPromisesInitOld;
exports.PromiseMarkAsHandled = PromiseMarkAsHandled;
exports.PromiseRejectEventFromStack = PromiseRejectEventFromStack;
exports.PromiseRevokeReject = PromiseRevokeReject;
exports.PromiseStatus = PromiseStatus;
exports.RejectPromise = RejectPromise;
exports.ResolvePromise = ResolvePromise;
exports.PromiseRejectAfterResolved = PromiseRejectAfterResolved;
exports.PromiseResolveAfterResolved = PromiseResolveAfterResolved;
exports.CheckProxyGetSetTrapResult = CheckProxyGetSetTrapResult;
exports.CheckProxyHasTrapResult = CheckProxyHasTrapResult;
exports.CheckProxyDeleteTrapResult = CheckProxyDeleteTrapResult;
exports.GetPropertyWithReceiver = GetPropertyWithReceiver;
exports.SetPropertyWithReceiver = SetPropertyWithReceiver;
exports.IsRegExp = IsRegExp;
exports.RegExpExec = RegExpExec;
exports.RegExpExecMultiple = RegExpExecMultiple;
exports.RegExpInitializeAndCompile = RegExpInitializeAndCompile;
exports.RegExpReplaceRT = RegExpReplaceRT;
exports.RegExpSplit = RegExpSplit;
exports.StringReplaceNonGlobalRegExpWithFunction = StringReplaceNonGlobalRegExpWithFunction;
exports.StringSplit = StringSplit;
exports.DeclareEvalFunction = DeclareEvalFunction;
exports.DeclareEvalVar = DeclareEvalVar;
exports.DeclareGlobals = DeclareGlobals;
exports.DeclareModuleExports = DeclareModuleExports;
exports.DeleteLookupSlot = DeleteLookupSlot;
exports.LoadLookupSlot = LoadLookupSlot;
exports.LoadLookupSlotInsideTypeof = LoadLookupSlotInsideTypeof;
exports.NewArgumentsElements = NewArgumentsElements;
exports.NewClosure = NewClosure;
exports.NewClosure_Tenured = NewClosure_Tenured;
exports.NewFunctionContext = NewFunctionContext;
exports.NewRestParameter = NewRestParameter;
exports.NewSloppyArguments = NewSloppyArguments;
exports.NewSloppyArguments_Generic = NewSloppyArguments_Generic;
exports.NewStrictArguments = NewStrictArguments;
exports.PushBlockContext = PushBlockContext;
exports.PushCatchContext = PushCatchContext;
exports.PushWithContext = PushWithContext;
exports.StoreGlobalNoHoleCheckForReplLet = StoreGlobalNoHoleCheckForReplLet;
exports.StoreLookupSlot_Sloppy = StoreLookupSlot_Sloppy;
exports.StoreLookupSlot_SloppyHoisting = StoreLookupSlot_SloppyHoisting;
exports.StoreLookupSlot_Strict = StoreLookupSlot_Strict;
exports.ThrowConstAssignError = ThrowConstAssignError;
exports.FlattenString = FlattenString;
exports.GetSubstitution = GetSubstitution;
exports.InternalizeString = InternalizeString;
exports.StringAdd = StringAdd;
exports.StringBuilderConcat = StringBuilderConcat;
exports.StringCharCodeAt = StringCharCodeAt;
exports.StringEqual = StringEqual;
exports.StringEscapeQuotes = StringEscapeQuotes;
exports.StringGreaterThan = StringGreaterThan;
exports.StringGreaterThanOrEqual = StringGreaterThanOrEqual;
exports.StringIncludes = StringIncludes;
exports.StringIndexOf = StringIndexOf;
exports.StringIndexOfUnchecked = StringIndexOfUnchecked;
exports.StringLastIndexOf = StringLastIndexOf;
exports.StringLessThan = StringLessThan;
exports.StringLessThanOrEqual = StringLessThanOrEqual;
exports.StringMaxLength = StringMaxLength;
exports.StringReplaceOneCharWithString = StringReplaceOneCharWithString;
exports.StringCompareSequence = StringCompareSequence;
exports.StringSubstring = StringSubstring;
exports.StringToArray = StringToArray;
exports.StringTrim = StringTrim;
exports.CreatePrivateNameSymbol = CreatePrivateNameSymbol;
exports.CreatePrivateBrandSymbol = CreatePrivateBrandSymbol;
exports.CreatePrivateSymbol = CreatePrivateSymbol;
exports.SymbolDescriptiveString = SymbolDescriptiveString;
exports.SymbolIsPrivate = SymbolIsPrivate;
exports.Abort = Abort;
exports.AbortJS = AbortJS;
exports.AbortCSAAssert = AbortCSAAssert;
exports.ArraySpeciesProtector = ArraySpeciesProtector;
exports.ClearFunctionFeedback = ClearFunctionFeedback;
exports.ClearMegamorphicStubCache = ClearMegamorphicStubCache;
exports.CloneWasmModule = CloneWasmModule;
exports.CompleteInobjectSlackTracking = CompleteInobjectSlackTracking;
exports.ConstructConsString = ConstructConsString;
exports.ConstructDouble = ConstructDouble;
exports.ConstructSlicedString = ConstructSlicedString;
exports.DebugPrint = DebugPrint;
exports.DebugTrace = DebugTrace;
exports.DebugTrackRetainingPath = DebugTrackRetainingPath;
exports.DeoptimizeFunction = DeoptimizeFunction;
exports.DeserializeWasmModule = DeserializeWasmModule;
exports.DisallowCodegenFromStrings = DisallowCodegenFromStrings;
exports.DisallowWasmCodegen = DisallowWasmCodegen;
exports.DisassembleFunction = DisassembleFunction;
exports.EnableCodeLoggingForTesting = EnableCodeLoggingForTesting;
exports.EnsureFeedbackVectorForFunction = EnsureFeedbackVectorForFunction;
exports.FreezeWasmLazyCompilation = FreezeWasmLazyCompilation;
exports.GetCallable = GetCallable;
exports.GetInitializerFunction = GetInitializerFunction;
exports.GetOptimizationStatus = GetOptimizationStatus;
exports.GetUndetectable = GetUndetectable;
exports.GetWasmExceptionId = GetWasmExceptionId;
exports.GetWasmExceptionValues = GetWasmExceptionValues;
exports.GetWasmRecoveredTrapCount = GetWasmRecoveredTrapCount;
exports.GlobalPrint = GlobalPrint;
exports.HasDictionaryElements = HasDictionaryElements;
exports.HasDoubleElements = HasDoubleElements;
exports.HasElementsInALargeObjectSpace = HasElementsInALargeObjectSpace;
exports.HasFastElements = HasFastElements;
exports.HasFastProperties = HasFastProperties;
exports.HasFixedBigInt64Elements = HasFixedBigInt64Elements;
exports.HasFixedBigUint64Elements = HasFixedBigUint64Elements;
exports.HasFixedFloat32Elements = HasFixedFloat32Elements;
exports.HasFixedFloat64Elements = HasFixedFloat64Elements;
exports.HasFixedInt16Elements = HasFixedInt16Elements;
exports.HasFixedInt32Elements = HasFixedInt32Elements;
exports.HasFixedInt8Elements = HasFixedInt8Elements;
exports.HasFixedUint16Elements = HasFixedUint16Elements;
exports.HasFixedUint32Elements = HasFixedUint32Elements;
exports.HasFixedUint8ClampedElements = HasFixedUint8ClampedElements;
exports.HasFixedUint8Elements = HasFixedUint8Elements;
exports.HasHoleyElements = HasHoleyElements;
exports.HasObjectElements = HasObjectElements;
exports.HasPackedElements = HasPackedElements;
exports.HasSloppyArgumentsElements = HasSloppyArgumentsElements;
exports.HasSmiElements = HasSmiElements;
exports.HasSmiOrObjectElements = HasSmiOrObjectElements;
exports.HaveSameMap = HaveSameMap;
exports.HeapObjectVerify = HeapObjectVerify;
exports.ICsAreEnabled = ICsAreEnabled;
exports.InYoungGeneration = InYoungGeneration;
exports.IsAsmWasmCode = IsAsmWasmCode;
exports.IsBeingInterpreted = IsBeingInterpreted;
exports.IsConcurrentRecompilationSupported = IsConcurrentRecompilationSupported;
exports.IsLiftoffFunction = IsLiftoffFunction;
exports.IsThreadInWasm = IsThreadInWasm;
exports.IsWasmCode = IsWasmCode;
exports.IsWasmTrapHandlerEnabled = IsWasmTrapHandlerEnabled;
exports.RegexpHasBytecode = RegexpHasBytecode;
exports.RegexpHasNativeCode = RegexpHasNativeCode;
exports.MapIteratorProtector = MapIteratorProtector;
exports.NeverOptimizeFunction = NeverOptimizeFunction;
exports.NotifyContextDisposed = NotifyContextDisposed;
exports.OptimizeFunctionOnNextCall = OptimizeFunctionOnNextCall;
exports.OptimizeOsr = OptimizeOsr;
exports.NewRegExpWithBacktrackLimit = NewRegExpWithBacktrackLimit;
exports.PrepareFunctionForOptimization = PrepareFunctionForOptimization;
exports.PrintWithNameForAssert = PrintWithNameForAssert;
exports.RedirectToWasmInterpreter = RedirectToWasmInterpreter;
exports.RunningInSimulator = RunningInSimulator;
exports.RuntimeEvaluateREPL = RuntimeEvaluateREPL;
exports.SerializeWasmModule = SerializeWasmModule;
exports.SetAllocationTimeout = SetAllocationTimeout;
exports.SetForceSlowPath = SetForceSlowPath;
exports.SetIteratorProtector = SetIteratorProtector;
exports.SetWasmCompileControls = SetWasmCompileControls;
exports.SetWasmInstantiateControls = SetWasmInstantiateControls;
exports.SetWasmThreadsEnabled = SetWasmThreadsEnabled;
exports.SimulateNewspaceFull = SimulateNewspaceFull;
exports.StringIteratorProtector = StringIteratorProtector;
exports.SystemBreak = SystemBreak;
exports.TraceEnter = TraceEnter;
exports.TraceExit = TraceExit;
exports.TurbofanStaticAssert = TurbofanStaticAssert;
exports.UnblockConcurrentRecompilation = UnblockConcurrentRecompilation;
exports.WasmGetNumberOfInstances = WasmGetNumberOfInstances;
exports.WasmNumInterpretedCalls = WasmNumInterpretedCalls;
exports.WasmNumCodeSpaces = WasmNumCodeSpaces;
exports.WasmTierDownModule = WasmTierDownModule;
exports.WasmTierUpFunction = WasmTierUpFunction;
exports.WasmTierUpModule = WasmTierUpModule;
exports.WasmTraceMemory = WasmTraceMemory;
exports.DeoptimizeNow = DeoptimizeNow;
exports.ArrayBufferDetach = ArrayBufferDetach;
exports.TypedArrayCopyElements = TypedArrayCopyElements;
exports.TypedArrayGetBuffer = TypedArrayGetBuffer;
exports.TypedArraySet = TypedArraySet;
exports.TypedArraySortFast = TypedArraySortFast;
exports.ThrowWasmError = ThrowWasmError;
exports.ThrowWasmStackOverflow = ThrowWasmStackOverflow;
exports.WasmI32AtomicWait = WasmI32AtomicWait;
exports.WasmI64AtomicWait = WasmI64AtomicWait;
exports.WasmAtomicNotify = WasmAtomicNotify;
exports.WasmExceptionGetValues = WasmExceptionGetValues;
exports.WasmExceptionGetTag = WasmExceptionGetTag;
exports.WasmMemoryGrow = WasmMemoryGrow;
exports.WasmRunInterpreter = WasmRunInterpreter;
exports.WasmStackGuard = WasmStackGuard;
exports.WasmThrowCreate = WasmThrowCreate;
exports.WasmThrowTypeError = WasmThrowTypeError;
exports.WasmRefFunc = WasmRefFunc;
exports.WasmFunctionTableGet = WasmFunctionTableGet;
exports.WasmFunctionTableSet = WasmFunctionTableSet;
exports.WasmTableInit = WasmTableInit;
exports.WasmTableCopy = WasmTableCopy;
exports.WasmTableGrow = WasmTableGrow;
exports.WasmTableFill = WasmTableFill;
exports.WasmIsValidFuncRefValue = WasmIsValidFuncRefValue;
exports.WasmCompileLazy = WasmCompileLazy;
exports.WasmNewMultiReturnFixedArray = WasmNewMultiReturnFixedArray;
exports.WasmNewMultiReturnJSArray = WasmNewMultiReturnJSArray;
exports.WasmDebugBreak = WasmDebugBreak;
exports.DebugBreakOnBytecode = DebugBreakOnBytecode;
exports.LoadLookupSlotForCall = LoadLookupSlotForCall;
exports.ElementsTransitionAndStoreIC_Miss = ElementsTransitionAndStoreIC_Miss;
exports.KeyedLoadIC_Miss = KeyedLoadIC_Miss;
exports.KeyedStoreIC_Miss = KeyedStoreIC_Miss;
exports.StoreInArrayLiteralIC_Miss = StoreInArrayLiteralIC_Miss;
exports.KeyedStoreIC_Slow = KeyedStoreIC_Slow;
exports.LoadElementWithInterceptor = LoadElementWithInterceptor;
exports.LoadGlobalIC_Miss = LoadGlobalIC_Miss;
exports.LoadGlobalIC_Slow = LoadGlobalIC_Slow;
exports.LoadIC_Miss = LoadIC_Miss;
exports.LoadNoFeedbackIC_Miss = LoadNoFeedbackIC_Miss;
exports.LoadPropertyWithInterceptor = LoadPropertyWithInterceptor;
exports.StoreCallbackProperty = StoreCallbackProperty;
exports.StoreGlobalIC_Miss = StoreGlobalIC_Miss;
exports.StoreGlobalICNoFeedback_Miss = StoreGlobalICNoFeedback_Miss;
exports.StoreGlobalIC_Slow = StoreGlobalIC_Slow;
exports.StoreIC_Miss = StoreIC_Miss;
exports.StoreInArrayLiteralIC_Slow = StoreInArrayLiteralIC_Slow;
exports.StorePropertyWithInterceptor = StorePropertyWithInterceptor;
exports.CloneObjectIC_Miss = CloneObjectIC_Miss;
exports.KeyedHasIC_Miss = KeyedHasIC_Miss;
exports.HasElementWithInterceptor = HasElementWithInterceptor;

function ArrayIncludes_Slow(a, b, c) {
  return %ArrayIncludes_Slow(a, b, c);
}

function ArrayIndexOf(a, b, c) {
  return %ArrayIndexOf(a, b, c);
}

function ArrayIsArray(a) {
  return %ArrayIsArray(a);
}

function ArraySpeciesConstructor(a) {
  return %ArraySpeciesConstructor(a);
}

function GrowArrayElements(a, b) {
  return %GrowArrayElements(a, b);
}

function IsArray(a) {
  return %IsArray(a);
}

function NewArray(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  return %NewArray(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
}

function NormalizeElements(a) {
  return %NormalizeElements(a);
}

function TransitionElementsKind(a, b) {
  return %TransitionElementsKind(a, b);
}

function TransitionElementsKindWithKind(a, b) {
  return %TransitionElementsKindWithKind(a, b);
}

function AtomicsLoad64(a, b) {
  return %AtomicsLoad64(a, b);
}

function AtomicsStore64(a, b, c) {
  return %AtomicsStore64(a, b, c);
}

function AtomicsAdd(a, b, c) {
  return %AtomicsAdd(a, b, c);
}

function AtomicsAnd(a, b, c) {
  return %AtomicsAnd(a, b, c);
}

function AtomicsCompareExchange(a, b, c, d) {
  return %AtomicsCompareExchange(a, b, c, d);
}

function AtomicsExchange(a, b, c) {
  return %AtomicsExchange(a, b, c);
}

function AtomicsNumWaitersForTesting(a, b) {
  return %AtomicsNumWaitersForTesting(a, b);
}

function AtomicsOr(a, b, c) {
  return %AtomicsOr(a, b, c);
}

function AtomicsSub(a, b, c) {
  return %AtomicsSub(a, b, c);
}

function AtomicsXor(a, b, c) {
  return %AtomicsXor(a, b, c);
}

function SetAllowAtomicsWait(a) {
  return %SetAllowAtomicsWait(a);
}

function BigIntBinaryOp(a, b, c) {
  return %BigIntBinaryOp(a, b, c);
}

function BigIntCompareToBigInt(a, b, c) {
  return %BigIntCompareToBigInt(a, b, c);
}

function BigIntCompareToNumber(a, b, c) {
  return %BigIntCompareToNumber(a, b, c);
}

function BigIntCompareToString(a, b, c) {
  return %BigIntCompareToString(a, b, c);
}

function BigIntEqualToBigInt(a, b) {
  return %BigIntEqualToBigInt(a, b);
}

function BigIntEqualToNumber(a, b) {
  return %BigIntEqualToNumber(a, b);
}

function BigIntEqualToString(a, b) {
  return %BigIntEqualToString(a, b);
}

function BigIntToBoolean(a) {
  return %BigIntToBoolean(a);
}

function BigIntToNumber(a) {
  return %BigIntToNumber(a);
}

function BigIntUnaryOp(a, b) {
  return %BigIntUnaryOp(a, b);
}

function ToBigInt(a) {
  return %ToBigInt(a);
}

function DefineClass(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  return %DefineClass(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
}

function HomeObjectSymbol() {
  return %HomeObjectSymbol();
}

function LoadFromSuper(a, b, c) {
  return %LoadFromSuper(a, b, c);
}

function LoadKeyedFromSuper(a, b, c) {
  return %LoadKeyedFromSuper(a, b, c);
}

function StoreKeyedToSuper(a, b, c, d) {
  return %StoreKeyedToSuper(a, b, c, d);
}

function StoreToSuper(a, b, c, d) {
  return %StoreToSuper(a, b, c, d);
}

function ThrowConstructorNonCallableError(a) {
  return %ThrowConstructorNonCallableError(a);
}

function ThrowNotSuperConstructor(a, b) {
  return %ThrowNotSuperConstructor(a, b);
}

function ThrowStaticPrototypeError() {
  return %ThrowStaticPrototypeError();
}

function ThrowSuperAlreadyCalledError() {
  return %ThrowSuperAlreadyCalledError();
}

function ThrowSuperNotCalled() {
  return %ThrowSuperNotCalled();
}

function ThrowUnsupportedSuperError() {
  return %ThrowUnsupportedSuperError();
}

function MapGrow(a) {
  return %MapGrow(a);
}

function MapShrink(a) {
  return %MapShrink(a);
}

function SetGrow(a) {
  return %SetGrow(a);
}

function SetShrink(a) {
  return %SetShrink(a);
}

function TheHole() {
  return %TheHole();
}

function WeakCollectionDelete(a, b, c) {
  return %WeakCollectionDelete(a, b, c);
}

function WeakCollectionSet(a, b, c, d) {
  return %WeakCollectionSet(a, b, c, d);
}

function CompileForOnStackReplacement() {
  return %CompileForOnStackReplacement();
}

function CompileLazy(a) {
  return %CompileLazy(a);
}

function CompileOptimized_Concurrent(a) {
  return %CompileOptimized_Concurrent(a);
}

function CompileOptimized_NotConcurrent(a) {
  return %CompileOptimized_NotConcurrent(a);
}

function EvictOptimizedCodeSlot(a) {
  return %EvictOptimizedCodeSlot(a);
}

function FunctionFirstExecution(a) {
  return %FunctionFirstExecution(a);
}

function InstantiateAsmJs(a, b, c, d) {
  return %InstantiateAsmJs(a, b, c, d);
}

function NotifyDeoptimized() {
  return %NotifyDeoptimized();
}

function ResolvePossiblyDirectEval(a, b, c, d, e, f) {
  return %ResolvePossiblyDirectEval(a, b, c, d, e, f);
}

function DateCurrentTime() {
  return %DateCurrentTime();
}

function ClearStepping() {
  return %ClearStepping();
}

function CollectGarbage(a) {
  return %CollectGarbage(a);
}

function DebugAsyncFunctionEntered(a) {
  return %DebugAsyncFunctionEntered(a);
}

function DebugAsyncFunctionSuspended(a) {
  return %DebugAsyncFunctionSuspended(a);
}

function DebugAsyncFunctionResumed(a) {
  return %DebugAsyncFunctionResumed(a);
}

function DebugAsyncFunctionFinished(a, b) {
  return %DebugAsyncFunctionFinished(a, b);
}

function DebugBreakAtEntry(a) {
  return %DebugBreakAtEntry(a);
}

function DebugCollectCoverage() {
  return %DebugCollectCoverage();
}

function DebugGetLoadedScriptIds() {
  return %DebugGetLoadedScriptIds();
}

function DebugOnFunctionCall(a, b) {
  return %DebugOnFunctionCall(a, b);
}

function DebugPopPromise() {
  return %DebugPopPromise();
}

function DebugPrepareStepInSuspendedGenerator() {
  return %DebugPrepareStepInSuspendedGenerator();
}

function DebugPushPromise(a) {
  return %DebugPushPromise(a);
}

function DebugToggleBlockCoverage(a) {
  return %DebugToggleBlockCoverage(a);
}

function DebugTogglePreciseCoverage(a) {
  return %DebugTogglePreciseCoverage(a);
}

function FunctionGetInferredName(a) {
  return %FunctionGetInferredName(a);
}

function GetBreakLocations(a) {
  return %GetBreakLocations(a);
}

function GetGeneratorScopeCount(a) {
  return %GetGeneratorScopeCount(a);
}

function GetGeneratorScopeDetails(a, b) {
  return %GetGeneratorScopeDetails(a, b);
}

function GetHeapUsage() {
  return %GetHeapUsage();
}

function HandleDebuggerStatement() {
  return %HandleDebuggerStatement();
}

function IsBreakOnException(a) {
  return %IsBreakOnException(a);
}

function LiveEditPatchScript(a, b) {
  return %LiveEditPatchScript(a, b);
}

function ProfileCreateSnapshotDataBlob() {
  return %ProfileCreateSnapshotDataBlob();
}

function ScheduleBreak() {
  return %ScheduleBreak();
}

function ScriptLocationFromLine2(a, b, c, d) {
  return %ScriptLocationFromLine2(a, b, c, d);
}

function SetGeneratorScopeVariableValue(a, b, c, d) {
  return %SetGeneratorScopeVariableValue(a, b, c, d);
}

function IncBlockCounter(a, b) {
  return %IncBlockCounter(a, b);
}

function ForInEnumerate(a) {
  return %ForInEnumerate(a);
}

function ForInHasProperty(a, b) {
  return %ForInHasProperty(a, b);
}

function InterpreterTraceBytecodeEntry(a, b, c) {
  return %InterpreterTraceBytecodeEntry(a, b, c);
}

function InterpreterTraceBytecodeExit(a, b, c) {
  return %InterpreterTraceBytecodeExit(a, b, c);
}

function InterpreterTraceUpdateFeedback(a, b, c) {
  return %InterpreterTraceUpdateFeedback(a, b, c);
}

function Call(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  return %Call(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
}

function FunctionGetScriptSource(a) {
  return %FunctionGetScriptSource(a);
}

function FunctionGetScriptId(a) {
  return %FunctionGetScriptId(a);
}

function FunctionGetScriptSourcePosition(a) {
  return %FunctionGetScriptSourcePosition(a);
}

function FunctionGetSourceCode(a) {
  return %FunctionGetSourceCode(a);
}

function FunctionIsAPIFunction(a) {
  return %FunctionIsAPIFunction(a);
}

function IsFunction(a) {
  return %IsFunction(a);
}

function AsyncFunctionAwaitCaught(a, b) {
  return %AsyncFunctionAwaitCaught(a, b);
}

function AsyncFunctionAwaitUncaught(a, b) {
  return %AsyncFunctionAwaitUncaught(a, b);
}

function AsyncFunctionEnter(a, b) {
  return %AsyncFunctionEnter(a, b);
}

function AsyncFunctionReject(a, b, c) {
  return %AsyncFunctionReject(a, b, c);
}

function AsyncFunctionResolve(a, b, c) {
  return %AsyncFunctionResolve(a, b, c);
}

function AsyncGeneratorAwaitCaught(a, b) {
  return %AsyncGeneratorAwaitCaught(a, b);
}

function AsyncGeneratorAwaitUncaught(a, b) {
  return %AsyncGeneratorAwaitUncaught(a, b);
}

function AsyncGeneratorHasCatchHandlerForPC(a) {
  return %AsyncGeneratorHasCatchHandlerForPC(a);
}

function AsyncGeneratorReject(a, b) {
  return %AsyncGeneratorReject(a, b);
}

function AsyncGeneratorResolve(a, b, c) {
  return %AsyncGeneratorResolve(a, b, c);
}

function AsyncGeneratorYield(a, b, c) {
  return %AsyncGeneratorYield(a, b, c);
}

function CreateJSGeneratorObject(a, b) {
  return %CreateJSGeneratorObject(a, b);
}

function GeneratorClose(a) {
  return %GeneratorClose(a);
}

function GeneratorGetFunction(a) {
  return %GeneratorGetFunction(a);
}

function GeneratorGetResumeMode(a) {
  return %GeneratorGetResumeMode(a);
}

function FormatList(a, b) {
  return %FormatList(a, b);
}

function FormatListToParts(a, b) {
  return %FormatListToParts(a, b);
}

function StringToLowerCaseIntl(a) {
  return %StringToLowerCaseIntl(a);
}

function StringToUpperCaseIntl(a) {
  return %StringToUpperCaseIntl(a);
}

function AccessCheck(a) {
  return %AccessCheck(a);
}

function AllocateByteArray(a) {
  return %AllocateByteArray(a);
}

function AllocateInYoungGeneration(a, b) {
  return %AllocateInYoungGeneration(a, b);
}

function AllocateInOldGeneration(a, b) {
  return %AllocateInOldGeneration(a, b);
}

function AllocateSeqOneByteString(a) {
  return %AllocateSeqOneByteString(a);
}

function AllocateSeqTwoByteString(a) {
  return %AllocateSeqTwoByteString(a);
}

function AllowDynamicFunction(a) {
  return %AllowDynamicFunction(a);
}

function CreateAsyncFromSyncIterator(a) {
  return %CreateAsyncFromSyncIterator(a);
}

function CreateListFromArrayLike(a) {
  return %CreateListFromArrayLike(a);
}

function DoubleToStringWithRadix(a, b) {
  return %DoubleToStringWithRadix(a, b);
}

function FatalProcessOutOfMemoryInAllocateRaw() {
  return %FatalProcessOutOfMemoryInAllocateRaw();
}

function FatalProcessOutOfMemoryInvalidArrayLength() {
  return %FatalProcessOutOfMemoryInvalidArrayLength();
}

function GetAndResetRuntimeCallStats(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  return %GetAndResetRuntimeCallStats(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
}

function GetTemplateObject(a, b, c) {
  return %GetTemplateObject(a, b, c);
}

function IncrementUseCounter(a) {
  return %IncrementUseCounter(a);
}

function BytecodeBudgetInterrupt(a) {
  return %BytecodeBudgetInterrupt(a);
}

function NewReferenceError(a, b) {
  return %NewReferenceError(a, b);
}

function NewSyntaxError(a, b) {
  return %NewSyntaxError(a, b);
}

function NewTypeError(a, b) {
  return %NewTypeError(a, b);
}

function OrdinaryHasInstance(a, b) {
  return %OrdinaryHasInstance(a, b);
}

function PromoteScheduledException() {
  return %PromoteScheduledException();
}

function ReportMessage(a) {
  return %ReportMessage(a);
}

function ReThrow(a) {
  return %ReThrow(a);
}

function RunMicrotaskCallback(a, b) {
  return %RunMicrotaskCallback(a, b);
}

function PerformMicrotaskCheckpoint() {
  return %PerformMicrotaskCheckpoint();
}

function StackGuard() {
  return %StackGuard();
}

function StackGuardWithGap(a) {
  return %StackGuardWithGap(a);
}

function Throw(a) {
  return %Throw(a);
}

function ThrowApplyNonFunction(a) {
  return %ThrowApplyNonFunction(a);
}

function ThrowCalledNonCallable(a) {
  return %ThrowCalledNonCallable(a);
}

function ThrowConstructedNonConstructable(a) {
  return %ThrowConstructedNonConstructable(a);
}

function ThrowConstructorReturnedNonObject() {
  return %ThrowConstructorReturnedNonObject();
}

function ThrowInvalidStringLength() {
  return %ThrowInvalidStringLength();
}

function ThrowInvalidTypedArrayAlignment(a, b) {
  return %ThrowInvalidTypedArrayAlignment(a, b);
}

function ThrowIteratorError(a) {
  return %ThrowIteratorError(a);
}

function ThrowSpreadArgIsNullOrUndefined(a) {
  return %ThrowSpreadArgIsNullOrUndefined(a);
}

function ThrowIteratorResultNotAnObject(a) {
  return %ThrowIteratorResultNotAnObject(a);
}

function ThrowNotConstructor(a) {
  return %ThrowNotConstructor(a);
}

function ThrowPatternAssignmentNonCoercible(a) {
  return %ThrowPatternAssignmentNonCoercible(a);
}

function ThrowRangeError(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  return %ThrowRangeError(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
}

function ThrowReferenceError(a) {
  return %ThrowReferenceError(a);
}

function ThrowAccessedUninitializedVariable(a) {
  return %ThrowAccessedUninitializedVariable(a);
}

function ThrowStackOverflow() {
  return %ThrowStackOverflow();
}

function ThrowSymbolAsyncIteratorInvalid() {
  return %ThrowSymbolAsyncIteratorInvalid();
}

function ThrowSymbolIteratorInvalid() {
  return %ThrowSymbolIteratorInvalid();
}

function ThrowThrowMethodMissing() {
  return %ThrowThrowMethodMissing();
}

function ThrowTypeError(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  return %ThrowTypeError(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
}

function ThrowTypeErrorIfStrict(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  return %ThrowTypeErrorIfStrict(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
}

function Typeof(a) {
  return %Typeof(a);
}

function UnwindAndFindExceptionHandler() {
  return %UnwindAndFindExceptionHandler();
}

function CreateArrayLiteral(a, b, c, d) {
  return %CreateArrayLiteral(a, b, c, d);
}

function CreateArrayLiteralWithoutAllocationSite(a, b) {
  return %CreateArrayLiteralWithoutAllocationSite(a, b);
}

function CreateObjectLiteral(a, b, c, d) {
  return %CreateObjectLiteral(a, b, c, d);
}

function CreateObjectLiteralWithoutAllocationSite(a, b) {
  return %CreateObjectLiteralWithoutAllocationSite(a, b);
}

function CreateRegExpLiteral(a, b, c, d) {
  return %CreateRegExpLiteral(a, b, c, d);
}

function DynamicImportCall(a, b) {
  return %DynamicImportCall(a, b);
}

function GetImportMetaObject() {
  return %GetImportMetaObject();
}

function GetModuleNamespace(a) {
  return %GetModuleNamespace(a);
}

function ArrayBufferMaxByteLength() {
  return %ArrayBufferMaxByteLength();
}

function GetHoleNaNLower() {
  return %GetHoleNaNLower();
}

function GetHoleNaNUpper() {
  return %GetHoleNaNUpper();
}

function IsSmi(a) {
  return %IsSmi(a);
}

function IsValidSmi(a) {
  return %IsValidSmi(a);
}

function MaxSmi() {
  return %MaxSmi();
}

function NumberToString(a) {
  return %NumberToString(a);
}

function StringParseFloat(a) {
  return %StringParseFloat(a);
}

function StringParseInt(a, b) {
  return %StringParseInt(a, b);
}

function StringToNumber(a) {
  return %StringToNumber(a);
}

function TypedArrayMaxLength() {
  return %TypedArrayMaxLength();
}

function AddDictionaryProperty(a, b, c) {
  return %AddDictionaryProperty(a, b, c);
}

function AddPrivateField(a, b, c) {
  return %AddPrivateField(a, b, c);
}

function AddPrivateBrand(a, b, c) {
  return %AddPrivateBrand(a, b, c);
}

function AllocateHeapNumber() {
  return %AllocateHeapNumber();
}

function ClassOf(a) {
  return %ClassOf(a);
}

function CollectTypeProfile(a, b, c) {
  return %CollectTypeProfile(a, b, c);
}

function CompleteInobjectSlackTrackingForMap(a) {
  return %CompleteInobjectSlackTrackingForMap(a);
}

function CopyDataProperties(a, b) {
  return %CopyDataProperties(a, b);
}

function CopyDataPropertiesWithExcludedProperties(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  return %CopyDataPropertiesWithExcludedProperties(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
}

function CreateDataProperty(a, b, c) {
  return %CreateDataProperty(a, b, c);
}

function CreateIterResultObject(a, b) {
  return %CreateIterResultObject(a, b);
}

function CreatePrivateAccessors(a, b) {
  return %CreatePrivateAccessors(a, b);
}

function DefineAccessorPropertyUnchecked(a, b, c, d, e) {
  return %DefineAccessorPropertyUnchecked(a, b, c, d, e);
}

function DefineDataPropertyInLiteral(a, b, c, d, e, f) {
  return %DefineDataPropertyInLiteral(a, b, c, d, e, f);
}

function DefineGetterPropertyUnchecked(a, b, c, d) {
  return %DefineGetterPropertyUnchecked(a, b, c, d);
}

function DefineSetterPropertyUnchecked(a, b, c, d) {
  return %DefineSetterPropertyUnchecked(a, b, c, d);
}

function DeleteProperty(a, b, c) {
  return %DeleteProperty(a, b, c);
}

function GetDerivedMap(a, b) {
  return %GetDerivedMap(a, b);
}

function GetFunctionName(a) {
  return %GetFunctionName(a);
}

function GetOwnPropertyDescriptor(a, b) {
  return %GetOwnPropertyDescriptor(a, b);
}

function GetOwnPropertyKeys(a, b) {
  return %GetOwnPropertyKeys(a, b);
}

function GetProperty(a, b) {
  return %GetProperty(a, b);
}

function HasFastPackedElements(a) {
  return %HasFastPackedElements(a);
}

function HasInPrototypeChain(a, b) {
  return %HasInPrototypeChain(a, b);
}

function HasProperty(a, b) {
  return %HasProperty(a, b);
}

function InternalSetPrototype(a, b) {
  return %InternalSetPrototype(a, b);
}

function IsJSReceiver(a) {
  return %IsJSReceiver(a);
}

function JSReceiverPreventExtensionsDontThrow(a) {
  return %JSReceiverPreventExtensionsDontThrow(a);
}

function JSReceiverPreventExtensionsThrow(a) {
  return %JSReceiverPreventExtensionsThrow(a);
}

function JSReceiverGetPrototypeOf(a) {
  return %JSReceiverGetPrototypeOf(a);
}

function JSReceiverSetPrototypeOfDontThrow(a, b) {
  return %JSReceiverSetPrototypeOfDontThrow(a, b);
}

function JSReceiverSetPrototypeOfThrow(a, b) {
  return %JSReceiverSetPrototypeOfThrow(a, b);
}

function LoadPrivateGetter(a) {
  return %LoadPrivateGetter(a);
}

function LoadPrivateSetter(a) {
  return %LoadPrivateSetter(a);
}

function NewObject(a, b) {
  return %NewObject(a, b);
}

function ObjectCreate(a, b) {
  return %ObjectCreate(a, b);
}

function ObjectEntries(a) {
  return %ObjectEntries(a);
}

function ObjectEntriesSkipFastPath(a) {
  return %ObjectEntriesSkipFastPath(a);
}

function ObjectGetOwnPropertyNames(a) {
  return %ObjectGetOwnPropertyNames(a);
}

function ObjectGetOwnPropertyNamesTryFast(a) {
  return %ObjectGetOwnPropertyNamesTryFast(a);
}

function ObjectHasOwnProperty(a, b) {
  return %ObjectHasOwnProperty(a, b);
}

function ObjectIsExtensible(a) {
  return %ObjectIsExtensible(a);
}

function ObjectKeys(a) {
  return %ObjectKeys(a);
}

function ObjectValues(a) {
  return %ObjectValues(a);
}

function ObjectValuesSkipFastPath(a) {
  return %ObjectValuesSkipFastPath(a);
}

function OptimizeObjectForAddingMultipleProperties(a, b) {
  return %OptimizeObjectForAddingMultipleProperties(a, b);
}

function SetDataProperties(a, b) {
  return %SetDataProperties(a, b);
}

function SetKeyedProperty(a, b, c) {
  return %SetKeyedProperty(a, b, c);
}

function SetNamedProperty(a, b, c) {
  return %SetNamedProperty(a, b, c);
}

function StoreDataPropertyInLiteral(a, b, c) {
  return %StoreDataPropertyInLiteral(a, b, c);
}

function ShrinkPropertyDictionary(a) {
  return %ShrinkPropertyDictionary(a);
}

function ToFastProperties(a) {
  return %ToFastProperties(a);
}

function ToLength(a) {
  return %ToLength(a);
}

function ToName(a) {
  return %ToName(a);
}

function ToNumber(a) {
  return %ToNumber(a);
}

function ToNumeric(a) {
  return %ToNumeric(a);
}

function ToObject(a) {
  return %ToObject(a);
}

function ToStringRT(a) {
  return %ToStringRT(a);
}

function TryMigrateInstance(a) {
  return %TryMigrateInstance(a);
}

function Add(a, b) {
  return %Add(a, b);
}

function Equal(a, b) {
  return %Equal(a, b);
}

function GreaterThan(a, b) {
  return %GreaterThan(a, b);
}

function GreaterThanOrEqual(a, b) {
  return %GreaterThanOrEqual(a, b);
}

function LessThan(a, b) {
  return %LessThan(a, b);
}

function LessThanOrEqual(a, b) {
  return %LessThanOrEqual(a, b);
}

function NotEqual(a, b) {
  return %NotEqual(a, b);
}

function StrictEqual(a, b) {
  return %StrictEqual(a, b);
}

function StrictNotEqual(a, b) {
  return %StrictNotEqual(a, b);
}

function EnqueueMicrotask(a) {
  return %EnqueueMicrotask(a);
}

function PromiseHookAfter(a) {
  return %PromiseHookAfter(a);
}

function PromiseHookBefore(a) {
  return %PromiseHookBefore(a);
}

function PromiseHookInit(a, b) {
  return %PromiseHookInit(a, b);
}

function AwaitPromisesInit(a, b, c, d, e) {
  return %AwaitPromisesInit(a, b, c, d, e);
}

function AwaitPromisesInitOld(a, b, c, d, e) {
  return %AwaitPromisesInitOld(a, b, c, d, e);
}

function PromiseMarkAsHandled(a) {
  return %PromiseMarkAsHandled(a);
}

function PromiseRejectEventFromStack(a, b) {
  return %PromiseRejectEventFromStack(a, b);
}

function PromiseRevokeReject(a) {
  return %PromiseRevokeReject(a);
}

function PromiseStatus(a) {
  return %PromiseStatus(a);
}

function RejectPromise(a, b, c) {
  return %RejectPromise(a, b, c);
}

function ResolvePromise(a, b) {
  return %ResolvePromise(a, b);
}

function PromiseRejectAfterResolved(a, b) {
  return %PromiseRejectAfterResolved(a, b);
}

function PromiseResolveAfterResolved(a, b) {
  return %PromiseResolveAfterResolved(a, b);
}

function CheckProxyGetSetTrapResult(a, b) {
  return %CheckProxyGetSetTrapResult(a, b);
}

function CheckProxyHasTrapResult(a, b) {
  return %CheckProxyHasTrapResult(a, b);
}

function CheckProxyDeleteTrapResult(a, b) {
  return %CheckProxyDeleteTrapResult(a, b);
}

function GetPropertyWithReceiver(a, b, c) {
  return %GetPropertyWithReceiver(a, b, c);
}

function SetPropertyWithReceiver(a, b, c, d) {
  return %SetPropertyWithReceiver(a, b, c, d);
}

function IsRegExp(a) {
  return %IsRegExp(a);
}

function RegExpExec(a, b, c, d) {
  return %RegExpExec(a, b, c, d);
}

function RegExpExecMultiple(a, b, c, d) {
  return %RegExpExecMultiple(a, b, c, d);
}

function RegExpInitializeAndCompile(a, b, c) {
  return %RegExpInitializeAndCompile(a, b, c);
}

function RegExpReplaceRT(a, b, c) {
  return %RegExpReplaceRT(a, b, c);
}

function RegExpSplit(a, b, c) {
  return %RegExpSplit(a, b, c);
}

function StringReplaceNonGlobalRegExpWithFunction(a, b, c) {
  return %StringReplaceNonGlobalRegExpWithFunction(a, b, c);
}

function StringSplit(a, b, c) {
  return %StringSplit(a, b, c);
}

function DeclareEvalFunction(a, b) {
  return %DeclareEvalFunction(a, b);
}

function DeclareEvalVar(a) {
  return %DeclareEvalVar(a);
}

function DeclareGlobals(a, b) {
  return %DeclareGlobals(a, b);
}

function DeclareModuleExports(a, b) {
  return %DeclareModuleExports(a, b);
}

function DeleteLookupSlot(a) {
  return %DeleteLookupSlot(a);
}

function LoadLookupSlot(a) {
  return %LoadLookupSlot(a);
}

function LoadLookupSlotInsideTypeof(a) {
  return %LoadLookupSlotInsideTypeof(a);
}

function NewArgumentsElements(a, b, c) {
  return %NewArgumentsElements(a, b, c);
}

function NewClosure(a, b) {
  return %NewClosure(a, b);
}

function NewClosure_Tenured(a, b) {
  return %NewClosure_Tenured(a, b);
}

function NewFunctionContext(a) {
  return %NewFunctionContext(a);
}

function NewRestParameter(a) {
  return %NewRestParameter(a);
}

function NewSloppyArguments(a, b, c) {
  return %NewSloppyArguments(a, b, c);
}

function NewSloppyArguments_Generic(a) {
  return %NewSloppyArguments_Generic(a);
}

function NewStrictArguments(a) {
  return %NewStrictArguments(a);
}

function PushBlockContext(a) {
  return %PushBlockContext(a);
}

function PushCatchContext(a, b) {
  return %PushCatchContext(a, b);
}

function PushWithContext(a, b) {
  return %PushWithContext(a, b);
}

function StoreGlobalNoHoleCheckForReplLet(a, b) {
  return %StoreGlobalNoHoleCheckForReplLet(a, b);
}

function StoreLookupSlot_Sloppy(a, b) {
  return %StoreLookupSlot_Sloppy(a, b);
}

function StoreLookupSlot_SloppyHoisting(a, b) {
  return %StoreLookupSlot_SloppyHoisting(a, b);
}

function StoreLookupSlot_Strict(a, b) {
  return %StoreLookupSlot_Strict(a, b);
}

function ThrowConstAssignError() {
  return %ThrowConstAssignError();
}

function FlattenString(a) {
  return %FlattenString(a);
}

function GetSubstitution(a, b, c, d, e) {
  return %GetSubstitution(a, b, c, d, e);
}

function InternalizeString(a) {
  return %InternalizeString(a);
}

function StringAdd(a, b) {
  return %StringAdd(a, b);
}

function StringBuilderConcat(a, b, c) {
  return %StringBuilderConcat(a, b, c);
}

function StringCharCodeAt(a, b) {
  return %StringCharCodeAt(a, b);
}

function StringEqual(a, b) {
  return %StringEqual(a, b);
}

function StringEscapeQuotes(a) {
  return %StringEscapeQuotes(a);
}

function StringGreaterThan(a, b) {
  return %StringGreaterThan(a, b);
}

function StringGreaterThanOrEqual(a, b) {
  return %StringGreaterThanOrEqual(a, b);
}

function StringIncludes(a, b, c) {
  return %StringIncludes(a, b, c);
}

function StringIndexOf(a, b, c) {
  return %StringIndexOf(a, b, c);
}

function StringIndexOfUnchecked(a, b, c) {
  return %StringIndexOfUnchecked(a, b, c);
}

function StringLastIndexOf(a, b) {
  return %StringLastIndexOf(a, b);
}

function StringLessThan(a, b) {
  return %StringLessThan(a, b);
}

function StringLessThanOrEqual(a, b) {
  return %StringLessThanOrEqual(a, b);
}

function StringMaxLength() {
  return %StringMaxLength();
}

function StringReplaceOneCharWithString(a, b, c) {
  return %StringReplaceOneCharWithString(a, b, c);
}

function StringCompareSequence(a, b, c) {
  return %StringCompareSequence(a, b, c);
}

function StringSubstring(a, b, c) {
  return %StringSubstring(a, b, c);
}

function StringToArray(a, b) {
  return %StringToArray(a, b);
}

function StringTrim(a, b) {
  return %StringTrim(a, b);
}

function CreatePrivateNameSymbol(a) {
  return %CreatePrivateNameSymbol(a);
}

function CreatePrivateBrandSymbol(a) {
  return %CreatePrivateBrandSymbol(a);
}

function CreatePrivateSymbol(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  return %CreatePrivateSymbol(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
}

function SymbolDescriptiveString(a) {
  return %SymbolDescriptiveString(a);
}

function SymbolIsPrivate(a) {
  return %SymbolIsPrivate(a);
}

function Abort(a) {
  return %Abort(a);
}

function AbortJS(a) {
  return %AbortJS(a);
}

function AbortCSAAssert(a) {
  return %AbortCSAAssert(a);
}

function ArraySpeciesProtector() {
  return %ArraySpeciesProtector();
}

function ClearFunctionFeedback(a) {
  return %ClearFunctionFeedback(a);
}

function ClearMegamorphicStubCache() {
  return %ClearMegamorphicStubCache();
}

function CloneWasmModule(a) {
  return %CloneWasmModule(a);
}

function CompleteInobjectSlackTracking(a) {
  return %CompleteInobjectSlackTracking(a);
}

function ConstructConsString(a, b) {
  return %ConstructConsString(a, b);
}

function ConstructDouble(a, b) {
  return %ConstructDouble(a, b);
}

function ConstructSlicedString(a, b) {
  return %ConstructSlicedString(a, b);
}

function DebugPrint(a) {
  return %DebugPrint(a);
}

function DebugTrace() {
  return %DebugTrace();
}

function DebugTrackRetainingPath(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  return %DebugTrackRetainingPath(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
}

function DeoptimizeFunction(a) {
  return %DeoptimizeFunction(a);
}

function DeserializeWasmModule(a, b) {
  return %DeserializeWasmModule(a, b);
}

function DisallowCodegenFromStrings(a) {
  return %DisallowCodegenFromStrings(a);
}

function DisallowWasmCodegen(a) {
  return %DisallowWasmCodegen(a);
}

function DisassembleFunction(a) {
  return %DisassembleFunction(a);
}

function EnableCodeLoggingForTesting() {
  return %EnableCodeLoggingForTesting();
}

function EnsureFeedbackVectorForFunction(a) {
  return %EnsureFeedbackVectorForFunction(a);
}

function FreezeWasmLazyCompilation(a) {
  return %FreezeWasmLazyCompilation(a);
}

function GetCallable() {
  return %GetCallable();
}

function GetInitializerFunction(a) {
  return %GetInitializerFunction(a);
}

function GetOptimizationStatus(fn) {
  return %GetOptimizationStatus(fn);
}

function GetUndetectable() {
  return %GetUndetectable();
}

function GetWasmExceptionId(a, b) {
  return %GetWasmExceptionId(a, b);
}

function GetWasmExceptionValues(a) {
  return %GetWasmExceptionValues(a);
}

function GetWasmRecoveredTrapCount() {
  return %GetWasmRecoveredTrapCount();
}

function GlobalPrint(a) {
  return %GlobalPrint(a);
}

function HasDictionaryElements(a) {
  return %HasDictionaryElements(a);
}

function HasDoubleElements(a) {
  return %HasDoubleElements(a);
}

function HasElementsInALargeObjectSpace(a) {
  return %HasElementsInALargeObjectSpace(a);
}

function HasFastElements(a) {
  return %HasFastElements(a);
}

function HasFastProperties(a) {
  return %HasFastProperties(a);
}

function HasFixedBigInt64Elements(a) {
  return %HasFixedBigInt64Elements(a);
}

function HasFixedBigUint64Elements(a) {
  return %HasFixedBigUint64Elements(a);
}

function HasFixedFloat32Elements(a) {
  return %HasFixedFloat32Elements(a);
}

function HasFixedFloat64Elements(a) {
  return %HasFixedFloat64Elements(a);
}

function HasFixedInt16Elements(a) {
  return %HasFixedInt16Elements(a);
}

function HasFixedInt32Elements(a) {
  return %HasFixedInt32Elements(a);
}

function HasFixedInt8Elements(a) {
  return %HasFixedInt8Elements(a);
}

function HasFixedUint16Elements(a) {
  return %HasFixedUint16Elements(a);
}

function HasFixedUint32Elements(a) {
  return %HasFixedUint32Elements(a);
}

function HasFixedUint8ClampedElements(a) {
  return %HasFixedUint8ClampedElements(a);
}

function HasFixedUint8Elements(a) {
  return %HasFixedUint8Elements(a);
}

function HasHoleyElements(a) {
  return %HasHoleyElements(a);
}

function HasObjectElements(a) {
  return %HasObjectElements(a);
}

function HasPackedElements(a) {
  return %HasPackedElements(a);
}

function HasSloppyArgumentsElements(a) {
  return %HasSloppyArgumentsElements(a);
}

function HasSmiElements(a) {
  return %HasSmiElements(a);
}

function HasSmiOrObjectElements(a) {
  return %HasSmiOrObjectElements(a);
}

function HaveSameMap(a, b) {
  return %HaveSameMap(a, b);
}

function HeapObjectVerify(a) {
  return %HeapObjectVerify(a);
}

function ICsAreEnabled() {
  return %ICsAreEnabled();
}

function InYoungGeneration(a) {
  return %InYoungGeneration(a);
}

function IsAsmWasmCode(a) {
  return %IsAsmWasmCode(a);
}

function IsBeingInterpreted() {
  return %IsBeingInterpreted();
}

function IsConcurrentRecompilationSupported() {
  return %IsConcurrentRecompilationSupported();
}

function IsLiftoffFunction(a) {
  return %IsLiftoffFunction(a);
}

function IsThreadInWasm() {
  return %IsThreadInWasm();
}

function IsWasmCode(a) {
  return %IsWasmCode(a);
}

function IsWasmTrapHandlerEnabled() {
  return %IsWasmTrapHandlerEnabled();
}

function RegexpHasBytecode(a, b) {
  return %RegexpHasBytecode(a, b);
}

function RegexpHasNativeCode(a, b) {
  return %RegexpHasNativeCode(a, b);
}

function MapIteratorProtector() {
  return %MapIteratorProtector();
}

function NeverOptimizeFunction(a) {
  return %NeverOptimizeFunction(a);
}

function NotifyContextDisposed() {
  return %NotifyContextDisposed();
}

function OptimizeFunctionOnNextCall(fn) {
  return %OptimizeFunctionOnNextCall(fn);
}

function OptimizeOsr(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  return %OptimizeOsr(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
}

function NewRegExpWithBacktrackLimit(a, b, c) {
  return %NewRegExpWithBacktrackLimit(a, b, c);
}

function PrepareFunctionForOptimization(fn) {
  return %PrepareFunctionForOptimization(fn);
}

function PrintWithNameForAssert(a, b) {
  return %PrintWithNameForAssert(a, b);
}

function RedirectToWasmInterpreter(a, b) {
  return %RedirectToWasmInterpreter(a, b);
}

function RunningInSimulator() {
  return %RunningInSimulator();
}

function RuntimeEvaluateREPL(a) {
  return %RuntimeEvaluateREPL(a);
}

function SerializeWasmModule(a) {
  return %SerializeWasmModule(a);
}

function SetAllocationTimeout(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  return %SetAllocationTimeout(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
}

function SetForceSlowPath(a) {
  return %SetForceSlowPath(a);
}

function SetIteratorProtector() {
  return %SetIteratorProtector();
}

function SetWasmCompileControls(a, b) {
  return %SetWasmCompileControls(a, b);
}

function SetWasmInstantiateControls() {
  return %SetWasmInstantiateControls();
}

function SetWasmThreadsEnabled(a) {
  return %SetWasmThreadsEnabled(a);
}

function SimulateNewspaceFull() {
  return %SimulateNewspaceFull();
}

function StringIteratorProtector() {
  return %StringIteratorProtector();
}

function SystemBreak() {
  return %SystemBreak();
}

function TraceEnter() {
  return %TraceEnter();
}

function TraceExit(a) {
  return %TraceExit(a);
}

function TurbofanStaticAssert(a) {
  return %TurbofanStaticAssert(a);
}

function UnblockConcurrentRecompilation() {
  return %UnblockConcurrentRecompilation();
}

function WasmGetNumberOfInstances(a) {
  return %WasmGetNumberOfInstances(a);
}

function WasmNumInterpretedCalls(a) {
  return %WasmNumInterpretedCalls(a);
}

function WasmNumCodeSpaces(a) {
  return %WasmNumCodeSpaces(a);
}

function WasmTierDownModule(a) {
  return %WasmTierDownModule(a);
}

function WasmTierUpFunction(a, b) {
  return %WasmTierUpFunction(a, b);
}

function WasmTierUpModule(a) {
  return %WasmTierUpModule(a);
}

function WasmTraceMemory(a) {
  return %WasmTraceMemory(a);
}

function DeoptimizeNow() {
  return %DeoptimizeNow();
}

function ArrayBufferDetach(a) {
  return %ArrayBufferDetach(a);
}

function TypedArrayCopyElements(a, b, c) {
  return %TypedArrayCopyElements(a, b, c);
}

function TypedArrayGetBuffer(a) {
  return %TypedArrayGetBuffer(a);
}

function TypedArraySet(a, b) {
  return %TypedArraySet(a, b);
}

function TypedArraySortFast(a) {
  return %TypedArraySortFast(a);
}

function ThrowWasmError(a) {
  return %ThrowWasmError(a);
}

function ThrowWasmStackOverflow() {
  return %ThrowWasmStackOverflow();
}

function WasmI32AtomicWait(a, b, c, d) {
  return %WasmI32AtomicWait(a, b, c, d);
}

function WasmI64AtomicWait(a, b, c, d, e) {
  return %WasmI64AtomicWait(a, b, c, d, e);
}

function WasmAtomicNotify(a, b, c) {
  return %WasmAtomicNotify(a, b, c);
}

function WasmExceptionGetValues(a) {
  return %WasmExceptionGetValues(a);
}

function WasmExceptionGetTag(a) {
  return %WasmExceptionGetTag(a);
}

function WasmMemoryGrow(a, b) {
  return %WasmMemoryGrow(a, b);
}

function WasmRunInterpreter(a, b) {
  return %WasmRunInterpreter(a, b);
}

function WasmStackGuard() {
  return %WasmStackGuard();
}

function WasmThrowCreate(a, b) {
  return %WasmThrowCreate(a, b);
}

function WasmThrowTypeError() {
  return %WasmThrowTypeError();
}

function WasmRefFunc(a) {
  return %WasmRefFunc(a);
}

function WasmFunctionTableGet(a, b, c) {
  return %WasmFunctionTableGet(a, b, c);
}

function WasmFunctionTableSet(a, b, c, d) {
  return %WasmFunctionTableSet(a, b, c, d);
}

function WasmTableInit(a, b, c, d, e) {
  return %WasmTableInit(a, b, c, d, e);
}

function WasmTableCopy(a, b, c, d, e) {
  return %WasmTableCopy(a, b, c, d, e);
}

function WasmTableGrow(a, b, c) {
  return %WasmTableGrow(a, b, c);
}

function WasmTableFill(a, b, c, d) {
  return %WasmTableFill(a, b, c, d);
}

function WasmIsValidFuncRefValue(a) {
  return %WasmIsValidFuncRefValue(a);
}

function WasmCompileLazy(a, b) {
  return %WasmCompileLazy(a, b);
}

function WasmNewMultiReturnFixedArray(a) {
  return %WasmNewMultiReturnFixedArray(a);
}

function WasmNewMultiReturnJSArray(a) {
  return %WasmNewMultiReturnJSArray(a);
}

function WasmDebugBreak() {
  return %WasmDebugBreak();
}

function DebugBreakOnBytecode(a) {
  return %DebugBreakOnBytecode(a);
}

function LoadLookupSlotForCall(a) {
  return %LoadLookupSlotForCall(a);
}

function ElementsTransitionAndStoreIC_Miss(a, b, c, d, e, f) {
  return %ElementsTransitionAndStoreIC_Miss(a, b, c, d, e, f);
}

function KeyedLoadIC_Miss(a, b, c, d) {
  return %KeyedLoadIC_Miss(a, b, c, d);
}

function KeyedStoreIC_Miss(a, b, c, d, e) {
  return %KeyedStoreIC_Miss(a, b, c, d, e);
}

function StoreInArrayLiteralIC_Miss(a, b, c, d, e) {
  return %StoreInArrayLiteralIC_Miss(a, b, c, d, e);
}

function KeyedStoreIC_Slow(a, b, c) {
  return %KeyedStoreIC_Slow(a, b, c);
}

function LoadElementWithInterceptor(a, b) {
  return %LoadElementWithInterceptor(a, b);
}

function LoadGlobalIC_Miss(a, b, c, d) {
  return %LoadGlobalIC_Miss(a, b, c, d);
}

function LoadGlobalIC_Slow(a, b, c) {
  return %LoadGlobalIC_Slow(a, b, c);
}

function LoadIC_Miss(a, b, c, d) {
  return %LoadIC_Miss(a, b, c, d);
}

function LoadNoFeedbackIC_Miss(a, b, c, d) {
  return %LoadNoFeedbackIC_Miss(a, b, c, d);
}

function LoadPropertyWithInterceptor(a, b, c, d, e) {
  return %LoadPropertyWithInterceptor(a, b, c, d, e);
}

function StoreCallbackProperty(a, b, c, d, e) {
  return %StoreCallbackProperty(a, b, c, d, e);
}

function StoreGlobalIC_Miss(a, b, c, d) {
  return %StoreGlobalIC_Miss(a, b, c, d);
}

function StoreGlobalICNoFeedback_Miss(a, b) {
  return %StoreGlobalICNoFeedback_Miss(a, b);
}

function StoreGlobalIC_Slow(a, b, c, d, e) {
  return %StoreGlobalIC_Slow(a, b, c, d, e);
}

function StoreIC_Miss(a, b, c, d, e) {
  return %StoreIC_Miss(a, b, c, d, e);
}

function StoreInArrayLiteralIC_Slow(a, b, c, d, e) {
  return %StoreInArrayLiteralIC_Slow(a, b, c, d, e);
}

function StorePropertyWithInterceptor(a, b, c, d, e) {
  return %StorePropertyWithInterceptor(a, b, c, d, e);
}

function CloneObjectIC_Miss(a, b, c, d) {
  return %CloneObjectIC_Miss(a, b, c, d);
}

function KeyedHasIC_Miss(a, b, c, d) {
  return %KeyedHasIC_Miss(a, b, c, d);
}

function HasElementWithInterceptor(a, b) {
  return %HasElementWithInterceptor(a, b);
}