export const setSmoothLevel = (gain, time, level) => {
    gain.cancelScheduledValues(time);
    gain.setValueAtTime(gain.value, time);
    gain.linearRampToValueAtTime(level, time + 0.03);
};

export const getSubOscFrequency = (parentFrequency, parentDetune) => {
    return (parentFrequency * Math.pow(2, parentDetune / 1200)) / 2;
};
