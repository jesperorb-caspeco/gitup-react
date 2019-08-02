export class Format {
  public static wrapJSON(rawData: string) {
    return "[" + rawData.slice(0, -1) + "]";
  }

  public static parse(rawData: string) {
    try {
      return JSON.parse(this.wrapJSON(rawData));
    } catch (error) {
      throw new Error("Failed to parse json");
    }
  }

  public static stats(rawData: string) {
    const files = rawData
      .split(/SEPARATOR\n/g)
      .filter(Boolean)
      .map((item: string) => item
        .split(/\n/g)
        .filter(Boolean)
      )
      .reduce((acc: string[], item: string[]) => acc.concat(item), []);
    let totalAdditions = 0;
    let totalDeletions = 0;
    for (const file in files) {
      const [addition, deletion] = files[file].split(/\t/g);
      const parsedAddition = parseInt(addition, 10);
      const parsedDeletion = parseInt(deletion, 10);
      if (Number.isInteger(parsedAddition)) {
        totalAdditions += parsedAddition;
      }
      if (Number.isInteger(parsedDeletion)) {
        totalDeletions += parsedDeletion;
      }
    }
    return { totalAdditions, totalDeletions };
  }
}
