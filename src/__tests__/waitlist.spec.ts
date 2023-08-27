import { addUnique, stringifyList } from '../waitlist';

describe('addUnique', () => {
  it('should add name to an empty list', () => {
    const list: string[] = [];
    const updatedList = addUnique(list, 'vdm');

    expect(updatedList).toEqual(['vdm']);
  });

  it('should not add a name that already exists in the list', () => {
    const list = ['vdm', 'champ'];
    const updatedList = addUnique(list, 'vdm');

    expect(updatedList).toEqual(['vdm', 'champ']);
  });

  it('should add name to an existing list', () => {
    const list = ['vdm', 'champ'];
    const updatedList = addUnique(list, 'blah');

    expect(updatedList).toEqual(['vdm', 'champ', 'blah']);
  });
});

describe('stringifyList', () => {
  it('given an empty list, it should state that the list is empty', async () => {
    const list: string[] = [];
    const stringifiedList = stringifyList(list);

    expect(stringifiedList).toEqual('Waitlist is currently empty');
  });

  it('given a list with items, should return a numbered list', async () => {
    const list = ['a', 'b', 'c'];
    const stringifiedList = stringifyList(list);

    expect(stringifiedList).toEqual('Waitlist:\n1. a\n2. b\n3. c\n');
  });
});
