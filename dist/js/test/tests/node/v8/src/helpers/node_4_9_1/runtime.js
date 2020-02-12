"use strict";

exports.__esModule = true;
exports.FinishArrayPrototypeSetup = FinishArrayPrototypeSetup;
exports.SpecialArrayFunctions = SpecialArrayFunctions;
exports.TransitionElementsKind = TransitionElementsKind;
exports.PushIfAbsent = PushIfAbsent;
exports.ArrayConcat = ArrayConcat;
exports.RemoveArrayHoles = RemoveArrayHoles;
exports.MoveArrayContents = MoveArrayContents;
exports.EstimateNumberOfElements = EstimateNumberOfElements;
exports.GetArrayKeys = GetArrayKeys;
exports.ArrayConstructor = ArrayConstructor;
exports.ArrayConstructorWithSubclassing = ArrayConstructorWithSubclassing;
exports.InternalArrayConstructor = InternalArrayConstructor;
exports.NormalizeElements = NormalizeElements;
exports.GrowArrayElements = GrowArrayElements;
exports.HasComplexElements = HasComplexElements;
exports.IsArray = IsArray;
exports.HasCachedArrayIndex = HasCachedArrayIndex;
exports.GetCachedArrayIndex = GetCachedArrayIndex;
exports.FixedArrayGet = FixedArrayGet;
exports.FixedArraySet = FixedArraySet;
exports.FastOneByteArrayJoin = FastOneByteArrayJoin;
exports.AtomicsCompareExchange = AtomicsCompareExchange;
exports.AtomicsLoad = AtomicsLoad;
exports.AtomicsStore = AtomicsStore;
exports.AtomicsAdd = AtomicsAdd;
exports.AtomicsSub = AtomicsSub;
exports.AtomicsAnd = AtomicsAnd;
exports.AtomicsOr = AtomicsOr;
exports.AtomicsXor = AtomicsXor;
exports.AtomicsExchange = AtomicsExchange;
exports.AtomicsIsLockFree = AtomicsIsLockFree;
exports.ThrowNonMethodError = ThrowNonMethodError;
exports.ThrowUnsupportedSuperError = ThrowUnsupportedSuperError;
exports.ThrowConstructorNonCallableError = ThrowConstructorNonCallableError;
exports.ThrowArrayNotSubclassableError = ThrowArrayNotSubclassableError;
exports.ThrowStaticPrototypeError = ThrowStaticPrototypeError;
exports.ThrowIfStaticPrototype = ThrowIfStaticPrototype;
exports.ToMethod = ToMethod;
exports.HomeObjectSymbol = HomeObjectSymbol;
exports.DefineClass = DefineClass;
exports.DefineClassMethod = DefineClassMethod;
exports.ClassGetSourceCode = ClassGetSourceCode;
exports.LoadFromSuper = LoadFromSuper;
exports.LoadKeyedFromSuper = LoadKeyedFromSuper;
exports.StoreToSuper_Strict = StoreToSuper_Strict;
exports.StoreToSuper_Sloppy = StoreToSuper_Sloppy;
exports.StoreKeyedToSuper_Strict = StoreKeyedToSuper_Strict;
exports.StoreKeyedToSuper_Sloppy = StoreKeyedToSuper_Sloppy;
exports.HandleStepInForDerivedConstructors = HandleStepInForDerivedConstructors;
exports.DefaultConstructorCallSuper = DefaultConstructorCallSuper;
exports.CallSuperWithSpread = CallSuperWithSpread;
exports.StringGetRawHashField = StringGetRawHashField;
exports.TheHole = TheHole;
exports.JSCollectionGetTable = JSCollectionGetTable;
exports.GenericHash = GenericHash;
exports.SetInitialize = SetInitialize;
exports.SetGrow = SetGrow;
exports.SetShrink = SetShrink;
exports.SetClear = SetClear;
exports.SetIteratorInitialize = SetIteratorInitialize;
exports.SetIteratorClone = SetIteratorClone;
exports.SetIteratorNext = SetIteratorNext;
exports.SetIteratorDetails = SetIteratorDetails;
exports.MapInitialize = MapInitialize;
exports.MapShrink = MapShrink;
exports.MapClear = MapClear;
exports.MapGrow = MapGrow;
exports.MapIteratorInitialize = MapIteratorInitialize;
exports.MapIteratorClone = MapIteratorClone;
exports.MapIteratorDetails = MapIteratorDetails;
exports.GetWeakMapEntries = GetWeakMapEntries;
exports.MapIteratorNext = MapIteratorNext;
exports.WeakCollectionInitialize = WeakCollectionInitialize;
exports.WeakCollectionGet = WeakCollectionGet;
exports.WeakCollectionHas = WeakCollectionHas;
exports.WeakCollectionDelete = WeakCollectionDelete;
exports.WeakCollectionSet = WeakCollectionSet;
exports.GetWeakSetValues = GetWeakSetValues;
exports.ObservationWeakMapCreate = ObservationWeakMapCreate;
exports.CompileLazy = CompileLazy;
exports.CompileOptimized = CompileOptimized;
exports.NotifyStubFailure = NotifyStubFailure;
exports.NotifyDeoptimized = NotifyDeoptimized;
exports.CompileForOnStackReplacement = CompileForOnStackReplacement;
exports.TryInstallOptimizedCode = TryInstallOptimizedCode;
exports.CompileString = CompileString;
exports.ResolvePossiblyDirectEval = ResolvePossiblyDirectEval;
exports.DateMakeDay = DateMakeDay;
exports.DateSetValue = DateSetValue;
exports.IsDate = IsDate;
exports.ThrowNotDateError = ThrowNotDateError;
exports.DateCurrentTime = DateCurrentTime;
exports.DateParseString = DateParseString;
exports.DateLocalTimezone = DateLocalTimezone;
exports.DateToUTC = DateToUTC;
exports.DateCacheVersion = DateCacheVersion;
exports.DateField = DateField;
exports.DebugBreak = DebugBreak;
exports.SetDebugEventListener = SetDebugEventListener;
exports.ScheduleBreak = ScheduleBreak;
exports.DebugGetInternalProperties = DebugGetInternalProperties;
exports.DebugGetPropertyDetails = DebugGetPropertyDetails;
exports.DebugGetProperty = DebugGetProperty;
exports.DebugPropertyTypeFromDetails = DebugPropertyTypeFromDetails;
exports.DebugPropertyAttributesFromDetails = DebugPropertyAttributesFromDetails;
exports.DebugPropertyIndexFromDetails = DebugPropertyIndexFromDetails;
exports.DebugNamedInterceptorPropertyValue = DebugNamedInterceptorPropertyValue;
exports.DebugIndexedInterceptorElementValue = DebugIndexedInterceptorElementValue;
exports.CheckExecutionState = CheckExecutionState;
exports.GetFrameCount = GetFrameCount;
exports.GetFrameDetails = GetFrameDetails;
exports.GetScopeCount = GetScopeCount;
exports.GetStepInPositions = GetStepInPositions;
exports.GetScopeDetails = GetScopeDetails;
exports.GetAllScopesDetails = GetAllScopesDetails;
exports.GetFunctionScopeCount = GetFunctionScopeCount;
exports.GetFunctionScopeDetails = GetFunctionScopeDetails;
exports.SetScopeVariableValue = SetScopeVariableValue;
exports.DebugPrintScopes = DebugPrintScopes;
exports.GetThreadCount = GetThreadCount;
exports.GetThreadDetails = GetThreadDetails;
exports.SetDisableBreak = SetDisableBreak;
exports.GetBreakLocations = GetBreakLocations;
exports.SetFunctionBreakPoint = SetFunctionBreakPoint;
exports.SetScriptBreakPoint = SetScriptBreakPoint;
exports.ClearBreakPoint = ClearBreakPoint;
exports.ChangeBreakOnException = ChangeBreakOnException;
exports.IsBreakOnException = IsBreakOnException;
exports.PrepareStep = PrepareStep;
exports.ClearStepping = ClearStepping;
exports.DebugEvaluate = DebugEvaluate;
exports.DebugEvaluateGlobal = DebugEvaluateGlobal;
exports.DebugGetLoadedScripts = DebugGetLoadedScripts;
exports.DebugReferencedBy = DebugReferencedBy;
exports.DebugConstructedBy = DebugConstructedBy;
exports.DebugGetPrototype = DebugGetPrototype;
exports.DebugSetScriptSource = DebugSetScriptSource;
exports.FunctionGetInferredName = FunctionGetInferredName;
exports.GetFunctionCodePositionFromSource = GetFunctionCodePositionFromSource;
exports.ExecuteInDebugContext = ExecuteInDebugContext;
exports.GetDebugContext = GetDebugContext;
exports.CollectGarbage = CollectGarbage;
exports.GetHeapUsage = GetHeapUsage;
exports.GetScript = GetScript;
exports.DebugCallbackSupportsStepping = DebugCallbackSupportsStepping;
exports.DebugPrepareStepInIfStepping = DebugPrepareStepInIfStepping;
exports.DebugPushPromise = DebugPushPromise;
exports.DebugPopPromise = DebugPopPromise;
exports.DebugPromiseEvent = DebugPromiseEvent;
exports.DebugAsyncTaskEvent = DebugAsyncTaskEvent;
exports.DebugIsActive = DebugIsActive;
exports.DebugBreakInOptimizedCode = DebugBreakInOptimizedCode;
exports.ForInDone = ForInDone;
exports.ForInFilter = ForInFilter;
exports.ForInNext = ForInNext;
exports.ForInStep = ForInStep;
exports.IsSloppyModeFunction = IsSloppyModeFunction;
exports.FunctionGetName = FunctionGetName;
exports.FunctionSetName = FunctionSetName;
exports.FunctionNameShouldPrintAsAnonymous = FunctionNameShouldPrintAsAnonymous;
exports.FunctionMarkNameShouldPrintAsAnonymous = FunctionMarkNameShouldPrintAsAnonymous;
exports.FunctionIsArrow = FunctionIsArrow;
exports.FunctionIsConciseMethod = FunctionIsConciseMethod;
exports.FunctionRemovePrototype = FunctionRemovePrototype;
exports.FunctionGetScript = FunctionGetScript;
exports.FunctionGetSourceCode = FunctionGetSourceCode;
exports.FunctionGetScriptSourcePosition = FunctionGetScriptSourcePosition;
exports.FunctionGetPositionForOffset = FunctionGetPositionForOffset;
exports.FunctionSetInstanceClassName = FunctionSetInstanceClassName;
exports.FunctionSetLength = FunctionSetLength;
exports.FunctionSetPrototype = FunctionSetPrototype;
exports.FunctionIsAPIFunction = FunctionIsAPIFunction;
exports.FunctionIsBuiltin = FunctionIsBuiltin;
exports.SetCode = SetCode;
exports.SetNativeFlag = SetNativeFlag;
exports.ThrowStrongModeTooFewArguments = ThrowStrongModeTooFewArguments;
exports.IsConstructor = IsConstructor;
exports.SetForceInlineFlag = SetForceInlineFlag;
exports.FunctionBindArguments = FunctionBindArguments;
exports.BoundFunctionGetBindings = BoundFunctionGetBindings;
exports.NewObjectFromBound = NewObjectFromBound;
exports.Call = Call;
exports.Apply = Apply;
exports.GetFunctionDelegate = GetFunctionDelegate;
exports.GetConstructorDelegate = GetConstructorDelegate;
exports.GetOriginalConstructor = GetOriginalConstructor;
exports.CallFunction = CallFunction;
exports.IsConstructCall = IsConstructCall;
exports.IsFunction = IsFunction;
exports.CreateJSGeneratorObject = CreateJSGeneratorObject;
exports.SuspendJSGeneratorObject = SuspendJSGeneratorObject;
exports.ResumeJSGeneratorObject = ResumeJSGeneratorObject;
exports.GeneratorClose = GeneratorClose;
exports.GeneratorGetFunction = GeneratorGetFunction;
exports.GeneratorGetContext = GeneratorGetContext;
exports.GeneratorGetReceiver = GeneratorGetReceiver;
exports.GeneratorGetContinuation = GeneratorGetContinuation;
exports.GeneratorGetSourcePosition = GeneratorGetSourcePosition;
exports.FunctionIsGenerator = FunctionIsGenerator;
exports.GeneratorNext = GeneratorNext;
exports.GeneratorThrow = GeneratorThrow;
exports.CanonicalizeLanguageTag = CanonicalizeLanguageTag;
exports.AvailableLocalesOf = AvailableLocalesOf;
exports.GetDefaultICULocale = GetDefaultICULocale;
exports.GetLanguageTagVariants = GetLanguageTagVariants;
exports.IsInitializedIntlObject = IsInitializedIntlObject;
exports.IsInitializedIntlObjectOfType = IsInitializedIntlObjectOfType;
exports.MarkAsInitializedIntlObjectOfType = MarkAsInitializedIntlObjectOfType;
exports.GetImplFromInitializedIntlObject = GetImplFromInitializedIntlObject;
exports.CreateDateTimeFormat = CreateDateTimeFormat;
exports.InternalDateFormat = InternalDateFormat;
exports.InternalDateParse = InternalDateParse;
exports.CreateNumberFormat = CreateNumberFormat;
exports.InternalNumberFormat = InternalNumberFormat;
exports.InternalNumberParse = InternalNumberParse;
exports.CreateCollator = CreateCollator;
exports.InternalCompare = InternalCompare;
exports.StringNormalize = StringNormalize;
exports.CreateBreakIterator = CreateBreakIterator;
exports.BreakIteratorAdoptText = BreakIteratorAdoptText;
exports.BreakIteratorFirst = BreakIteratorFirst;
exports.BreakIteratorNext = BreakIteratorNext;
exports.BreakIteratorCurrent = BreakIteratorCurrent;
exports.BreakIteratorBreakType = BreakIteratorBreakType;
exports.CheckIsBootstrapping = CheckIsBootstrapping;
exports.Throw = Throw;
exports.ReThrow = ReThrow;
exports.UnwindAndFindExceptionHandler = UnwindAndFindExceptionHandler;
exports.PromoteScheduledException = PromoteScheduledException;
exports.ThrowReferenceError = ThrowReferenceError;
exports.NewTypeError = NewTypeError;
exports.NewSyntaxError = NewSyntaxError;
exports.NewReferenceError = NewReferenceError;
exports.ThrowIteratorResultNotAnObject = ThrowIteratorResultNotAnObject;
exports.ThrowStrongModeImplicitConversion = ThrowStrongModeImplicitConversion;
exports.PromiseRejectEvent = PromiseRejectEvent;
exports.PromiseRevokeReject = PromiseRevokeReject;
exports.PromiseHasHandlerSymbol = PromiseHasHandlerSymbol;
exports.StackGuard = StackGuard;
exports.Interrupt = Interrupt;
exports.AllocateInNewSpace = AllocateInNewSpace;
exports.AllocateInTargetSpace = AllocateInTargetSpace;
exports.CollectStackTrace = CollectStackTrace;
exports.RenderCallSite = RenderCallSite;
exports.GetFromCacheRT = GetFromCacheRT;
exports.MessageGetStartPosition = MessageGetStartPosition;
exports.MessageGetScript = MessageGetScript;
exports.FormatMessageString = FormatMessageString;
exports.CallSiteGetFileNameRT = CallSiteGetFileNameRT;
exports.CallSiteGetFunctionNameRT = CallSiteGetFunctionNameRT;
exports.CallSiteGetScriptNameOrSourceUrlRT = CallSiteGetScriptNameOrSourceUrlRT;
exports.CallSiteGetMethodNameRT = CallSiteGetMethodNameRT;
exports.CallSiteGetLineNumberRT = CallSiteGetLineNumberRT;
exports.CallSiteGetColumnNumberRT = CallSiteGetColumnNumberRT;
exports.CallSiteIsNativeRT = CallSiteIsNativeRT;
exports.CallSiteIsToplevelRT = CallSiteIsToplevelRT;
exports.CallSiteIsEvalRT = CallSiteIsEvalRT;
exports.CallSiteIsConstructorRT = CallSiteIsConstructorRT;
exports.IS_VAR = IS_VAR;
exports.GetFromCache = GetFromCache;
exports.IncrementStatsCounter = IncrementStatsCounter;
exports.Likely = Likely;
exports.Unlikely = Unlikely;
exports.HarmonyToString = HarmonyToString;
exports.GetTypeFeedbackVector = GetTypeFeedbackVector;
exports.GetCallerJSFunction = GetCallerJSFunction;
exports.QuoteJSONString = QuoteJSONString;
exports.BasicJSONStringify = BasicJSONStringify;
exports.ParseJson = ParseJson;
exports.CreateObjectLiteral = CreateObjectLiteral;
exports.CreateArrayLiteral = CreateArrayLiteral;
exports.CreateArrayLiteralStubBailout = CreateArrayLiteralStubBailout;
exports.StoreArrayLiteralElement = StoreArrayLiteralElement;
exports.LiveEditFindSharedFunctionInfosForScript = LiveEditFindSharedFunctionInfosForScript;
exports.LiveEditGatherCompileInfo = LiveEditGatherCompileInfo;
exports.LiveEditReplaceScript = LiveEditReplaceScript;
exports.LiveEditFunctionSourceUpdated = LiveEditFunctionSourceUpdated;
exports.LiveEditReplaceFunctionCode = LiveEditReplaceFunctionCode;
exports.LiveEditFunctionSetScript = LiveEditFunctionSetScript;
exports.LiveEditReplaceRefToNestedFunction = LiveEditReplaceRefToNestedFunction;
exports.LiveEditPatchFunctionPositions = LiveEditPatchFunctionPositions;
exports.LiveEditCheckAndDropActivations = LiveEditCheckAndDropActivations;
exports.LiveEditCompareStrings = LiveEditCompareStrings;
exports.LiveEditRestartFrame = LiveEditRestartFrame;
exports.MathAcos = MathAcos;
exports.MathAsin = MathAsin;
exports.MathAtan = MathAtan;
exports.MathLogRT = MathLogRT;
exports.DoubleHi = DoubleHi;
exports.DoubleLo = DoubleLo;
exports.ConstructDouble = ConstructDouble;
exports.RemPiO2 = RemPiO2;
exports.MathAtan2 = MathAtan2;
exports.MathExpRT = MathExpRT;
exports.MathClz32 = MathClz32;
exports.MathFloor = MathFloor;
exports.MathPowSlow = MathPowSlow;
exports.MathPowRT = MathPowRT;
exports.RoundNumber = RoundNumber;
exports.MathSqrt = MathSqrt;
exports.MathFround = MathFround;
exports.MathPow = MathPow;
exports.IsMinusZero = IsMinusZero;
exports.NumberToRadixString = NumberToRadixString;
exports.NumberToFixed = NumberToFixed;
exports.NumberToExponential = NumberToExponential;
exports.NumberToPrecision = NumberToPrecision;
exports.IsValidSmi = IsValidSmi;
exports.StringToNumber = StringToNumber;
exports.StringParseInt = StringParseInt;
exports.StringParseFloat = StringParseFloat;
exports.NumberToStringRT = NumberToStringRT;
exports.NumberToStringSkipCache = NumberToStringSkipCache;
exports.NumberToInteger = NumberToInteger;
exports.NumberToIntegerMapMinusZero = NumberToIntegerMapMinusZero;
exports.NumberToJSUint32 = NumberToJSUint32;
exports.NumberToJSInt32 = NumberToJSInt32;
exports.NumberToSmi = NumberToSmi;
exports.NumberAdd = NumberAdd;
exports.NumberSub = NumberSub;
exports.NumberMul = NumberMul;
exports.NumberUnaryMinus = NumberUnaryMinus;
exports.NumberDiv = NumberDiv;
exports.NumberMod = NumberMod;
exports.NumberImul = NumberImul;
exports.NumberOr = NumberOr;
exports.NumberAnd = NumberAnd;
exports.NumberXor = NumberXor;
exports.NumberShl = NumberShl;
exports.NumberShr = NumberShr;
exports.NumberSar = NumberSar;
exports.NumberEquals = NumberEquals;
exports.NumberCompare = NumberCompare;
exports.SmiLexicographicCompare = SmiLexicographicCompare;
exports.MaxSmi = MaxSmi;
exports.NumberToString = NumberToString;
exports.IsSmi = IsSmi;
exports.IsNonNegativeSmi = IsNonNegativeSmi;
exports.GetRootNaN = GetRootNaN;
exports.GetPrototype = GetPrototype;
exports.InternalSetPrototype = InternalSetPrototype;
exports.SetPrototype = SetPrototype;
exports.IsInPrototypeChain = IsInPrototypeChain;
exports.GetOwnProperty = GetOwnProperty;
exports.PreventExtensions = PreventExtensions;
exports.IsExtensible = IsExtensible;
exports.OptimizeObjectForAddingMultipleProperties = OptimizeObjectForAddingMultipleProperties;
exports.ObjectFreeze = ObjectFreeze;
exports.ObjectSeal = ObjectSeal;
exports.GetProperty = GetProperty;
exports.GetPropertyStrong = GetPropertyStrong;
exports.KeyedGetProperty = KeyedGetProperty;
exports.KeyedGetPropertyStrong = KeyedGetPropertyStrong;
exports.AddNamedProperty = AddNamedProperty;
exports.SetProperty = SetProperty;
exports.AddElement = AddElement;
exports.AppendElement = AppendElement;
exports.DeleteProperty = DeleteProperty;
exports.HasOwnProperty = HasOwnProperty;
exports.HasProperty = HasProperty;
exports.HasElement = HasElement;
exports.IsPropertyEnumerable = IsPropertyEnumerable;
exports.GetPropertyNames = GetPropertyNames;
exports.GetPropertyNamesFast = GetPropertyNamesFast;
exports.GetOwnPropertyNames = GetOwnPropertyNames;
exports.GetOwnElementNames = GetOwnElementNames;
exports.GetInterceptorInfo = GetInterceptorInfo;
exports.GetNamedInterceptorPropertyNames = GetNamedInterceptorPropertyNames;
exports.GetIndexedInterceptorElementNames = GetIndexedInterceptorElementNames;
exports.OwnKeys = OwnKeys;
exports.ToFastProperties = ToFastProperties;
exports.ToBool = ToBool;
exports.NewStringWrapper = NewStringWrapper;
exports.AllocateHeapNumber = AllocateHeapNumber;
exports.NewObject = NewObject;
exports.NewObjectWithAllocationSite = NewObjectWithAllocationSite;
exports.FinalizeInstanceSize = FinalizeInstanceSize;
exports.GlobalProxy = GlobalProxy;
exports.LookupAccessor = LookupAccessor;
exports.LoadMutableDouble = LoadMutableDouble;
exports.TryMigrateInstance = TryMigrateInstance;
exports.IsJSGlobalProxy = IsJSGlobalProxy;
exports.DefineAccessorPropertyUnchecked = DefineAccessorPropertyUnchecked;
exports.DefineDataPropertyUnchecked = DefineDataPropertyUnchecked;
exports.GetDataProperty = GetDataProperty;
exports.HasFastPackedElements = HasFastPackedElements;
exports.ValueOf = ValueOf;
exports.SetValueOf = SetValueOf;
exports.JSValueGetValue = JSValueGetValue;
exports.HeapObjectGetMap = HeapObjectGetMap;
exports.MapGetInstanceType = MapGetInstanceType;
exports.ObjectEquals = ObjectEquals;
exports.IsObject = IsObject;
exports.IsUndetectableObject = IsUndetectableObject;
exports.IsSpecObject = IsSpecObject;
exports.IsStrong = IsStrong;
exports.ClassOf = ClassOf;
exports.DefineGetterPropertyUnchecked = DefineGetterPropertyUnchecked;
exports.DefineSetterPropertyUnchecked = DefineSetterPropertyUnchecked;
exports.IsObserved = IsObserved;
exports.SetIsObserved = SetIsObserved;
exports.EnqueueMicrotask = EnqueueMicrotask;
exports.RunMicrotasks = RunMicrotasks;
exports.DeliverObservationChangeRecords = DeliverObservationChangeRecords;
exports.GetObservationState = GetObservationState;
exports.ObserverObjectAndRecordHaveSameOrigin = ObserverObjectAndRecordHaveSameOrigin;
exports.ObjectWasCreatedInCurrentOrigin = ObjectWasCreatedInCurrentOrigin;
exports.GetObjectContextObjectObserve = GetObjectContextObjectObserve;
exports.GetObjectContextObjectGetNotifier = GetObjectContextObjectGetNotifier;
exports.GetObjectContextNotifierPerformChange = GetObjectContextNotifierPerformChange;
exports.CreateJSProxy = CreateJSProxy;
exports.CreateJSFunctionProxy = CreateJSFunctionProxy;
exports.IsJSProxy = IsJSProxy;
exports.IsJSFunctionProxy = IsJSFunctionProxy;
exports.GetHandler = GetHandler;
exports.GetCallTrap = GetCallTrap;
exports.GetConstructTrap = GetConstructTrap;
exports.Fix = Fix;
exports.StringReplaceGlobalRegExpWithString = StringReplaceGlobalRegExpWithString;
exports.StringSplit = StringSplit;
exports.RegExpExec = RegExpExec;
exports.RegExpConstructResultRT = RegExpConstructResultRT;
exports.RegExpConstructResult = RegExpConstructResult;
exports.RegExpInitializeAndCompile = RegExpInitializeAndCompile;
exports.MaterializeRegExpLiteral = MaterializeRegExpLiteral;
exports.RegExpExecMultiple = RegExpExecMultiple;
exports.RegExpExecReThrow = RegExpExecReThrow;
exports.IsRegExp = IsRegExp;
exports.ThrowConstAssignError = ThrowConstAssignError;
exports.DeclareGlobals = DeclareGlobals;
exports.InitializeVarGlobal = InitializeVarGlobal;
exports.InitializeConstGlobal = InitializeConstGlobal;
exports.DeclareLookupSlot = DeclareLookupSlot;
exports.InitializeLegacyConstLookupSlot = InitializeLegacyConstLookupSlot;
exports.NewArguments = NewArguments;
exports.NewSloppyArguments = NewSloppyArguments;
exports.NewStrictArguments = NewStrictArguments;
exports.NewRestParam = NewRestParam;
exports.NewRestParamSlow = NewRestParamSlow;
exports.NewClosureFromStubFailure = NewClosureFromStubFailure;
exports.NewClosure = NewClosure;
exports.NewScriptContext = NewScriptContext;
exports.NewFunctionContext = NewFunctionContext;
exports.PushWithContext = PushWithContext;
exports.PushCatchContext = PushCatchContext;
exports.PushBlockContext = PushBlockContext;
exports.IsJSModule = IsJSModule;
exports.PushModuleContext = PushModuleContext;
exports.DeclareModules = DeclareModules;
exports.DeleteLookupSlot = DeleteLookupSlot;
exports.StoreLookupSlot = StoreLookupSlot;
exports.GetArgumentsProperty = GetArgumentsProperty;
exports.ArgumentsLength = ArgumentsLength;
exports.Arguments = Arguments;
exports.StringReplaceOneCharWithString = StringReplaceOneCharWithString;
exports.StringIndexOf = StringIndexOf;
exports.StringLastIndexOf = StringLastIndexOf;
exports.StringLocaleCompare = StringLocaleCompare;
exports.SubStringRT = SubStringRT;
exports.SubString = SubString;
exports.StringAddRT = StringAddRT;
exports.StringAdd = StringAdd;
exports.InternalizeString = InternalizeString;
exports.StringMatch = StringMatch;
exports.StringCharCodeAtRT = StringCharCodeAtRT;
exports.CharFromCode = CharFromCode;
exports.StringCompareRT = StringCompareRT;
exports.StringCompare = StringCompare;
exports.StringBuilderConcat = StringBuilderConcat;
exports.StringBuilderJoin = StringBuilderJoin;
exports.SparseJoinWithSeparator = SparseJoinWithSeparator;
exports.StringToArray = StringToArray;
exports.StringToLowerCase = StringToLowerCase;
exports.StringToUpperCase = StringToUpperCase;
exports.StringTrim = StringTrim;
exports.TruncateString = TruncateString;
exports.NewString = NewString;
exports.NewConsString = NewConsString;
exports.StringEquals = StringEquals;
exports.FlattenString = FlattenString;
exports.StringCharFromCode = StringCharFromCode;
exports.StringCharAt = StringCharAt;
exports.OneByteSeqStringGetChar = OneByteSeqStringGetChar;
exports.OneByteSeqStringSetChar = OneByteSeqStringSetChar;
exports.TwoByteSeqStringGetChar = TwoByteSeqStringGetChar;
exports.TwoByteSeqStringSetChar = TwoByteSeqStringSetChar;
exports.StringCharCodeAt = StringCharCodeAt;
exports.IsStringWrapperSafeForDefaultValueOf = IsStringWrapperSafeForDefaultValueOf;
exports.StringGetLength = StringGetLength;
exports.CreateSymbol = CreateSymbol;
exports.CreatePrivateSymbol = CreatePrivateSymbol;
exports.CreateGlobalPrivateSymbol = CreateGlobalPrivateSymbol;
exports.NewSymbolWrapper = NewSymbolWrapper;
exports.SymbolDescription = SymbolDescription;
exports.SymbolRegistry = SymbolRegistry;
exports.SymbolIsPrivate = SymbolIsPrivate;
exports.DeoptimizeFunction = DeoptimizeFunction;
exports.DeoptimizeNow = DeoptimizeNow;
exports.RunningInSimulator = RunningInSimulator;
exports.IsConcurrentRecompilationSupported = IsConcurrentRecompilationSupported;
exports.OptimizeFunctionOnNextCall = OptimizeFunctionOnNextCall;
exports.OptimizeOsr = OptimizeOsr;
exports.NeverOptimizeFunction = NeverOptimizeFunction;
exports.GetOptimizationStatus = GetOptimizationStatus;
exports.UnblockConcurrentRecompilation = UnblockConcurrentRecompilation;
exports.GetOptimizationCount = GetOptimizationCount;
exports.GetUndetectable = GetUndetectable;
exports.ClearFunctionTypeFeedback = ClearFunctionTypeFeedback;
exports.NotifyContextDisposed = NotifyContextDisposed;
exports.SetAllocationTimeout = SetAllocationTimeout;
exports.DebugPrint = DebugPrint;
exports.DebugTrace = DebugTrace;
exports.GlobalPrint = GlobalPrint;
exports.SystemBreak = SystemBreak;
exports.SetFlags = SetFlags;
exports.Abort = Abort;
exports.AbortJS = AbortJS;
exports.NativeScriptsCount = NativeScriptsCount;
exports.GetV8Version = GetV8Version;
exports.DisassembleFunction = DisassembleFunction;
exports.TraceEnter = TraceEnter;
exports.TraceExit = TraceExit;
exports.HaveSameMap = HaveSameMap;
exports.HasFastSmiElements = HasFastSmiElements;
exports.HasFastObjectElements = HasFastObjectElements;
exports.HasFastSmiOrObjectElements = HasFastSmiOrObjectElements;
exports.HasFastDoubleElements = HasFastDoubleElements;
exports.HasFastHoleyElements = HasFastHoleyElements;
exports.HasDictionaryElements = HasDictionaryElements;
exports.HasSloppyArgumentsElements = HasSloppyArgumentsElements;
exports.HasExternalArrayElements = HasExternalArrayElements;
exports.HasFastProperties = HasFastProperties;
exports.HasExternalUint8Elements = HasExternalUint8Elements;
exports.HasExternalInt8Elements = HasExternalInt8Elements;
exports.HasExternalUint16Elements = HasExternalUint16Elements;
exports.HasExternalInt16Elements = HasExternalInt16Elements;
exports.HasExternalUint32Elements = HasExternalUint32Elements;
exports.HasExternalInt32Elements = HasExternalInt32Elements;
exports.HasExternalFloat32Elements = HasExternalFloat32Elements;
exports.HasExternalFloat64Elements = HasExternalFloat64Elements;
exports.HasExternalUint8ClampedElements = HasExternalUint8ClampedElements;
exports.HasFixedUint8Elements = HasFixedUint8Elements;
exports.HasFixedInt8Elements = HasFixedInt8Elements;
exports.HasFixedUint16Elements = HasFixedUint16Elements;
exports.HasFixedInt16Elements = HasFixedInt16Elements;
exports.HasFixedUint32Elements = HasFixedUint32Elements;
exports.HasFixedInt32Elements = HasFixedInt32Elements;
exports.HasFixedFloat32Elements = HasFixedFloat32Elements;
exports.HasFixedFloat64Elements = HasFixedFloat64Elements;
exports.HasFixedUint8ClampedElements = HasFixedUint8ClampedElements;
exports.ArrayBufferInitialize = ArrayBufferInitialize;
exports.ArrayBufferGetByteLength = ArrayBufferGetByteLength;
exports.ArrayBufferSliceImpl = ArrayBufferSliceImpl;
exports.ArrayBufferIsView = ArrayBufferIsView;
exports.ArrayBufferNeuter = ArrayBufferNeuter;
exports.TypedArrayInitialize = TypedArrayInitialize;
exports.TypedArrayInitializeFromArrayLike = TypedArrayInitializeFromArrayLike;
exports.ArrayBufferViewGetByteLength = ArrayBufferViewGetByteLength;
exports.ArrayBufferViewGetByteOffset = ArrayBufferViewGetByteOffset;
exports.TypedArrayGetLength = TypedArrayGetLength;
exports.DataViewGetBuffer = DataViewGetBuffer;
exports.TypedArrayGetBuffer = TypedArrayGetBuffer;
exports.TypedArraySetFastCases = TypedArraySetFastCases;
exports.TypedArrayMaxSizeInHeap = TypedArrayMaxSizeInHeap;
exports.IsTypedArray = IsTypedArray;
exports.IsSharedTypedArray = IsSharedTypedArray;
exports.IsSharedIntegerTypedArray = IsSharedIntegerTypedArray;
exports.DataViewInitialize = DataViewInitialize;
exports.DataViewGetUint8 = DataViewGetUint8;
exports.DataViewGetInt8 = DataViewGetInt8;
exports.DataViewGetUint16 = DataViewGetUint16;
exports.DataViewGetInt16 = DataViewGetInt16;
exports.DataViewGetUint32 = DataViewGetUint32;
exports.DataViewGetInt32 = DataViewGetInt32;
exports.DataViewGetFloat32 = DataViewGetFloat32;
exports.DataViewGetFloat64 = DataViewGetFloat64;
exports.DataViewSetUint8 = DataViewSetUint8;
exports.DataViewSetInt8 = DataViewSetInt8;
exports.DataViewSetUint16 = DataViewSetUint16;
exports.DataViewSetInt16 = DataViewSetInt16;
exports.DataViewSetUint32 = DataViewSetUint32;
exports.DataViewSetInt32 = DataViewSetInt32;
exports.DataViewSetFloat32 = DataViewSetFloat32;
exports.DataViewSetFloat64 = DataViewSetFloat64;
exports.URIEscape = URIEscape;
exports.URIUnescape = URIUnescape;
exports.LoadLookupSlot = LoadLookupSlot;
exports.LoadLookupSlotNoReferenceError = LoadLookupSlotNoReferenceError;

