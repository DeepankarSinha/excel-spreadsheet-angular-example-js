import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  dataGrid: DataGridModel[][] = [];

  constructor() {
    this.generateGridData();
  }

  title = "CodeSandbox";

  cellClickHandler(rowIndex: number, cellIndex: number) {
    this.removeAllSelectedItems();

    this.dataGrid[rowIndex][cellIndex].isSelected = true;
  }

  evaluate(cell: DataGridModel) {
    if (isNaN(+cell.value)) {
      const cellsToSum = cell.value.split(",");
      const valueToSum = this.getValuesByCellIds(cellsToSum);
      cell.formula = JSON.parse(JSON.stringify(cell.value));
      cell.value = this.arraySum(valueToSum);
    }
  }

  private getValuesByCellIds(ids: string[]): string[] {
    let cells = [];
    ids.forEach((id) => {
      this.dataGrid.forEach((row) => {
        const a = row.filter((x) => x.id === id);
        if (a.length > 0) {
          cells.push(...a);
        }
      });
    });
    console.log(cells.map((x) => x.value));
    return cells.map((x) => x.value);
  }

  private arraySum(array: string[]): string {
    return array.reduce((a, b) => `${+a + +b}`, "0");
  }

  private generateGridData() {
    for (let i = 0; i < 10; i++) {
      this.dataGrid[i] = [];
      for (let j = 0; j < 10; j++) {
        this.dataGrid[i].push({
          value: `${i}${j}`,
          isSelected: false,
          id: this.getExcelLikeId(i, j),
          formula: ""
        });
      }
    }
  }

  // Makes all isSelected property false.
  private removeAllSelectedItems() {
    this.dataGrid.forEach((row) => {
      row.forEach((cell) => {
        cell.isSelected = false;
      });
    });
  }

  private getExcelLikeId(i: number, j: number) {
    const ordA = "a".charCodeAt(0);
    const ordZ = "z".charCodeAt(0);
    const len = ordZ - ordA + 1;

    let s = "";
    while (j >= 0) {
      s = String.fromCharCode((j % len) + ordA) + s;
      j = Math.floor(j / len) - 1;
    }

    return `${s}${i}`;
  }
}

export class DataGridModel {
  value: string;
  isSelected: boolean;
  id: string;
  formula: string;
}
