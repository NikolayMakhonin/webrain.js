rem https://nodejs.org/en/download/releases/
rem https://github.com/mraleph/irhydra
rem https://mrale.ph/irhydra/2.bak/
rem v8 should be in [3.24.39, 5.8.283.41]
rem node version should be in [0.11.12, 8.2.1]

set file=tmp\libs\dependent-func.js
del %file%
npm run build:libs

del code.asm
del hydrogen-*.cfg
del isolate-*.log

set GYP_DEFINES="v8_enable_disassembler=1"
"e:\TEMP\node_8_2_1\node" --trace-hydrogen --trace-phase=Z --trace-deopt --code-comments --hydrogen-track-positions --redirect-code-traces --redirect-code-traces-to=code.asm --print-opt-code --prof "%file%"