function FinishArrayPrototypeSetup(a) {
  return %FinishArrayPrototypeSetup(a);
}

function SpecialArrayFunctions() {
  return %SpecialArrayFunctions();
}

function TransitionElementsKind(a, b) {
  return %TransitionElementsKind(a, b);
}

function PushIfAbsent(a, b) {
  return %PushIfAbsent(a, b);
}

function ArrayConcat(a) {
  return %ArrayConcat(a);
}

function RemoveArrayHoles(a, b) {
  return %RemoveArrayHoles(a, b);
}

function MoveArrayContents(a, b) {
  return %MoveArrayContents(a, b);
}

function EstimateNumberOfElements(a) {
  return %EstimateNumberOfElements(a);
}

function GetArrayKeys(a, b) {
  return %GetArrayKeys(a, b);
}

function ArrayConstructor(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  return %ArrayConstructor(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
}

function ArrayConstructorWithSubclassing(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  return %ArrayConstructorWithSubclassing(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
}

function InternalArrayConstructor(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  return %InternalArrayConstructor(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
}

function NormalizeElements(a) {
  return %NormalizeElements(a);
}

function GrowArrayElements(a, b) {
  return %GrowArrayElements(a, b);
}

function HasComplexElements(a) {
  return %HasComplexElements(a);
}

function IsArray(a) {
  return %IsArray(a);
}

function HasCachedArrayIndex(a) {
  return %HasCachedArrayIndex(a);
}

function GetCachedArrayIndex(a) {
  return %GetCachedArrayIndex(a);
}

function FixedArrayGet(a, b) {
  return %FixedArrayGet(a, b);
}

function FixedArraySet(a, b, c) {
  return %FixedArraySet(a, b, c);
}

function FastOneByteArrayJoin(a, b) {
  return %FastOneByteArrayJoin(a, b);
}

function AtomicsCompareExchange(a, b, c, d) {
  return %AtomicsCompareExchange(a, b, c, d);
}

function AtomicsLoad(a, b) {
  return %AtomicsLoad(a, b);
}

function AtomicsStore(a, b, c) {
  return %AtomicsStore(a, b, c);
}

function AtomicsAdd(a, b, c) {
  return %AtomicsAdd(a, b, c);
}

function AtomicsSub(a, b, c) {
  return %AtomicsSub(a, b, c);
}

function AtomicsAnd(a, b, c) {
  return %AtomicsAnd(a, b, c);
}

function AtomicsOr(a, b, c) {
  return %AtomicsOr(a, b, c);
}

function AtomicsXor(a, b, c) {
  return %AtomicsXor(a, b, c);
}

function AtomicsExchange(a, b, c) {
  return %AtomicsExchange(a, b, c);
}

function AtomicsIsLockFree(a) {
  return %AtomicsIsLockFree(a);
}

function ThrowNonMethodError() {
  return %ThrowNonMethodError();
}

function ThrowUnsupportedSuperError() {
  return %ThrowUnsupportedSuperError();
}

function ThrowConstructorNonCallableError() {
  return %ThrowConstructorNonCallableError();
}

function ThrowArrayNotSubclassableError() {
  return %ThrowArrayNotSubclassableError();
}

function ThrowStaticPrototypeError() {
  return %ThrowStaticPrototypeError();
}

function ThrowIfStaticPrototype(a) {
  return %ThrowIfStaticPrototype(a);
}

function ToMethod(a, b) {
  return %ToMethod(a, b);
}

function HomeObjectSymbol() {
  return %HomeObjectSymbol();
}

function DefineClass(a, b, c, d, e, f) {
  return %DefineClass(a, b, c, d, e, f);
}

function DefineClassMethod(a, b, c) {
  return %DefineClassMethod(a, b, c);
}

function ClassGetSourceCode(a) {
  return %ClassGetSourceCode(a);
}

function LoadFromSuper(a, b, c, d) {
  return %LoadFromSuper(a, b, c, d);
}

function LoadKeyedFromSuper(a, b, c, d) {
  return %LoadKeyedFromSuper(a, b, c, d);
}

function StoreToSuper_Strict(a, b, c, d) {
  return %StoreToSuper_Strict(a, b, c, d);
}

function StoreToSuper_Sloppy(a, b, c, d) {
  return %StoreToSuper_Sloppy(a, b, c, d);
}

function StoreKeyedToSuper_Strict(a, b, c, d) {
  return %StoreKeyedToSuper_Strict(a, b, c, d);
}

function StoreKeyedToSuper_Sloppy(a, b, c, d) {
  return %StoreKeyedToSuper_Sloppy(a, b, c, d);
}

function HandleStepInForDerivedConstructors(a) {
  return %HandleStepInForDerivedConstructors(a);
}

function DefaultConstructorCallSuper(a, b) {
  return %DefaultConstructorCallSuper(a, b);
}

function CallSuperWithSpread(a) {
  return %CallSuperWithSpread(a);
}

function StringGetRawHashField(a) {
  return %StringGetRawHashField(a);
}

function TheHole() {
  return %TheHole();
}

function JSCollectionGetTable(a) {
  return %JSCollectionGetTable(a);
}

function GenericHash(a) {
  return %GenericHash(a);
}

function SetInitialize(a) {
  return %SetInitialize(a);
}

function SetGrow(a) {
  return %SetGrow(a);
}

function SetShrink(a) {
  return %SetShrink(a);
}

function SetClear(a) {
  return %SetClear(a);
}

function SetIteratorInitialize(a, b, c) {
  return %SetIteratorInitialize(a, b, c);
}

function SetIteratorClone(a) {
  return %SetIteratorClone(a);
}

function SetIteratorNext(a, b) {
  return %SetIteratorNext(a, b);
}

function SetIteratorDetails(a) {
  return %SetIteratorDetails(a);
}

function MapInitialize(a) {
  return %MapInitialize(a);
}

function MapShrink(a) {
  return %MapShrink(a);
}

function MapClear(a) {
  return %MapClear(a);
}

function MapGrow(a) {
  return %MapGrow(a);
}

function MapIteratorInitialize(a, b, c) {
  return %MapIteratorInitialize(a, b, c);
}

function MapIteratorClone(a) {
  return %MapIteratorClone(a);
}

function MapIteratorDetails(a) {
  return %MapIteratorDetails(a);
}

function GetWeakMapEntries(a, b) {
  return %GetWeakMapEntries(a, b);
}

function MapIteratorNext(a, b) {
  return %MapIteratorNext(a, b);
}

function WeakCollectionInitialize(a) {
  return %WeakCollectionInitialize(a);
}

function WeakCollectionGet(a, b, c) {
  return %WeakCollectionGet(a, b, c);
}

function WeakCollectionHas(a, b, c) {
  return %WeakCollectionHas(a, b, c);
}

function WeakCollectionDelete(a, b, c) {
  return %WeakCollectionDelete(a, b, c);
}

function WeakCollectionSet(a, b, c, d) {
  return %WeakCollectionSet(a, b, c, d);
}

function GetWeakSetValues(a, b) {
  return %GetWeakSetValues(a, b);
}

function ObservationWeakMapCreate() {
  return %ObservationWeakMapCreate();
}

function CompileLazy(a) {
  return %CompileLazy(a);
}

function CompileOptimized(a, b) {
  return %CompileOptimized(a, b);
}

function NotifyStubFailure() {
  return %NotifyStubFailure();
}

function NotifyDeoptimized(a) {
  return %NotifyDeoptimized(a);
}

function CompileForOnStackReplacement(a) {
  return %CompileForOnStackReplacement(a);
}

function TryInstallOptimizedCode(a) {
  return %TryInstallOptimizedCode(a);
}

function CompileString(a, b) {
  return %CompileString(a, b);
}

function ResolvePossiblyDirectEval(a, b, c, d, e) {
  return %ResolvePossiblyDirectEval(a, b, c, d, e);
}

function DateMakeDay(a, b) {
  return %DateMakeDay(a, b);
}

function DateSetValue(a, b, c) {
  return %DateSetValue(a, b, c);
}

function IsDate(a) {
  return %IsDate(a);
}

function ThrowNotDateError() {
  return %ThrowNotDateError();
}

function DateCurrentTime() {
  return %DateCurrentTime();
}

function DateParseString(a, b) {
  return %DateParseString(a, b);
}

function DateLocalTimezone(a) {
  return %DateLocalTimezone(a);
}

function DateToUTC(a) {
  return %DateToUTC(a);
}

function DateCacheVersion() {
  return %DateCacheVersion();
}

function DateField(a, b) {
  return %DateField(a, b);
}

function DebugBreak() {
  return %DebugBreak();
}

function SetDebugEventListener(a, b) {
  return %SetDebugEventListener(a, b);
}

function ScheduleBreak() {
  return %ScheduleBreak();
}

function DebugGetInternalProperties(a) {
  return %DebugGetInternalProperties(a);
}

function DebugGetPropertyDetails(a, b) {
  return %DebugGetPropertyDetails(a, b);
}

function DebugGetProperty(a, b) {
  return %DebugGetProperty(a, b);
}

function DebugPropertyTypeFromDetails(a) {
  return %DebugPropertyTypeFromDetails(a);
}

function DebugPropertyAttributesFromDetails(a) {
  return %DebugPropertyAttributesFromDetails(a);
}

function DebugPropertyIndexFromDetails(a) {
  return %DebugPropertyIndexFromDetails(a);
}

function DebugNamedInterceptorPropertyValue(a, b) {
  return %DebugNamedInterceptorPropertyValue(a, b);
}

function DebugIndexedInterceptorElementValue(a, b) {
  return %DebugIndexedInterceptorElementValue(a, b);
}

function CheckExecutionState(a) {
  return %CheckExecutionState(a);
}

function GetFrameCount(a) {
  return %GetFrameCount(a);
}

function GetFrameDetails(a, b) {
  return %GetFrameDetails(a, b);
}

function GetScopeCount(a, b) {
  return %GetScopeCount(a, b);
}

function GetStepInPositions(a, b) {
  return %GetStepInPositions(a, b);
}

function GetScopeDetails(a, b, c, d) {
  return %GetScopeDetails(a, b, c, d);
}

function GetAllScopesDetails(a, b, c, d) {
  return %GetAllScopesDetails(a, b, c, d);
}

function GetFunctionScopeCount(a) {
  return %GetFunctionScopeCount(a);
}

function GetFunctionScopeDetails(a, b) {
  return %GetFunctionScopeDetails(a, b);
}

function SetScopeVariableValue(a, b, c, d, e, f) {
  return %SetScopeVariableValue(a, b, c, d, e, f);
}

function DebugPrintScopes() {
  return %DebugPrintScopes();
}

function GetThreadCount(a) {
  return %GetThreadCount(a);
}

function GetThreadDetails(a, b) {
  return %GetThreadDetails(a, b);
}

function SetDisableBreak(a) {
  return %SetDisableBreak(a);
}

function GetBreakLocations(a, b) {
  return %GetBreakLocations(a, b);
}

function SetFunctionBreakPoint(a, b, c) {
  return %SetFunctionBreakPoint(a, b, c);
}

function SetScriptBreakPoint(a, b, c, d) {
  return %SetScriptBreakPoint(a, b, c, d);
}

function ClearBreakPoint(a) {
  return %ClearBreakPoint(a);
}

function ChangeBreakOnException(a, b) {
  return %ChangeBreakOnException(a, b);
}

function IsBreakOnException(a) {
  return %IsBreakOnException(a);
}

function PrepareStep(a, b, c, d) {
  return %PrepareStep(a, b, c, d);
}

function ClearStepping() {
  return %ClearStepping();
}

function DebugEvaluate(a, b, c, d, e, f) {
  return %DebugEvaluate(a, b, c, d, e, f);
}

function DebugEvaluateGlobal(a, b, c, d) {
  return %DebugEvaluateGlobal(a, b, c, d);
}

function DebugGetLoadedScripts() {
  return %DebugGetLoadedScripts();
}

function DebugReferencedBy(a, b, c) {
  return %DebugReferencedBy(a, b, c);
}

function DebugConstructedBy(a, b) {
  return %DebugConstructedBy(a, b);
}

function DebugGetPrototype(a) {
  return %DebugGetPrototype(a);
}

function DebugSetScriptSource(a, b) {
  return %DebugSetScriptSource(a, b);
}

function FunctionGetInferredName(a) {
  return %FunctionGetInferredName(a);
}

function GetFunctionCodePositionFromSource(a, b) {
  return %GetFunctionCodePositionFromSource(a, b);
}

function ExecuteInDebugContext(a) {
  return %ExecuteInDebugContext(a);
}

function GetDebugContext() {
  return %GetDebugContext();
}

function CollectGarbage(a) {
  return %CollectGarbage(a);
}

function GetHeapUsage() {
  return %GetHeapUsage();
}

function GetScript(a) {
  return %GetScript(a);
}

function DebugCallbackSupportsStepping(a) {
  return %DebugCallbackSupportsStepping(a);
}

function DebugPrepareStepInIfStepping(a) {
  return %DebugPrepareStepInIfStepping(a);
}

function DebugPushPromise(a, b) {
  return %DebugPushPromise(a, b);
}

function DebugPopPromise() {
  return %DebugPopPromise();
}

function DebugPromiseEvent(a) {
  return %DebugPromiseEvent(a);
}

function DebugAsyncTaskEvent(a) {
  return %DebugAsyncTaskEvent(a);
}

function DebugIsActive() {
  return %DebugIsActive();
}

function DebugBreakInOptimizedCode() {
  return %DebugBreakInOptimizedCode();
}

function ForInDone(a, b) {
  return %ForInDone(a, b);
}

function ForInFilter(a, b) {
  return %ForInFilter(a, b);
}

function ForInNext(a, b, c, d) {
  return %ForInNext(a, b, c, d);
}

function ForInStep(a) {
  return %ForInStep(a);
}

function IsSloppyModeFunction(a) {
  return %IsSloppyModeFunction(a);
}

function FunctionGetName(a) {
  return %FunctionGetName(a);
}

function FunctionSetName(a, b) {
  return %FunctionSetName(a, b);
}

function FunctionNameShouldPrintAsAnonymous(a) {
  return %FunctionNameShouldPrintAsAnonymous(a);
}

function FunctionMarkNameShouldPrintAsAnonymous(a) {
  return %FunctionMarkNameShouldPrintAsAnonymous(a);
}

function FunctionIsArrow(a) {
  return %FunctionIsArrow(a);
}

function FunctionIsConciseMethod(a) {
  return %FunctionIsConciseMethod(a);
}

function FunctionRemovePrototype(a) {
  return %FunctionRemovePrototype(a);
}

function FunctionGetScript(a) {
  return %FunctionGetScript(a);
}

function FunctionGetSourceCode(a) {
  return %FunctionGetSourceCode(a);
}

function FunctionGetScriptSourcePosition(a) {
  return %FunctionGetScriptSourcePosition(a);
}

function FunctionGetPositionForOffset(a, b) {
  return %FunctionGetPositionForOffset(a, b);
}

function FunctionSetInstanceClassName(a, b) {
  return %FunctionSetInstanceClassName(a, b);
}

function FunctionSetLength(a, b) {
  return %FunctionSetLength(a, b);
}

function FunctionSetPrototype(a, b) {
  return %FunctionSetPrototype(a, b);
}

function FunctionIsAPIFunction(a) {
  return %FunctionIsAPIFunction(a);
}

function FunctionIsBuiltin(a) {
  return %FunctionIsBuiltin(a);
}

function SetCode(a, b) {
  return %SetCode(a, b);
}

function SetNativeFlag(a) {
  return %SetNativeFlag(a);
}

function ThrowStrongModeTooFewArguments() {
  return %ThrowStrongModeTooFewArguments();
}

function IsConstructor(a) {
  return %IsConstructor(a);
}

function SetForceInlineFlag(a) {
  return %SetForceInlineFlag(a);
}

function FunctionBindArguments(a, b, c, d) {
  return %FunctionBindArguments(a, b, c, d);
}

function BoundFunctionGetBindings(a) {
  return %BoundFunctionGetBindings(a);
}

function NewObjectFromBound(a) {
  return %NewObjectFromBound(a);
}

function Call(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  return %Call(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
}

function Apply(a, b, c, d, e) {
  return %Apply(a, b, c, d, e);
}

function GetFunctionDelegate(a) {
  return %GetFunctionDelegate(a);
}

function GetConstructorDelegate(a) {
  return %GetConstructorDelegate(a);
}

function GetOriginalConstructor() {
  return %GetOriginalConstructor();
}

function CallFunction(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  return %CallFunction(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
}

function IsConstructCall() {
  return %IsConstructCall();
}

function IsFunction(a) {
  return %IsFunction(a);
}

function CreateJSGeneratorObject() {
  return %CreateJSGeneratorObject();
}

function SuspendJSGeneratorObject(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  return %SuspendJSGeneratorObject(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
}

function ResumeJSGeneratorObject(a, b, c) {
  return %ResumeJSGeneratorObject(a, b, c);
}

function GeneratorClose(a) {
  return %GeneratorClose(a);
}

function GeneratorGetFunction(a) {
  return %GeneratorGetFunction(a);
}

function GeneratorGetContext(a) {
  return %GeneratorGetContext(a);
}

function GeneratorGetReceiver(a) {
  return %GeneratorGetReceiver(a);
}

function GeneratorGetContinuation(a) {
  return %GeneratorGetContinuation(a);
}

function GeneratorGetSourcePosition(a) {
  return %GeneratorGetSourcePosition(a);
}

function FunctionIsGenerator(a) {
  return %FunctionIsGenerator(a);
}

function GeneratorNext(a, b) {
  return %GeneratorNext(a, b);
}

function GeneratorThrow(a, b) {
  return %GeneratorThrow(a, b);
}

function CanonicalizeLanguageTag(a) {
  return %CanonicalizeLanguageTag(a);
}

function AvailableLocalesOf(a) {
  return %AvailableLocalesOf(a);
}

function GetDefaultICULocale() {
  return %GetDefaultICULocale();
}

function GetLanguageTagVariants(a) {
  return %GetLanguageTagVariants(a);
}

function IsInitializedIntlObject(a) {
  return %IsInitializedIntlObject(a);
}

function IsInitializedIntlObjectOfType(a, b) {
  return %IsInitializedIntlObjectOfType(a, b);
}

function MarkAsInitializedIntlObjectOfType(a, b, c) {
  return %MarkAsInitializedIntlObjectOfType(a, b, c);
}

function GetImplFromInitializedIntlObject(a) {
  return %GetImplFromInitializedIntlObject(a);
}

function CreateDateTimeFormat(a, b, c) {
  return %CreateDateTimeFormat(a, b, c);
}

function InternalDateFormat(a, b) {
  return %InternalDateFormat(a, b);
}

function InternalDateParse(a, b) {
  return %InternalDateParse(a, b);
}

function CreateNumberFormat(a, b, c) {
  return %CreateNumberFormat(a, b, c);
}

function InternalNumberFormat(a, b) {
  return %InternalNumberFormat(a, b);
}

function InternalNumberParse(a, b) {
  return %InternalNumberParse(a, b);
}

function CreateCollator(a, b, c) {
  return %CreateCollator(a, b, c);
}

function InternalCompare(a, b, c) {
  return %InternalCompare(a, b, c);
}

function StringNormalize(a, b) {
  return %StringNormalize(a, b);
}

function CreateBreakIterator(a, b, c) {
  return %CreateBreakIterator(a, b, c);
}

function BreakIteratorAdoptText(a, b) {
  return %BreakIteratorAdoptText(a, b);
}

function BreakIteratorFirst(a) {
  return %BreakIteratorFirst(a);
}

function BreakIteratorNext(a) {
  return %BreakIteratorNext(a);
}

function BreakIteratorCurrent(a) {
  return %BreakIteratorCurrent(a);
}

function BreakIteratorBreakType(a) {
  return %BreakIteratorBreakType(a);
}

function CheckIsBootstrapping() {
  return %CheckIsBootstrapping();
}

function Throw(a) {
  return %Throw(a);
}

function ReThrow(a) {
  return %ReThrow(a);
}

function UnwindAndFindExceptionHandler() {
  return %UnwindAndFindExceptionHandler();
}

function PromoteScheduledException() {
  return %PromoteScheduledException();
}

function ThrowReferenceError(a) {
  return %ThrowReferenceError(a);
}

function NewTypeError(a, b) {
  return %NewTypeError(a, b);
}

function NewSyntaxError(a, b) {
  return %NewSyntaxError(a, b);
}

function NewReferenceError(a, b) {
  return %NewReferenceError(a, b);
}

function ThrowIteratorResultNotAnObject(a) {
  return %ThrowIteratorResultNotAnObject(a);
}

function ThrowStrongModeImplicitConversion() {
  return %ThrowStrongModeImplicitConversion();
}

function PromiseRejectEvent(a, b, c) {
  return %PromiseRejectEvent(a, b, c);
}

function PromiseRevokeReject(a) {
  return %PromiseRevokeReject(a);
}

function PromiseHasHandlerSymbol() {
  return %PromiseHasHandlerSymbol();
}

function StackGuard() {
  return %StackGuard();
}

function Interrupt() {
  return %Interrupt();
}

function AllocateInNewSpace(a) {
  return %AllocateInNewSpace(a);
}

function AllocateInTargetSpace(a, b) {
  return %AllocateInTargetSpace(a, b);
}

function CollectStackTrace(a, b) {
  return %CollectStackTrace(a, b);
}

function RenderCallSite() {
  return %RenderCallSite();
}

function GetFromCacheRT(a, b) {
  return %GetFromCacheRT(a, b);
}

function MessageGetStartPosition(a) {
  return %MessageGetStartPosition(a);
}

function MessageGetScript(a) {
  return %MessageGetScript(a);
}

function FormatMessageString(a, b, c, d) {
  return %FormatMessageString(a, b, c, d);
}

function CallSiteGetFileNameRT(a, b, c) {
  return %CallSiteGetFileNameRT(a, b, c);
}

function CallSiteGetFunctionNameRT(a, b, c) {
  return %CallSiteGetFunctionNameRT(a, b, c);
}

function CallSiteGetScriptNameOrSourceUrlRT(a, b, c) {
  return %CallSiteGetScriptNameOrSourceUrlRT(a, b, c);
}

function CallSiteGetMethodNameRT(a, b, c) {
  return %CallSiteGetMethodNameRT(a, b, c);
}

function CallSiteGetLineNumberRT(a, b, c) {
  return %CallSiteGetLineNumberRT(a, b, c);
}

function CallSiteGetColumnNumberRT(a, b, c) {
  return %CallSiteGetColumnNumberRT(a, b, c);
}

function CallSiteIsNativeRT(a, b, c) {
  return %CallSiteIsNativeRT(a, b, c);
}

function CallSiteIsToplevelRT(a, b, c) {
  return %CallSiteIsToplevelRT(a, b, c);
}

function CallSiteIsEvalRT(a, b, c) {
  return %CallSiteIsEvalRT(a, b, c);
}

function CallSiteIsConstructorRT(a, b, c) {
  return %CallSiteIsConstructorRT(a, b, c);
}

function IS_VAR(a) {
  return %IS_VAR(a);
}

function GetFromCache(a, b) {
  return %GetFromCache(a, b);
}

function IncrementStatsCounter(a) {
  return %IncrementStatsCounter(a);
}

function Likely(a) {
  return %Likely(a);
}

function Unlikely(a) {
  return %Unlikely(a);
}

function HarmonyToString() {
  return %HarmonyToString();
}

function GetTypeFeedbackVector(a) {
  return %GetTypeFeedbackVector(a);
}

function GetCallerJSFunction() {
  return %GetCallerJSFunction();
}

function QuoteJSONString(a) {
  return %QuoteJSONString(a);
}

function BasicJSONStringify(a) {
  return %BasicJSONStringify(a);
}

function ParseJson(a) {
  return %ParseJson(a);
}

function CreateObjectLiteral(a, b, c, d) {
  return %CreateObjectLiteral(a, b, c, d);
}

function CreateArrayLiteral(a, b, c, d) {
  return %CreateArrayLiteral(a, b, c, d);
}

function CreateArrayLiteralStubBailout(a, b, c) {
  return %CreateArrayLiteralStubBailout(a, b, c);
}

function StoreArrayLiteralElement(a, b, c, d, e) {
  return %StoreArrayLiteralElement(a, b, c, d, e);
}

function LiveEditFindSharedFunctionInfosForScript(a) {
  return %LiveEditFindSharedFunctionInfosForScript(a);
}

function LiveEditGatherCompileInfo(a, b) {
  return %LiveEditGatherCompileInfo(a, b);
}

function LiveEditReplaceScript(a, b, c) {
  return %LiveEditReplaceScript(a, b, c);
}

function LiveEditFunctionSourceUpdated(a) {
  return %LiveEditFunctionSourceUpdated(a);
}

function LiveEditReplaceFunctionCode(a, b) {
  return %LiveEditReplaceFunctionCode(a, b);
}

function LiveEditFunctionSetScript(a, b) {
  return %LiveEditFunctionSetScript(a, b);
}

function LiveEditReplaceRefToNestedFunction(a, b, c) {
  return %LiveEditReplaceRefToNestedFunction(a, b, c);
}

function LiveEditPatchFunctionPositions(a, b) {
  return %LiveEditPatchFunctionPositions(a, b);
}

function LiveEditCheckAndDropActivations(a, b) {
  return %LiveEditCheckAndDropActivations(a, b);
}

function LiveEditCompareStrings(a, b) {
  return %LiveEditCompareStrings(a, b);
}

function LiveEditRestartFrame(a, b) {
  return %LiveEditRestartFrame(a, b);
}

function MathAcos(a) {
  return %MathAcos(a);
}

function MathAsin(a) {
  return %MathAsin(a);
}

function MathAtan(a) {
  return %MathAtan(a);
}

function MathLogRT(a) {
  return %MathLogRT(a);
}

function DoubleHi(a) {
  return %DoubleHi(a);
}

function DoubleLo(a) {
  return %DoubleLo(a);
}

function ConstructDouble(a, b) {
  return %ConstructDouble(a, b);
}

function RemPiO2(a, b) {
  return %RemPiO2(a, b);
}

function MathAtan2(a, b) {
  return %MathAtan2(a, b);
}

function MathExpRT(a) {
  return %MathExpRT(a);
}

function MathClz32(a) {
  return %MathClz32(a);
}

function MathFloor(a) {
  return %MathFloor(a);
}

function MathPowSlow(a, b) {
  return %MathPowSlow(a, b);
}

function MathPowRT(a, b) {
  return %MathPowRT(a, b);
}

function RoundNumber(a) {
  return %RoundNumber(a);
}

function MathSqrt(a) {
  return %MathSqrt(a);
}

function MathFround(a) {
  return %MathFround(a);
}

function MathPow(a, b) {
  return %MathPow(a, b);
}

function IsMinusZero(a) {
  return %IsMinusZero(a);
}

function NumberToRadixString(a, b) {
  return %NumberToRadixString(a, b);
}

function NumberToFixed(a, b) {
  return %NumberToFixed(a, b);
}

function NumberToExponential(a, b) {
  return %NumberToExponential(a, b);
}

function NumberToPrecision(a, b) {
  return %NumberToPrecision(a, b);
}

function IsValidSmi(a) {
  return %IsValidSmi(a);
}

function StringToNumber(a) {
  return %StringToNumber(a);
}

function StringParseInt(a, b) {
  return %StringParseInt(a, b);
}

function StringParseFloat(a) {
  return %StringParseFloat(a);
}

function NumberToStringRT(a) {
  return %NumberToStringRT(a);
}

function NumberToStringSkipCache(a) {
  return %NumberToStringSkipCache(a);
}

function NumberToInteger(a) {
  return %NumberToInteger(a);
}

function NumberToIntegerMapMinusZero(a) {
  return %NumberToIntegerMapMinusZero(a);
}

function NumberToJSUint32(a) {
  return %NumberToJSUint32(a);
}

function NumberToJSInt32(a) {
  return %NumberToJSInt32(a);
}

function NumberToSmi(a) {
  return %NumberToSmi(a);
}

function NumberAdd(a, b) {
  return %NumberAdd(a, b);
}

function NumberSub(a, b) {
  return %NumberSub(a, b);
}

function NumberMul(a, b) {
  return %NumberMul(a, b);
}

function NumberUnaryMinus(a) {
  return %NumberUnaryMinus(a);
}

function NumberDiv(a, b) {
  return %NumberDiv(a, b);
}

function NumberMod(a, b) {
  return %NumberMod(a, b);
}

function NumberImul(a, b) {
  return %NumberImul(a, b);
}

function NumberOr(a, b) {
  return %NumberOr(a, b);
}

function NumberAnd(a, b) {
  return %NumberAnd(a, b);
}

function NumberXor(a, b) {
  return %NumberXor(a, b);
}

function NumberShl(a, b) {
  return %NumberShl(a, b);
}

function NumberShr(a, b) {
  return %NumberShr(a, b);
}

function NumberSar(a, b) {
  return %NumberSar(a, b);
}

function NumberEquals(a, b) {
  return %NumberEquals(a, b);
}

function NumberCompare(a, b, c) {
  return %NumberCompare(a, b, c);
}

function SmiLexicographicCompare(a, b) {
  return %SmiLexicographicCompare(a, b);
}

function MaxSmi() {
  return %MaxSmi();
}

function NumberToString(a) {
  return %NumberToString(a);
}

function IsSmi(a) {
  return %IsSmi(a);
}

function IsNonNegativeSmi(a) {
  return %IsNonNegativeSmi(a);
}

function GetRootNaN() {
  return %GetRootNaN();
}

function GetPrototype(a) {
  return %GetPrototype(a);
}

function InternalSetPrototype(a, b) {
  return %InternalSetPrototype(a, b);
}

function SetPrototype(a, b) {
  return %SetPrototype(a, b);
}

function IsInPrototypeChain(a, b) {
  return %IsInPrototypeChain(a, b);
}

function GetOwnProperty(a, b) {
  return %GetOwnProperty(a, b);
}

function PreventExtensions(a) {
  return %PreventExtensions(a);
}

function IsExtensible(a) {
  return %IsExtensible(a);
}

function OptimizeObjectForAddingMultipleProperties(a, b) {
  return %OptimizeObjectForAddingMultipleProperties(a, b);
}

function ObjectFreeze(a) {
  return %ObjectFreeze(a);
}

function ObjectSeal(a) {
  return %ObjectSeal(a);
}

function GetProperty(a, b) {
  return %GetProperty(a, b);
}

function GetPropertyStrong(a, b) {
  return %GetPropertyStrong(a, b);
}

function KeyedGetProperty(a, b) {
  return %KeyedGetProperty(a, b);
}

function KeyedGetPropertyStrong(a, b) {
  return %KeyedGetPropertyStrong(a, b);
}

function AddNamedProperty(a, b, c, d) {
  return %AddNamedProperty(a, b, c, d);
}

function SetProperty(a, b, c, d) {
  return %SetProperty(a, b, c, d);
}

function AddElement(a, b, c) {
  return %AddElement(a, b, c);
}

function AppendElement(a, b) {
  return %AppendElement(a, b);
}

function DeleteProperty(a, b, c) {
  return %DeleteProperty(a, b, c);
}

function HasOwnProperty(a, b) {
  return %HasOwnProperty(a, b);
}

function HasProperty(a, b) {
  return %HasProperty(a, b);
}

function HasElement(a, b) {
  return %HasElement(a, b);
}

function IsPropertyEnumerable(a, b) {
  return %IsPropertyEnumerable(a, b);
}

function GetPropertyNames(a) {
  return %GetPropertyNames(a);
}

function GetPropertyNamesFast(a) {
  return %GetPropertyNamesFast(a);
}

function GetOwnPropertyNames(a, b) {
  return %GetOwnPropertyNames(a, b);
}

function GetOwnElementNames(a) {
  return %GetOwnElementNames(a);
}

function GetInterceptorInfo(a) {
  return %GetInterceptorInfo(a);
}

function GetNamedInterceptorPropertyNames(a) {
  return %GetNamedInterceptorPropertyNames(a);
}

function GetIndexedInterceptorElementNames(a) {
  return %GetIndexedInterceptorElementNames(a);
}

function OwnKeys(a) {
  return %OwnKeys(a);
}

function ToFastProperties(a) {
  return %ToFastProperties(a);
}

function ToBool(a) {
  return %ToBool(a);
}

function NewStringWrapper(a) {
  return %NewStringWrapper(a);
}

function AllocateHeapNumber() {
  return %AllocateHeapNumber();
}

function NewObject(a, b) {
  return %NewObject(a, b);
}

function NewObjectWithAllocationSite(a, b, c) {
  return %NewObjectWithAllocationSite(a, b, c);
}

function FinalizeInstanceSize(a) {
  return %FinalizeInstanceSize(a);
}

function GlobalProxy(a) {
  return %GlobalProxy(a);
}

function LookupAccessor(a, b, c) {
  return %LookupAccessor(a, b, c);
}

function LoadMutableDouble(a, b) {
  return %LoadMutableDouble(a, b);
}

function TryMigrateInstance(a) {
  return %TryMigrateInstance(a);
}

function IsJSGlobalProxy(a) {
  return %IsJSGlobalProxy(a);
}

function DefineAccessorPropertyUnchecked(a, b, c, d, e) {
  return %DefineAccessorPropertyUnchecked(a, b, c, d, e);
}

function DefineDataPropertyUnchecked(a, b, c, d) {
  return %DefineDataPropertyUnchecked(a, b, c, d);
}

function GetDataProperty(a, b) {
  return %GetDataProperty(a, b);
}

function HasFastPackedElements(a) {
  return %HasFastPackedElements(a);
}

function ValueOf(a) {
  return %ValueOf(a);
}

function SetValueOf(a, b) {
  return %SetValueOf(a, b);
}

function JSValueGetValue(a) {
  return %JSValueGetValue(a);
}

function HeapObjectGetMap(a) {
  return %HeapObjectGetMap(a);
}

function MapGetInstanceType(a) {
  return %MapGetInstanceType(a);
}

function ObjectEquals(a, b) {
  return %ObjectEquals(a, b);
}

function IsObject(a) {
  return %IsObject(a);
}

function IsUndetectableObject(a) {
  return %IsUndetectableObject(a);
}

function IsSpecObject(a) {
  return %IsSpecObject(a);
}

function IsStrong(a) {
  return %IsStrong(a);
}

function ClassOf(a) {
  return %ClassOf(a);
}

function DefineGetterPropertyUnchecked(a, b, c, d) {
  return %DefineGetterPropertyUnchecked(a, b, c, d);
}

function DefineSetterPropertyUnchecked(a, b, c, d) {
  return %DefineSetterPropertyUnchecked(a, b, c, d);
}

function IsObserved(a) {
  return %IsObserved(a);
}

function SetIsObserved(a) {
  return %SetIsObserved(a);
}

function EnqueueMicrotask(a) {
  return %EnqueueMicrotask(a);
}

function RunMicrotasks() {
  return %RunMicrotasks();
}

function DeliverObservationChangeRecords(a, b) {
  return %DeliverObservationChangeRecords(a, b);
}

function GetObservationState() {
  return %GetObservationState();
}

function ObserverObjectAndRecordHaveSameOrigin(a, b, c) {
  return %ObserverObjectAndRecordHaveSameOrigin(a, b, c);
}

function ObjectWasCreatedInCurrentOrigin(a) {
  return %ObjectWasCreatedInCurrentOrigin(a);
}

function GetObjectContextObjectObserve(a) {
  return %GetObjectContextObjectObserve(a);
}

function GetObjectContextObjectGetNotifier(a) {
  return %GetObjectContextObjectGetNotifier(a);
}

function GetObjectContextNotifierPerformChange(a) {
  return %GetObjectContextNotifierPerformChange(a);
}

function CreateJSProxy(a, b) {
  return %CreateJSProxy(a, b);
}

function CreateJSFunctionProxy(a, b, c, d) {
  return %CreateJSFunctionProxy(a, b, c, d);
}

function IsJSProxy(a) {
  return %IsJSProxy(a);
}

function IsJSFunctionProxy(a) {
  return %IsJSFunctionProxy(a);
}

function GetHandler(a) {
  return %GetHandler(a);
}

function GetCallTrap(a) {
  return %GetCallTrap(a);
}

function GetConstructTrap(a) {
  return %GetConstructTrap(a);
}

function Fix(a) {
  return %Fix(a);
}

function StringReplaceGlobalRegExpWithString(a, b, c, d) {
  return %StringReplaceGlobalRegExpWithString(a, b, c, d);
}

function StringSplit(a, b, c) {
  return %StringSplit(a, b, c);
}

function RegExpExec(a, b, c, d) {
  return %RegExpExec(a, b, c, d);
}

function RegExpConstructResultRT(a, b, c) {
  return %RegExpConstructResultRT(a, b, c);
}

function RegExpConstructResult(a, b, c) {
  return %RegExpConstructResult(a, b, c);
}

function RegExpInitializeAndCompile(a, b, c) {
  return %RegExpInitializeAndCompile(a, b, c);
}

function MaterializeRegExpLiteral(a, b, c, d) {
  return %MaterializeRegExpLiteral(a, b, c, d);
}

function RegExpExecMultiple(a, b, c, d) {
  return %RegExpExecMultiple(a, b, c, d);
}

function RegExpExecReThrow(a, b, c, d) {
  return %RegExpExecReThrow(a, b, c, d);
}

function IsRegExp(a) {
  return %IsRegExp(a);
}

function ThrowConstAssignError() {
  return %ThrowConstAssignError();
}

function DeclareGlobals(a, b, c) {
  return %DeclareGlobals(a, b, c);
}

function InitializeVarGlobal(a, b, c) {
  return %InitializeVarGlobal(a, b, c);
}

function InitializeConstGlobal(a, b) {
  return %InitializeConstGlobal(a, b);
}

function DeclareLookupSlot(a, b, c, d) {
  return %DeclareLookupSlot(a, b, c, d);
}

function InitializeLegacyConstLookupSlot(a, b, c) {
  return %InitializeLegacyConstLookupSlot(a, b, c);
}

function NewArguments(a) {
  return %NewArguments(a);
}

function NewSloppyArguments(a, b, c) {
  return %NewSloppyArguments(a, b, c);
}

function NewStrictArguments(a, b, c) {
  return %NewStrictArguments(a, b, c);
}

function NewRestParam(a, b, c, d) {
  return %NewRestParam(a, b, c, d);
}

function NewRestParamSlow(a, b) {
  return %NewRestParamSlow(a, b);
}

function NewClosureFromStubFailure(a) {
  return %NewClosureFromStubFailure(a);
}

function NewClosure(a, b, c) {
  return %NewClosure(a, b, c);
}

function NewScriptContext(a, b) {
  return %NewScriptContext(a, b);
}

function NewFunctionContext(a) {
  return %NewFunctionContext(a);
}

function PushWithContext(a, b) {
  return %PushWithContext(a, b);
}

function PushCatchContext(a, b, c) {
  return %PushCatchContext(a, b, c);
}

function PushBlockContext(a, b) {
  return %PushBlockContext(a, b);
}

function IsJSModule(a) {
  return %IsJSModule(a);
}

function PushModuleContext(a, b) {
  return %PushModuleContext(a, b);
}

function DeclareModules(a) {
  return %DeclareModules(a);
}

function DeleteLookupSlot(a, b) {
  return %DeleteLookupSlot(a, b);
}

function StoreLookupSlot(a, b, c, d) {
  return %StoreLookupSlot(a, b, c, d);
}

function GetArgumentsProperty(a) {
  return %GetArgumentsProperty(a);
}

function ArgumentsLength() {
  return %ArgumentsLength();
}

function Arguments(a) {
  return %Arguments(a);
}

function StringReplaceOneCharWithString(a, b, c) {
  return %StringReplaceOneCharWithString(a, b, c);
}

function StringIndexOf(a, b, c) {
  return %StringIndexOf(a, b, c);
}

function StringLastIndexOf(a, b, c) {
  return %StringLastIndexOf(a, b, c);
}

function StringLocaleCompare(a, b) {
  return %StringLocaleCompare(a, b);
}

function SubStringRT(a, b, c) {
  return %SubStringRT(a, b, c);
}

function SubString(a, b, c) {
  return %SubString(a, b, c);
}

function StringAddRT(a, b) {
  return %StringAddRT(a, b);
}

function StringAdd(a, b) {
  return %StringAdd(a, b);
}

function InternalizeString(a) {
  return %InternalizeString(a);
}

function StringMatch(a, b, c) {
  return %StringMatch(a, b, c);
}

function StringCharCodeAtRT(a, b) {
  return %StringCharCodeAtRT(a, b);
}

function CharFromCode(a) {
  return %CharFromCode(a);
}

function StringCompareRT(a, b) {
  return %StringCompareRT(a, b);
}

function StringCompare(a, b) {
  return %StringCompare(a, b);
}

function StringBuilderConcat(a, b, c) {
  return %StringBuilderConcat(a, b, c);
}

function StringBuilderJoin(a, b, c) {
  return %StringBuilderJoin(a, b, c);
}

function SparseJoinWithSeparator(a, b, c) {
  return %SparseJoinWithSeparator(a, b, c);
}

function StringToArray(a, b) {
  return %StringToArray(a, b);
}

function StringToLowerCase(a) {
  return %StringToLowerCase(a);
}

function StringToUpperCase(a) {
  return %StringToUpperCase(a);
}

function StringTrim(a, b, c) {
  return %StringTrim(a, b, c);
}

function TruncateString(a, b) {
  return %TruncateString(a, b);
}

function NewString(a, b) {
  return %NewString(a, b);
}

function NewConsString(a, b, c, d) {
  return %NewConsString(a, b, c, d);
}

function StringEquals(a, b) {
  return %StringEquals(a, b);
}

function FlattenString(a) {
  return %FlattenString(a);
}

function StringCharFromCode(a) {
  return %StringCharFromCode(a);
}

function StringCharAt(a, b) {
  return %StringCharAt(a, b);
}

function OneByteSeqStringGetChar(a, b) {
  return %OneByteSeqStringGetChar(a, b);
}

function OneByteSeqStringSetChar(a, b, c) {
  return %OneByteSeqStringSetChar(a, b, c);
}

function TwoByteSeqStringGetChar(a, b) {
  return %TwoByteSeqStringGetChar(a, b);
}

function TwoByteSeqStringSetChar(a, b, c) {
  return %TwoByteSeqStringSetChar(a, b, c);
}

function StringCharCodeAt(a, b) {
  return %StringCharCodeAt(a, b);
}

function IsStringWrapperSafeForDefaultValueOf(a) {
  return %IsStringWrapperSafeForDefaultValueOf(a);
}

function StringGetLength(a) {
  return %StringGetLength(a);
}

function CreateSymbol(a) {
  return %CreateSymbol(a);
}

function CreatePrivateSymbol(a) {
  return %CreatePrivateSymbol(a);
}

function CreateGlobalPrivateSymbol(a) {
  return %CreateGlobalPrivateSymbol(a);
}

function NewSymbolWrapper(a) {
  return %NewSymbolWrapper(a);
}

function SymbolDescription(a) {
  return %SymbolDescription(a);
}

function SymbolRegistry() {
  return %SymbolRegistry();
}

function SymbolIsPrivate(a) {
  return %SymbolIsPrivate(a);
}

function DeoptimizeFunction(a) {
  return %DeoptimizeFunction(a);
}

function DeoptimizeNow() {
  return %DeoptimizeNow();
}

function RunningInSimulator() {
  return %RunningInSimulator();
}

function IsConcurrentRecompilationSupported() {
  return %IsConcurrentRecompilationSupported();
}

function OptimizeFunctionOnNextCall(a) {
  return %OptimizeFunctionOnNextCall(a);
}

function OptimizeOsr(a) {
  return %OptimizeOsr(a);
}

function NeverOptimizeFunction(a) {
  return %NeverOptimizeFunction(a);
}

function GetOptimizationStatus(a) {
  return %GetOptimizationStatus(a);
}

function UnblockConcurrentRecompilation() {
  return %UnblockConcurrentRecompilation();
}

function GetOptimizationCount(a) {
  return %GetOptimizationCount(a);
}

function GetUndetectable() {
  return %GetUndetectable();
}

function ClearFunctionTypeFeedback(a) {
  return %ClearFunctionTypeFeedback(a);
}

function NotifyContextDisposed() {
  return %NotifyContextDisposed();
}

function SetAllocationTimeout(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  return %SetAllocationTimeout(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
}

function DebugPrint(a) {
  return %DebugPrint(a);
}

function DebugTrace() {
  return %DebugTrace();
}

function GlobalPrint(a) {
  return %GlobalPrint(a);
}

function SystemBreak() {
  return %SystemBreak();
}

function SetFlags(a) {
  return %SetFlags(a);
}

function Abort(a) {
  return %Abort(a);
}

function AbortJS(a) {
  return %AbortJS(a);
}

function NativeScriptsCount() {
  return %NativeScriptsCount();
}

function GetV8Version() {
  return %GetV8Version();
}

function DisassembleFunction(a) {
  return %DisassembleFunction(a);
}

function TraceEnter() {
  return %TraceEnter();
}

function TraceExit(a) {
  return %TraceExit(a);
}

function HaveSameMap(a, b) {
  return %HaveSameMap(a, b);
}

function HasFastSmiElements(a) {
  return %HasFastSmiElements(a);
}

function HasFastObjectElements(a) {
  return %HasFastObjectElements(a);
}

function HasFastSmiOrObjectElements(a) {
  return %HasFastSmiOrObjectElements(a);
}

function HasFastDoubleElements(a) {
  return %HasFastDoubleElements(a);
}

function HasFastHoleyElements(a) {
  return %HasFastHoleyElements(a);
}

function HasDictionaryElements(a) {
  return %HasDictionaryElements(a);
}

function HasSloppyArgumentsElements(a) {
  return %HasSloppyArgumentsElements(a);
}

function HasExternalArrayElements(a) {
  return %HasExternalArrayElements(a);
}

function HasFastProperties(a) {
  return %HasFastProperties(a);
}

function HasExternalUint8Elements(a) {
  return %HasExternalUint8Elements(a);
}

function HasExternalInt8Elements(a) {
  return %HasExternalInt8Elements(a);
}

function HasExternalUint16Elements(a) {
  return %HasExternalUint16Elements(a);
}

function HasExternalInt16Elements(a) {
  return %HasExternalInt16Elements(a);
}

function HasExternalUint32Elements(a) {
  return %HasExternalUint32Elements(a);
}

function HasExternalInt32Elements(a) {
  return %HasExternalInt32Elements(a);
}

function HasExternalFloat32Elements(a) {
  return %HasExternalFloat32Elements(a);
}

function HasExternalFloat64Elements(a) {
  return %HasExternalFloat64Elements(a);
}

function HasExternalUint8ClampedElements(a) {
  return %HasExternalUint8ClampedElements(a);
}

function HasFixedUint8Elements(a) {
  return %HasFixedUint8Elements(a);
}

function HasFixedInt8Elements(a) {
  return %HasFixedInt8Elements(a);
}

function HasFixedUint16Elements(a) {
  return %HasFixedUint16Elements(a);
}

function HasFixedInt16Elements(a) {
  return %HasFixedInt16Elements(a);
}

function HasFixedUint32Elements(a) {
  return %HasFixedUint32Elements(a);
}

function HasFixedInt32Elements(a) {
  return %HasFixedInt32Elements(a);
}

function HasFixedFloat32Elements(a) {
  return %HasFixedFloat32Elements(a);
}

function HasFixedFloat64Elements(a) {
  return %HasFixedFloat64Elements(a);
}

function HasFixedUint8ClampedElements(a) {
  return %HasFixedUint8ClampedElements(a);
}

function ArrayBufferInitialize(a, b, c) {
  return %ArrayBufferInitialize(a, b, c);
}

function ArrayBufferGetByteLength(a) {
  return %ArrayBufferGetByteLength(a);
}

function ArrayBufferSliceImpl(a, b, c) {
  return %ArrayBufferSliceImpl(a, b, c);
}

function ArrayBufferIsView(a) {
  return %ArrayBufferIsView(a);
}

function ArrayBufferNeuter(a) {
  return %ArrayBufferNeuter(a);
}

function TypedArrayInitialize(a, b, c, d, e, f) {
  return %TypedArrayInitialize(a, b, c, d, e, f);
}

function TypedArrayInitializeFromArrayLike(a, b, c, d) {
  return %TypedArrayInitializeFromArrayLike(a, b, c, d);
}

function ArrayBufferViewGetByteLength(a) {
  return %ArrayBufferViewGetByteLength(a);
}

function ArrayBufferViewGetByteOffset(a) {
  return %ArrayBufferViewGetByteOffset(a);
}

function TypedArrayGetLength(a) {
  return %TypedArrayGetLength(a);
}

function DataViewGetBuffer(a) {
  return %DataViewGetBuffer(a);
}

function TypedArrayGetBuffer(a) {
  return %TypedArrayGetBuffer(a);
}

function TypedArraySetFastCases(a, b, c) {
  return %TypedArraySetFastCases(a, b, c);
}

function TypedArrayMaxSizeInHeap() {
  return %TypedArrayMaxSizeInHeap();
}

function IsTypedArray(a) {
  return %IsTypedArray(a);
}

function IsSharedTypedArray(a) {
  return %IsSharedTypedArray(a);
}

function IsSharedIntegerTypedArray(a) {
  return %IsSharedIntegerTypedArray(a);
}

function DataViewInitialize(a, b, c, d) {
  return %DataViewInitialize(a, b, c, d);
}

function DataViewGetUint8(a, b, c) {
  return %DataViewGetUint8(a, b, c);
}

function DataViewGetInt8(a, b, c) {
  return %DataViewGetInt8(a, b, c);
}

function DataViewGetUint16(a, b, c) {
  return %DataViewGetUint16(a, b, c);
}

function DataViewGetInt16(a, b, c) {
  return %DataViewGetInt16(a, b, c);
}

function DataViewGetUint32(a, b, c) {
  return %DataViewGetUint32(a, b, c);
}

function DataViewGetInt32(a, b, c) {
  return %DataViewGetInt32(a, b, c);
}

function DataViewGetFloat32(a, b, c) {
  return %DataViewGetFloat32(a, b, c);
}

function DataViewGetFloat64(a, b, c) {
  return %DataViewGetFloat64(a, b, c);
}

function DataViewSetUint8(a, b, c, d) {
  return %DataViewSetUint8(a, b, c, d);
}

function DataViewSetInt8(a, b, c, d) {
  return %DataViewSetInt8(a, b, c, d);
}

function DataViewSetUint16(a, b, c, d) {
  return %DataViewSetUint16(a, b, c, d);
}

function DataViewSetInt16(a, b, c, d) {
  return %DataViewSetInt16(a, b, c, d);
}

function DataViewSetUint32(a, b, c, d) {
  return %DataViewSetUint32(a, b, c, d);
}

function DataViewSetInt32(a, b, c, d) {
  return %DataViewSetInt32(a, b, c, d);
}

function DataViewSetFloat32(a, b, c, d) {
  return %DataViewSetFloat32(a, b, c, d);
}

function DataViewSetFloat64(a, b, c, d) {
  return %DataViewSetFloat64(a, b, c, d);
}

function URIEscape(a) {
  return %URIEscape(a);
}

function URIUnescape(a) {
  return %URIUnescape(a);
}

function LoadLookupSlot(a, b) {
  return %LoadLookupSlot(a, b);
}

function LoadLookupSlotNoReferenceError(a, b) {
  return %LoadLookupSlotNoReferenceError(a, b);
}