export class History<Item extends ICopy<Item>> {
    constructor() {
        this.listHistory = [];
        this.cursor = 0;
    }

    public add(newItem: Item, listBefore: Item[]): Item[] {
        return this.addAndApplyAction(
            listBefore,
            {
                redo: list => this.copyList(list).concat([newItem]),
                undo: list => this.copyList(list).filter(it => !it.equals(newItem)),
            }
        );
    }
    public edit(itemToEdit: Item, editor: (item: Item) => Item, listBefore: Item[]): Item[] {
        let editedItem = editor(itemToEdit);

        return this.addAndApplyAction(
            listBefore,
            {
                redo: list => {
                    let newList = this.copyList(list).map(
                        el =>
                            el.equals(itemToEdit) ?
                                editedItem :
                                el
                    );
                    return newList;
                },
                undo: list => {
                    let newList = this.copyList(list).map(
                        el =>
                            el.equals(itemToEdit) ?
                                itemToEdit :
                                el
                    );
                    return newList;
                },
            }
        );
    }
    public del(predicate: (item: Item) => boolean, listBefore: Item[]): Item[] {
        let deletedItem = listBefore.find(predicate);
        if (!deletedItem) throw Error("deletedItem history.ts");

        return this.addAndApplyAction(
            listBefore,
            {
                redo: list => this.copyList(list).filter(it => !it.equals(deletedItem as Item)),
                undo: list => this.copyList(list).concat([deletedItem as Item]),
            }
        );
    }

    public canUndo = (): boolean => this.cursor > 0;
    public canRedo = (): boolean => this.cursor < this.listHistory.length;
    public undo(listBefore: Item[]): Item[] {
        if (this.cursor <= 0) return listBefore;
        this.cursor -= 1;
        return this.listHistory[this.cursor].undo(listBefore);
    }
    public redo(listBefore: Item[]): Item[] {
        let newList = this.listHistory[this.cursor].redo(listBefore);
        if (this.cursor < this.listHistory.length) this.cursor += 1;
        return newList;
    }

    public isEmpty = (): boolean => this.listHistory.length > 0 && this.cursor > 0;

    private listHistory: HistoryAction<Item>[];
    private cursor: number;
    private copyList(list: Item[]): Item[] {
        if (!list || list.length === 0) {
            return [];
        } else {
            return list.map(el => el.copy());
        }
    }
    private addAndApplyAction(list: Item[], action: HistoryAction<Item>): Item[] {
        if (this.cursor < this.listHistory.length - 1) {
            this.listHistory = this.listHistory.slice(0, this.cursor);
        }
        this.listHistory.push(action);

        let newList = this.listHistory[this.cursor].redo(list);
        this.cursor += 1;

        return newList;
    }
}

type HistoryAction<Item extends ICopy<Item>> = {
    redo: (list: Item[]) => Item[],
    undo: (list: Item[]) => Item[]
}

export interface ICopy<Item> {
    copy: () => Item,
    equals: (item: Item) => boolean,
}