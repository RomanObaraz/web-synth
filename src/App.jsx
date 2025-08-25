import { Oscillator } from "./components/oscillator";
import { Keyboard } from "./components/keyboard";
import { Oscilloscope } from "./components/oscilloscope";
import { LowPassFilter } from "./components/lowPassFilter";
import { Reverb } from "./components/reverb";
import { Toggleable } from "./components/toggleable";
import { SynthProvider } from "./synthProvider/synthProvider";

function App() {
    return (
        <SynthProvider>
            <div className="flex flex-col gap-10">
                <div className="self-center">
                    <Oscilloscope />
                </div>

                <div className="flex justify-center gap-10">
                    <div className="w-80">
                        <Toggleable moduleId="osc-0" label="OSC-1">
                            <Oscillator id={0} />
                        </Toggleable>
                    </div>
                    <div className="w-80">
                        <Toggleable moduleId="osc-1" label="OSC-2">
                            <Oscillator id={1} />
                        </Toggleable>
                    </div>
                </div>

                <div className="flex justify-center gap-10">
                    <div className="self-center w-120">
                        <Toggleable moduleId="lpf" label="LPF">
                            <LowPassFilter />
                        </Toggleable>
                    </div>

                    <div className="self-center w-120">
                        <Toggleable moduleId="reverb" label="Reverb">
                            <Reverb />
                        </Toggleable>
                    </div>
                </div>

                <Keyboard />
            </div>
        </SynthProvider>
    );
}

export default App;
