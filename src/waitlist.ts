export class WaitList {
  private list: string[];

  constructor() {
    this.list = [];
  }

  add(name: string): void {
    this.list = addUnique(this.list, name);
  }

  view(): string {
    return stringifyList(this.list);
  }

  pop(): string | undefined {
    return this.list.shift();
  }

  addAtIndex(name: string, index: number): void {
    this.list.splice(index, 0, name);
  }
}

export function addUnique(list: string[], name: string): string[] {
  if (list.includes(name)) return list;

  return [...list, name];
}

export function stringifyList(list: string[]): string {
  if (list.length === 0) return 'Waitlist is currently empty';
  return list.reduce((acc, cur, index) => acc + `${index + 1}. ${cur}\n`, 'Waitlist:\n');
}
