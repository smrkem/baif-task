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

    this.stepSizes = settings.stepSizes;
    this.values = [settings.firstVal];
    this.responses = []; // true for correct, false for miss
    this.maxValue = settings.maxValue || 2000;
    this.minValue = settings.minValue || 20;
    this.successiveGood = 0;
    this.successiveBad = 0;
    this.n_up = settings.up || 1;
    this.n_down = settings.down;
    this.currentStepSizeIndex = 0;
    this.reversal_indexes = [];
    this.currentDirection = 0; // 1 for increasing delta, -1 for decreasing delta
    this.verbosity = settings.verbosity || 0
}

  getValue() {
    const currentVal = this.values[this.values.length - 1];
    return Math.min(currentVal, this.maxValue);
  }

  addResponse(response) {
    this.responses.push(response);

    if (response) {
      this.successiveGood++;
      this.successiveBad = 0;
    }
    else {
      this.successiveGood = 0;
      this.successiveBad++;
    }

    this.detectReversal(response);
    this.values.push(this.getNextValue(response));
  }



  detectReversal(hit) {
    // if (!hit && this.successiveGood >= this.n_up) {
    //   this.currentDirection = 1;
    // }
    // if (!hit && this.successiveBad >= this.n_up) {
    //   this.successiveBad = 0;
      
    //   if (this.currentDirection === -1) {
    //     // Reversal!!
    //     this.incrementStepSizeIndex();
    //   }
      
    // }
    // else if (hit && this.successiveGood >= this.n_down) {
    //   this.successiveGood = 0;

    //   if (this.currentDirection === 1) {
    //     // Reversal!!
    //     this.incrementStepSizeIndex();
    //   }
    //   this.currentDirection = -1;
    // }

    // if (this.currentDirection === 0) {
    //   if (correctResponse && this.successiveGood >= this.n_down) {
    //     this.currentDirection = -1;  
    //   }
    //   // else if (!correctResponse && this.currentDirection >= this.n_up) {
    //   //   this.currentDirection = 1;
    //   // }
    // }
    // const lastReversalIndex = (this.reversal_indexes[this.reversal_indexes.length - 1] - 1) || 0;
    // const lastResponses = this.responses.slice(lastReversalIndex);

    // let consecutiveHits = 0;
    // let thenMiss = 0;

    // lastResponses.forEach(response => {
    //   if (response && consecutiveHits < this.n_down) {
    //     consecutiveHits++;
    //   }

    //   if ((consecutiveHits === this.n_down) && !response) {
    //     thenMiss = 1;
    //   }

    //   if ((thenMiss === 1) && response) {
    //     // Reversal!!!!!
    //     this.reversal_indexes.push(this.responses.length);
    //     this.incrementStepSizeIndex();

    //     if (this.verbosity > 0) {
    //       console.log('reversal!!!!! new dB ratio: ', this.stepSizes[this.currentStepSizeIndex]);
    //     }
    //   }
    // })
  }

  getNextValue(correctResponse) {
    // console.log('responses: ', this.responses);

    // this.detectReversal(correctResponse);

    if (!correctResponse && this.successiveBad >= this.n_up) {
      this.successiveBad = 0;
      
      this.currentDirection = 1;
      const newVal = Math.min(this._nextVal(), this.maxValue);
      if (this.verbosity > 0) {
          console.log("Decreasing stair difficulty. Setting new value to " + newVal + "ms.");
          console.log('=============================');
      }
      
      return newVal;
    }
    else if (correctResponse && this.successiveGood >= this.n_down) {
      this.successiveGood = 0;

      this.currentDirection = -1;
      const newVal = Math.max(this._nextVal(), this.minValue);
      if (this.verbosity > 0) {
        console.log("Increasing stair difficulty. Setting new value to " + newVal + "ms.");
        console.log('=============================');
      }

      return newVal;
    }
    else if (this.currentDirection === 0) {
      if (correctResponse && this.successiveGood >= this.n_down) {
        this.currentDirection = -1;  
      }
      else if (!correctResponse && this.currentDirection >= this.n_up) {
        this.currentDirection = 1;
      }
    }

    // console.log('=============================');
    return this.getValue();
  }

  _nextVal() {
    const incr = this.stepSizes[this.currentStepSizeIndex] * this.currentDirection;
    return this.getValue() + incr;
  }

  incrementStepSizeIndex() {
    this.reversal_indexes.push(this.responses.length);
    if (this.verbosity > 0) {
      console.log('reversal!!!!! new dB ratio: ', this.stepSizes[this.currentStepSizeIndex]);
    }

    if (this.currentStepSizeIndex < this.stepSizes.length - 1) { 
      this.currentStepSizeIndex++;
    }
  }
}





