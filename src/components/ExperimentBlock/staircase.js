class Staircase {
  constructor(settings) {
    if (typeof settings.firstVal==="undefined") {
      throw new Error("No firstVal specified for staircase")
    }
    if (typeof settings.down==="undefined") {
      throw new Error("No down value specified for staircase")
    }
    if (!Array.isArray(settings.stepSizes)) {
      throw new Error("No array stepSizes specified for staircase.");
    }

    this.values = [settings.firstVal];
    this.maxValue = settings.maxValue || 10000;
  }

  getValue() {
    const currentVal = this.values[this.values.length - 1];
    return Math.min(currentVal, this.maxValue);
  }
}

export {
  Staircase
}