import { Oscillator } from "./components/oscillator";
import { Keyboard } from "./components/keyboard";
import { Oscilloscope } from "./components/oscilloscope";
import { LowPassFilter } from "./components/lowPassFilter";
import { Reverb } from "./components/reverb";
import { Toggleable } from "./components/toggleable";
import { Distortion } from "./components/distortion";
import { AmpEnvelope } from "./components/ampEnvelope";
import { LFO } from "./components/lfo";
import { SubOscillator } from "./components/oscillator/subOscillator";
import { useMIDIManager } from "./hooks/useMIDIManager";
import { InputController } from "./components/InputController";
import { Bitcrusher } from "./components/bitcrusher";
import { PresetSelect } from "./components/presetSelect";

function App() {
    useMIDIManager();

    return (
        <>
            <InputController />

            <div className="flex justify-end mb-2">
                <PresetSelect />
            </div>

            <div className="grid grid-cols-4 grid-flow-row gap-2">
                <div>
                    <Toggleable>
                        <Oscillator id={0} moduleId="osc-0" label="OSC-1" />
                    </Toggleable>
                </div>
                <div>
                    <Toggleable>
                        <Oscillator id={1} moduleId="osc-1" label="OSC-2" />
                    </Toggleable>
                </div>
                <div>
                    <Toggleable>
                        <SubOscillator id={0} moduleId="subOsc-0" label="Sub-OSC" />
                    </Toggleable>
                </div>
                <div>
                    <Toggleable>
                        <LFO moduleId="lfo" label="LFO" />
                    </Toggleable>
                </div>
                <div>
                    <Toggleable>
                        <AmpEnvelope moduleId="ampEnvelope" label="Amp Envelope" />
                    </Toggleable>
                </div>
                <div className="col-span-2">
                    <Oscilloscope />
                </div>
                <div className="row-span-2">
                    <Toggleable>
                        <LowPassFilter moduleId="lpf" label="LPF" />
                    </Toggleable>
                </div>
                <div>
                    <Toggleable>
                        <Distortion moduleId="distortion" label="Distortion" />
                    </Toggleable>
                </div>
                <div>
                    <Toggleable>
                        <Bitcrusher moduleId="bitcrusher" label="Bitcrusher" />
                    </Toggleable>
                </div>
                <div>
                    <Toggleable>
                        <Reverb moduleId="reverb" label="Reverb" />
                    </Toggleable>
                </div>
            </div>

            <div className="mt-2">
                <Keyboard />
            </div>
        </>
    );
}

export default App;
