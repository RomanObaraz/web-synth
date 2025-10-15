import { Oscillator } from "./components/oscillator";
import { Keyboard } from "./components/keyboard";
import { Oscilloscope } from "./components/oscilloscope";
import { LowPassFilter } from "./components/lowPassFilter";
import { Reverb } from "./components/reverb";
import { Toggleable } from "./components/toggleable";
import { Distortion } from "./components/distortion";
import { AmpEnvelope } from "./components/ampEnvelope";
import LFO from "./components/lfo";
import { SubOscillator } from "./components/oscillator/subOscillator";
import { useMIDIManager } from "./hooks/useMIDIManager";
import { InputController } from "./components/InputController";

// TODO: all knobs shouldn't work when module is disabled
// TODO: KnobFrequency doesn't go well with knob cc

function App() {
    useMIDIManager();

    return (
        <>
            <InputController />

            <div className="flex flex-col gap-10">
                <div className="self-center">
                    <Oscilloscope />
                </div>

                <div className="flex justify-center gap-10">
                    <div>
                        <Toggleable label="OSC-1">
                            <Oscillator id={0} moduleId="osc-0" />
                        </Toggleable>
                    </div>
                    <div>
                        <Toggleable label="OSC-2">
                            <Oscillator id={1} moduleId="osc-1" />
                        </Toggleable>
                    </div>
                    <div className="min-w-48">
                        <Toggleable label="Sub-OSC">
                            <SubOscillator id={0} moduleId="subOsc-0" />
                        </Toggleable>
                    </div>
                    <div>
                        <Toggleable label="Amp Envelope">
                            <AmpEnvelope moduleId="ampEnvelope" />
                        </Toggleable>
                    </div>
                </div>

                <div className="flex justify-center gap-10">
                    <div>
                        <Toggleable label="LPF">
                            <LowPassFilter moduleId="lpf" />
                        </Toggleable>
                    </div>
                    <div>
                        <Toggleable label="Reverb">
                            <Reverb moduleId="reverb" />
                        </Toggleable>
                    </div>
                    <div>
                        <Toggleable label="Distortion">
                            <Distortion moduleId="distortion" />
                        </Toggleable>
                    </div>
                    <div>
                        <Toggleable label="LFO">
                            <LFO moduleId="lfo" />
                        </Toggleable>
                    </div>
                </div>

                <Keyboard />
            </div>
        </>
    );
}

export default App;
