export const setSmoothLevel = (gain, time, level) => {
    gain.cancelScheduledValues(time);
    gain.setValueAtTime(gain.value, time);
    gain.linearRampToValueAtTime(level, time + 0.03);
};
