import { Oscillator } from "./components/oscillator";
import { Keyboard } from "./components/keyboard";
import { Oscilloscope } from "./components/oscilloscope";
import { LowPassFilter } from "./components/lowPassFilter";
import { Effects } from "./components/effects";
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
                    <Oscillator id={0} />
                    <Oscillator id={1} />
                </div>

                <div className="self-center w-120">
                    <Toggleable label="LPF">
                        <LowPassFilter />
                    </Toggleable>
                </div>

                <div className="self-center">
                    <Effects />
                </div>

                <Keyboard />
            </div>
        </SynthProvider>
    );
}

export default App;
