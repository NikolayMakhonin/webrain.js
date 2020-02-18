rem https://nodejs.org/en/download/releases/
rem https://github.com/mraleph/irhydra
rem https://mrale.ph/irhydra/2.bak/
rem irhydra not supported TurboFan (since v8 5.6)
rem Chrome 37.0.2062 == v8 3.27.34 == Node 0.11.14
rem Map/Set support since NodeJS 4.9.1
rem v8 should be in [3.24.39, 5.5.372.43]
rem node version should be in [0.11.12, 7.10.1]

set file=tmp\libs\dependent-func.js
del /F /Q %file%
del /F /Q code.asm
del /F /Q hydrogen-*.cfg
del /F /Q isolate-*.log

node env/libs/dependent-func/build.js

set GYP_DEFINES="v8_enable_disassembler=1"
"e:\TEMP\node_4_9_1\node" --trace-hydrogen --trace-phase=Z --trace-deopt --code-comments --hydrogen-track-positions --redirect-code-traces --redirect-code-traces-to=code.asm --print-opt-code --allow-natives-syntax --prof "%file%"