class dBStaircase {
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

    this.stepSizes = settings.stepSizes;
    this.values = [settings.firstVal];
    this.responses = []; // true for correct, false for miss
    this.maxValue = settings.maxValue || 2000;
    this.successiveGood = 0;
    this.successiveBad = 0;
    this.n_up = settings.up || 1;
    this.n_down = settings.down;
    this.currentStepSizeIndex = 0;
    this.reversal_indexes = [];
    this.currentDirection = 0
    this.verbosity = settings.verbosity || 0
}

  getValue() {
    const currentVal = this.values[this.values.length - 1];
    return Math.min(currentVal, this.maxValue);
  }

  addResponse(response) {
    this.responses.push(response);

    if (response) {
      this.successiveGood++;
      this.successiveBad = 0;
    }
    else {
      this.successiveGood = 0;
      this.successiveBad++;
    }

    this.values.push(this.getNextValue(response));
  }

  getNextValue(correctResponse) {
    const trialIndex = this.responses.length;
    console.log('responses: ', this.responses); 
    console.log('trialIndex: ', trialIndex);

    if (!correctResponse && this.successiveBad >= this.n_up) {
      this.successiveBad = 0;

      
      if (this.currentDirection === -1) {
        this.reversal_indexes.push(trialIndex);
        this.incrementStepSizeIndex();

        if (this.verbosity > 0) {
          console.log('reversal!!!!! new dB ratio: ', this.stepSizes[this.currentStepSizeIndex]);
        }
      }
      this.currentDirection = 1;
      const newVal = Math.min(this._nextVal(), this.maxValue);
      if (this.verbosity > 0) {
          console.log("Decreasing stair difficulty. Setting new value to " + newVal + "ms.");
      }
      console.log('=============================');
      return newVal;
    }
    else if (correctResponse && this.successiveGood >= this.n_down) {
      this.successiveGood = 0;

      // if (this.currentDirection === 1) {
      //   this.reversal_indexes.push(trialIndex);
      //   this.incrementStepSizeIndex();

      //   if (this.verbosity > 0) {
      //     console.log('reversal!!!!!');
      //     console.log('reversal!!!!! new stepSizeIndex: ', this.currentStepSizeIndex);
      //     console.log('reversal!!!!! new dB ratio: ', this.stepSizes[this.currentStepSizeIndex]);
      //     console.log('reversal!!!!! new currentDirection: ', '-1');
      //   }
      // }
      this.currentDirection = -1;
      const newVal = Math.min(this._nextVal(), this.maxValue);
      if (this.verbosity > 0) {
        console.log("Increasing stair difficulty. Setting new value to " + newVal + "ms.");
      }
      console.log('=============================');
      return newVal;
    }
    else if (this.currentDirection === 0) {
      if (correctResponse && this.successiveGood >= this.n_down) {
        this.currentDirection = -1;  
      }
      else if (!correctResponse && this.currentDirection >= this.n_up) {
        this.currentDirection = 1;
      }
    }

    console.log('=============================');
    return this.getValue();
  }

  _nextVal() {
    const dB = this.stepSizes[this.currentStepSizeIndex];
    const ratio = Math.pow(10, dB/20 * this.currentDirection);
    return ratio * this.getValue();
  }

  incrementStepSizeIndex() {
    if (this.currentStepSizeIndex === this.stepSizes.length - 1) { return }
    this.currentStepSizeIndex++;
  }
}

export {
  Staircase,
  dBStaircase
}




