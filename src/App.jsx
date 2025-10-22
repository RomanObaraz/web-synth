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
                    <Toggleable label="OSC-1">
                        <Oscillator id={0} moduleId="osc-0" />
                    </Toggleable>
                </div>
                <div>
                    <Toggleable label="OSC-2">
                        <Oscillator id={1} moduleId="osc-1" />
                    </Toggleable>
                </div>
                <div>
                    <Toggleable label="Sub-OSC">
                        <SubOscillator id={0} moduleId="subOsc-0" />
                    </Toggleable>
                </div>
                <div>
                    <Toggleable label="LFO">
                        <LFO moduleId="lfo" />
                    </Toggleable>
                </div>
                <div>
                    <Toggleable label="Amp Envelope">
                        <AmpEnvelope moduleId="ampEnvelope" />
                    </Toggleable>
                </div>
                <div className="col-span-2">
                    <Oscilloscope />
                </div>
                <div className="row-span-2">
                    <Toggleable label="LPF">
                        <LowPassFilter moduleId="lpf" />
                    </Toggleable>
                </div>
                <div>
                    <Toggleable label="Distortion">
                        <Distortion moduleId="distortion" />
                    </Toggleable>
                </div>
                <div>
                    <Toggleable label="Bitcrusher">
                        <Bitcrusher moduleId="bitcrusher" />
                    </Toggleable>
                </div>
                <div>
                    <Toggleable label="Reverb">
                        <Reverb moduleId="reverb" />
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
