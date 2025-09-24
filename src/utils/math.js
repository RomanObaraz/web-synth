export class NormalisableRange {
    constructor(min, max, center) {
        this.min = min;
        this.max = max;
        this.skew = Math.log(0.5) / Math.log((center - min) / (max - min));
    }

    mapTo01(x) {
        const proportion = clamp01((x - this.min) / (this.max - this.min));

        if (this.skew === 1) {
            return proportion;
        }

        return proportion ** this.skew;
    }

    mapFrom01(proportion) {
        proportion = clamp01(proportion);

        if (this.skew !== 1 && proportion > 0) {
            proportion = Math.exp(Math.log(proportion) / this.skew);
        }

        return this.min + (this.max - this.min) * proportion;
    }
}

export const clamp = (x, min, max) => {
    return Math.max(min, Math.min(max, x));
};

export const clamp01 = (x) => {
    return clamp(x, 0, 1);
};

export const mapTo01Linear = (x, min, max) => {
    return (x - min) / (max - min);
};

export const mapFrom01Linear = (x, min, max) => {
    return (max - min) * x + min;
};
