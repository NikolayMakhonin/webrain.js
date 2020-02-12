export enum OptimizationStatus {
	IsFunction = 1,
	NeverOptimize = 2,
	AlwaysOptimize = 4,
	MaybeDeopted = 8,
	Optimized = 16,
	TurboFanned = 32,
	Interpreted = 64,
	MarkedForOptimization = 128,
	MarkedForConcurrentOptimization = 256,
	OptimizingConcurrently = 512,
	IsExecuting = 1024,
	TopmostFrameIsTurboFanned = 2048,
	LiteMode = 4096,
	MarkedForDeoptimization = 8192,
}

export type TAnyFunc = (...args: any[]) => any
