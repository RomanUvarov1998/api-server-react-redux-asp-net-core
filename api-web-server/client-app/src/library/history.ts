export class History<Item extends ICopy<Item>> {
    constructor(initialList: Item[]) {
        this.listHistory = [ initialList ];
        this.cursor = 0;
    }

    public add(item: Item): Item[] {
        let newList = this.copyList(this.listHistory[this.cursor]);

        this.cursor += 1;
        console.log(this.cursor);
        newList.push(item);
        this.listHistory.push(newList);

        return newList;
    }
    public edit(editor: (item: Item) => Item): Item[] {
        let newList = this.copyList(this.listHistory[this.cursor]).map(editor);

        this.cursor += 1;
        console.log(this.cursor);
        this.listHistory.push(newList);

        return newList;
    }
    public del(predicatToKeep: (item: Item) => boolean): Item[] {
        let newList = this.copyList(this.listHistory[this.cursor]).filter(predicatToKeep);

        this.cursor += 1;
        console.log(this.cursor);
        this.listHistory.push(newList);

        return newList;
    }

    public canUndo = (): boolean => this.cursor > 0;
    public canRedo = (): boolean => this.cursor < this.listHistory.length - 1;
    public undo(): Item[] {
        if (this.cursor > 0) this.cursor -= 1;
        console.log(this.cursor);
        return this.copyList(this.listHistory[this.cursor]);
    }
    public redo(): Item[] {
        if (this.cursor < this.listHistory.length - 1) this.cursor += 1;
        console.log(this.cursor);
        return this.copyList(this.listHistory[this.cursor]);
    }

    private listHistory: Item[][];
    private cursor: number;
    private copyList(list: Item[]): Item[] {
        if (!list || list.length === 0) {
            return [];
        } else {
            return list.map(el => el.copy());
        }        
    }
}

export interface ICopy<Item> {
    copy: () => Item,
    equals: (item: Item) => boolean,
}