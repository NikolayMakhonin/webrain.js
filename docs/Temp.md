* CallStateProvider
    * _func
    * _funcCall
    * _initCallState
    * getHash()
    * getCallStates(hash)
    * getCallState(callStates)
    * updateUsageStats(callState)
    * createCallStates(hash)
    * createCallState(callStates)
    * get(...args)
        * hash = getHash()
        * callStates = getCallStates(hash)
        * callState = getCallState(callStates)
        * updateUsageStats(callState)
    * getOrCreateState(...args)
        * ...get
        * callStates = createCallStates(hash)
        * callState = createCallState(callStates)
        * updateUsageStats(callState)
