export const getKeyFrequency = (key) =>
    noteFrequency(keyMidiMap.find((keys) => keys.key === key)?.midi);

// export const keyToMidi = {
//     // (C3..B3)
//     z: 48,
//     s: 49,
//     x: 50,
//     d: 51,
//     c: 52,
//     v: 53,
//     g: 54,
//     b: 55,
//     h: 56,
//     n: 57,
//     j: 58,
//     m: 59,
//     // (C4..B4)
//     q: 60,
//     2: 61,
//     w: 62,
//     3: 63,
//     e: 64,
//     r: 65,
//     5: 66,
//     t: 67,
//     6: 68,
//     y: 69,
//     7: 70,
//     u: 71,
// };

export const keyMidiMap = [
    // (C3..B3)
    {
        key: "z",
        note: "C",
        midi: 48,
    },
    {
        key: "s",
        note: "C#",
        midi: 49,
    },
    {
        key: "x",
        note: "D",
        midi: 50,
    },
    {
        key: "d",
        note: "D#",
        midi: 51,
    },
    {
        key: "c",
        note: "E",
        midi: 52,
    },
    {
        key: "v",
        note: "F",
        midi: 53,
    },
    {
        key: "g",
        note: "F#",
        midi: 54,
    },
    {
        key: "b",
        note: "G",
        midi: 55,
    },
    {
        key: "h",
        note: "G#",
        midi: 56,
    },
    {
        key: "n",
        note: "A",
        midi: 57,
    },
    {
        key: "j",
        note: "A#",
        midi: 58,
    },
    {
        key: "m",
        note: "B",
        midi: 59,
    },
    // (C4..B4)
    {
        key: "q",
        note: "C",
        midi: 60,
    },
    {
        key: "2",
        note: "C#",
        midi: 61,
    },
    {
        key: "w",
        note: "D",
        midi: 62,
    },
    {
        key: "3",
        note: "D#",
        midi: 63,
    },
    {
        key: "e",
        note: "E",
        midi: 64,
    },
    {
        key: "r",
        note: "F",
        midi: 65,
    },
    {
        key: "5",
        note: "F#",
        midi: 66,
    },
    {
        key: "t",
        note: "G",
        midi: 67,
    },
    {
        key: "6",
        note: "G#",
        midi: 68,
    },
    {
        key: "y",
        note: "A",
        midi: 69,
    },
    {
        key: "7",
        note: "A#",
        midi: 70,
    },
    {
        key: "u",
        note: "B",
        midi: 71,
    },
];

const noteFrequency = (midi) => 440 * Math.pow(2, (midi - 69) / 12);
