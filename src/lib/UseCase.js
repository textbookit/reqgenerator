function makeIdFromList(list, symbol) {
  let unique = false;
  let newId = "";
  do {
    newId = "" + symbol + Math.floor(Math.random() * 30000);
    if (list[newId] == null) {
      unique = true;
    }
  } while (!unique);

  return newId;
}

function makeId(symbol) {
  return "" + symbol + Math.floor(Math.random() * 30000);
}

export const PARAMETER_TYPES = ["String", "Number", "Boolean", "Array"];

export class Requirement {
  constructor(params) {
    let properties = Object.assign(
      {
        id: makeId("R"),
        text: ""
      },
      params
    );

    this.id = properties.id;
    this.text = properties.text;

    if (properties.currentReqs != null) {
      this.id = makeIdFromList(properties.currentReqs, "R");
    }
  }

  compareRequirement(otherReq, currentReqs) {
    if (this.id == otherReq.id) {
      otherReq.id = makeIdFromList(currentReqs, "R");
    }

    if (otherReq.text == null) {
      return -1;
    } else if (otherReq.text != this.text) {
      return 1;
    } else {
      return 0;
    }
  }

  toJSON() {
    return {
      id: this.id,
      text: this.text
    };
  }

  toMarkDown() {
    return this.text;
  }
}

export class Parameter {
  constructor(params) {
    let properties = Object.assign(
      {
        id: makeId("P"),
        name: "",
        type: PARAMETER_TYPES[0],
        required: false
      },
      params
    );

    this.id = properties.id;
    this.name = properties.name;
    this.type = properties.type;
    this.required = properties.required;

    if (properties.currentParams != null) {
      this.id = makeIdFromList(properties.currentParams, "P");
    }
  }

  compareParameters(otherParam, currentParams) {
    if (this.id == otherParam.id) {
      otherParam.id = makeIdFromList(currentParams, "P");
    }

    if (otherParam.name == null) {
      return -1;
    } else if (this.name != otherParam.name) {
      return 1;
    }

    return 0;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      required: this.required
    };
  }

  toMarkDown() {
    return `${this.name} :${this.type} (${this.required ? "Required" : ""})`;
  }
}

export default class UseCase {
  constructor(params) {
    let properties = Object.assign(
      {
        id: makeId("UC"),
        title: "New Use Case",
        category: "N/A",
        description: "This is an example description",
        requirements: {},
        inputs: {},
        outputs: {},
        ref: null
      },
      params
    );

    if (params.currentList == null) {
      this.id = properties.id;
    } else {
      this.id = makeIdFromList(params.currentList, "UC");
    }
    this.title = properties.title;
    this.category = properties.category;
    this.description = properties.description;
    this.requirements = properties.requirements;
    this.inputs = properties.inputs;
    this.outputs = properties.outputs;
    this.ref = properties.ref;
  }

  makeNewId(currentList) {
    this.id = makeIdFromList(currentList, "UC");
  }

  createRequirement() {
    const newReq = new Requirement({ currentReqs: this.requirements });
    this.requirements[newReq.id] = newReq;
  }

  addRequirement(id, text) {
    const newReq = new Requirement({ id: id, text: text });
    this.requirements[id] = newReq;
  }

  deleteRequirement(id) {
    if (this.requirements[id] != null) {
      delete this.requirements[id];
    }
  }

  updateRequirement(id, text) {
    if (this.requirements[id] != null) {
      this.requirements[id] = new Requirement({ id: id, text: text });
    }
  }

  createInput() {
    const newParam = new Parameter({ currentParams: this.inputs });
    this.inputs[newParam.id] = newParam;
  }

  createOutput() {
    const newParam = new Parameter({ currentParams: this.outputs });
    this.outputs[newParam.id] = newParam;
  }

  addInput(id, name, type, required) {
    if (this.inputs[id] == null) {
      this.inputs[id] = new Parameter({
        id: id,
        name: name,
        type: type,
        required: required
      });
    }
  }

  addOutput(id, name, type, required) {
    if (this.outputs[id] == null) {
      this.outputs[id] = new Parameter({
        id: id,
        name: name,
        type: type,
        required: required
      });
    }
  }

  deleteInput(id) {
    if (this.inputs[id] != null) {
      delete this.inputs[id];
    }
  }

  deleteOutput(id) {
    if (this.outputs[id] != null) {
      delete this.outputs[id];
    }
  }

  updateInput(id, name, type, required) {
    if (this.inputs[id] != null) {
      const newList = { ...this.inputs };
      newList[id] = new Parameter({
        id: id,
        name: name,
        type: type,
        required: required
      });
      this.inputs = newList;
    }
  }

  updateOutput(id, name, type, required) {
    if (this.outputs[id] != null) {
      const newList = { ...this.outputs };
      newList[id] = new Parameter({
        id: id,
        name: name,
        type: type,
        required: required
      });
      this.outputs = newList;
    }
  }

  compareUseCase(useCase) {
    if (useCase.title == null) {
      return -1;
    } else if (useCase.id == this.id) {
      return 2;
    } else if (
      useCase.description != this.description ||
      useCase.title != this.title ||
      useCase.category != this.category
    ) {
      return 1;
    } else {
      return 0;
    }
  }

  toJSON() {
    const base = {
      id: this.id,
      title: this.title,
      category: this.category,
      description: this.description
    };
    base.requirements = this.requirements;
    base.inputs = this.inputs;
    base.outputs = this.outputs;
    return base;
  }

  toMarkDown(useCaseIndex) {
    let markdown = `### UC${
      useCaseIndex < 10 ? `0${useCaseIndex}` : useCaseIndex
    }: ${this.title}`;
    let requirementsMd = ``;
    Object.values(this.requirements).forEach(
      (req, i) => (requirementsMd += `${i + 1}. ${req.toMarkDown()}\n`)
    );
    let inputsMd = ``;
    Object.values(this.inputs).forEach(
      (input, i) => (inputsMd += `${i + 1}. ${input.toMarkDown()}\n`)
    );
    let outputsMd = ``;
    Object.values(this.outputs).forEach(
      (output, i) => (outputsMd += `${i + 1}. ${output.toMarkDown()}\n`)
    );

    let useCaseMd = `${markdown}\n------\n#### Category\n${
      this.category
    }\n#### Description\n${
      this.description
    }\n#### Requirements\n${requirementsMd.toString()}\n#### Parameters\n##### Inputs\n${
      inputsMd != "" ? inputsMd.toString() : "No Inputs\n"
    }\n##### Outputs\n${
      outputsMd != "" ? outputsMd.toString() : "No Outputs\n"
    }\n------\n`;

    console.log(useCaseMd);

    return useCaseMd;
  }
}
