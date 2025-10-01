export const getKeyMIDI = (key) => keyMidiMap.find((keys) => keys.key === key)?.midi;

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
