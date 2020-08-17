import { Patient } from './patient'

export class History<Item extends ICopy<Item>> {
    constructor() {
        this.listHistory = [];
        this.cursor = 0;
    }

    public Add(item: Item): Item[] {
        let newList = this.listHistory[this.cursor].slice();
        this.cursor += 1;
        newList.push(item);
        this.listHistory.push(newList);
        return newList;
    }
    public Edit(item: Item): Item[] {
        let newList = this.listHistory[this.cursor].slice();
        this.cursor += 1;

        let editedItem = newList.find(it => it.equals(item));
        if (editedItem) {

        }

        newList.push(item);
        this.listHistory.push(newList);
        return newList;
    }

    private listHistory: Item[][];
    private cursor: number;
}

export interface ICopy<Item> {
    copy: () => Item,
    equals: (item: Item) => boolean,
}