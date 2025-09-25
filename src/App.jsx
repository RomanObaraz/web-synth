import { Oscillator } from "./components/oscillator";
import { Keyboard } from "./components/keyboard";
import { Oscilloscope } from "./components/oscilloscope";
import { LowPassFilter } from "./components/lowPassFilter";
import { Reverb } from "./components/reverb";
import { Toggleable } from "./components/toggleable";
import { SynthProvider } from "./synthProvider/synthProvider";
import { Distortion } from "./components/distortion";
import { AmpEnvelope } from "./components/ampEnvelope";
import LFO from "./components/lfo";
import { SubOscillator } from "./components/oscillator/subOscillator";

function App() {
    return (
        <SynthProvider>
            <div className="flex flex-col gap-10">
                <div className="self-center">
                    <Oscilloscope />
                </div>

                <div className="flex justify-center gap-10">
                    <div>
                        <Toggleable moduleId="osc-0" label="OSC-1">
                            <Oscillator id={0} />
                        </Toggleable>
                    </div>
                    <div>
                        <Toggleable moduleId="osc-1" label="OSC-2">
                            <Oscillator id={1} />
                        </Toggleable>
                    </div>
                    <div className="min-w-48">
                        <Toggleable moduleId="subOscillator" label="Sub-OSC">
                            <SubOscillator id={0} />
                        </Toggleable>
                    </div>
                    <div>
                        <Toggleable moduleId="ampEnvelope" label="Amp Envelope">
                            <AmpEnvelope />
                        </Toggleable>
                    </div>
                </div>

                <div className="flex justify-center gap-10">
                    <div>
                        <Toggleable moduleId="lpf" label="LPF">
                            <LowPassFilter />
                        </Toggleable>
                    </div>
                    <div>
                        <Toggleable moduleId="reverb" label="Reverb">
                            <Reverb />
                        </Toggleable>
                    </div>
                    <div>
                        <Toggleable moduleId="distortion" label="Distortion">
                            <Distortion />
                        </Toggleable>
                    </div>
                    <div>
                        <Toggleable moduleId="lfo" label="LFO">
                            <LFO />
                        </Toggleable>
                    </div>
                </div>

                <Keyboard />
            </div>
        </SynthProvider>
    );
}

export default App;
