export enum Status {
    Added,
    Modified,
    Deleted,
    Untouched
}

export class History<Item> {
    constructor(
        copyItem: (item: Item) => Item,
        haveEqualId: (item1: Item, item2: Item) => boolean,
        haveEqualContent: (item1: Item, item2: Item) => boolean,
        getStatus?: (item: Item) => Status,
        setStatus?: (item: Item, newStatus: Status) => void
    ) {
        this.listHistory = [];
        this.cursor = 0;

        this.copyItem = copyItem;
        this.haveEqualId = haveEqualId;
        this.haveEqualContent = haveEqualContent;
        this.getStatus = getStatus;
        this.setStatus = setStatus;
    }

    public add(newItem: Item, listBefore: Item[]): Item[] {
        const newItemCopy = this.copyItem(newItem);
        if (this.setStatus) {
            this.setStatus(newItemCopy, Status.Added);
        }
        return this.addAndApplyAction(
            listBefore,
            {
                redo: list => list.concat(newItemCopy),
                undo: list => list.filter(it => !this.haveEqualId(newItemCopy, it)),
            }
        );
    }
    public edit(itemToEdit: Item, editor: (item: Item) => Item, listBefore: Item[]): Item[] {
        const initialItem = this.copyItem(itemToEdit);
        if (this.getStatus && this.setStatus) {
            this.setStatus(initialItem, this.getStatus(itemToEdit));
        }

        const editedItem = editor(initialItem);
        if (this.getStatus && this.setStatus && this.getStatus(editedItem) !== Status.Added) {
            this.setStatus(editedItem, Status.Modified);
        }

        if (this.haveEqualContent(editedItem, itemToEdit)) return listBefore;


        return this.addAndApplyAction(
            listBefore,
            {
                redo: list => {
                    let newList = list.map(
                        el =>
                            this.haveEqualId(el, initialItem) ?
                                editedItem :
                                el
                    );
                    console.log(`redo ${initialItem} -> ${editedItem}`);
                    return newList;
                },
                undo: list => {
                    let newList = list.map(
                        el =>
                            this.haveEqualId(el, initialItem) ?
                                initialItem :
                                el
                    );
                    console.log(`redo ${editedItem} -> ${initialItem}`);
                    return newList;
                },
            }
        );
    }
    public del(predicate: (item: Item) => boolean, listBefore: Item[]): Item[] {
        let deletedItem = listBefore.find(predicate);
        if (!deletedItem) throw Error("deletedItem history.ts");
        const copyAsExisting = this.copyItem(deletedItem!);
        const copyAsDeleted = this.copyItem(deletedItem!);
        if (this.setStatus) {
            this.setStatus(copyAsDeleted, Status.Deleted);
        }

        return this.addAndApplyAction(
            listBefore,
            {
                redo: list => {
                    if ((this.getStatus && (this.getStatus(copyAsExisting) === Status.Added))
                        || this.getStatus === undefined) 
                    {
                        return list.filter(it => !this.haveEqualId(it, copyAsExisting));
                    } else {
                        return list.map(it =>
                            this.haveEqualId(it, copyAsExisting) ? copyAsDeleted : it);
                    }
                },
                undo: list => {
                    if ((this.getStatus && (this.getStatus(copyAsExisting) === Status.Added))
                        || this.getStatus === undefined) 
                    {
                        return list.concat(copyAsExisting);
                    } else {
                        return list.map(it =>
                            this.haveEqualId(it, copyAsDeleted) ? copyAsExisting : it);
                    }
                },
            }
        );
    }

    private copyItem: (item: Item) => Item;
    private haveEqualId: (item1: Item, item2: Item) => boolean;
    private haveEqualContent: (item1: Item, item2: Item) => boolean;
    private getStatus?: (item: Item) => Status;
    private setStatus?: (item: Item, newStatus: Status) => void;

    public canUndo = (): boolean => this.cursor > 0;
    public canRedo = (): boolean => this.cursor < this.listHistory.length;
    public undo(listBefore: Item[]): Item[] {
        if (this.cursor <= 0) return listBefore;
        this.cursor -= 1;
        return this.listHistory[this.cursor].undo(listBefore);
    }
    public redo(listBefore: Item[]): Item[] {
        if (this.cursor >= this.listHistory.length) return listBefore;
        let newList = this.listHistory[this.cursor].redo(listBefore);
        if (this.cursor < this.listHistory.length) this.cursor += 1;
        return newList;
    }

    public hasSomethingToSave = (): boolean => this.listHistory.length > 0 && this.cursor > 0;
    public clear() {
        this.listHistory = [];
        this.cursor = 0;
    }

    private listHistory: HistoryAction<Item>[];
    private cursor: number;
    private addAndApplyAction(list: Item[], action: HistoryAction<Item>): Item[] {
        if (this.cursor < this.listHistory.length) {
            this.listHistory = this.listHistory.slice(0, this.cursor);
        }
        this.listHistory.push(action);

        let newList = this.listHistory[this.cursor].redo(list);
        this.cursor += 1;

        return newList;
    }
}

type HistoryAction<Item> = {
    redo: (list: Item[]) => Item[],
    undo: (list: Item[]) => Item[]
}