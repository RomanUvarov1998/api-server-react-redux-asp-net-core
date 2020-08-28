export enum Status {
    Added,
    Modified,
    Deleted,
    Untouched
}

export class History<Item extends IHistoryItem<Item>> {
    constructor() {
        this.listHistory = [];
        this.cursor = 0;
    }

    public add(newItem: Item, listBefore: Item[]): Item[] {
        const newItemCopy = newItem.copy();
        newItemCopy.status = Status.Added;
        return this.addAndApplyAction(
            listBefore,
            {
                redo: list => copyList(list).concat(newItemCopy),
                undo: list => copyList(list).filter(it => !it.equals(newItemCopy)),
            }
        );
    }
    public edit(itemToEdit: Item, editor: (item: Item) => Item, listBefore: Item[]): Item[] {
        const initialItem = itemToEdit.copy();
        initialItem.status = itemToEdit.status;

        const editedItem = editor(initialItem);
        if (editedItem.status !== Status.Added) {
            editedItem.status = Status.Modified;
        }

        if (!itemToEdit.isUpdatedRelativelyTo(editedItem)) return listBefore;

        return this.addAndApplyAction(
            listBefore,
            {
                redo: list => {
                    let newList = copyList(list).map(
                        el =>
                            el.equals(initialItem) ?
                                editedItem :
                                el
                    );
                    return newList;
                },
                undo: list => {
                    let newList = copyList(list).map(
                        el =>
                            el.equals(initialItem) ?
                                initialItem :
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
        const deletedItemCopy = deletedItem!.copy();

        return this.addAndApplyAction(
            listBefore,
            {
                redo: list => {
                    let pat = list.find(p => p.equals(deletedItemCopy));
                    pat!.status = Status.Deleted;
                    return copyList(list);
                },
                undo: list => {
                    if (deletedItemCopy.status === Status.Added) {
                        return copyList(list).concat(deletedItemCopy);
                    } else {
                        let pat = list.find(p => p.equals(deletedItemCopy));
                        pat!.status = deletedItemCopy.status;
                        return copyList(list);
                    }
                },
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
        if (this.cursor >= this.listHistory.length) return listBefore;
        let newList = this.listHistory[this.cursor].redo(listBefore);
        if (this.cursor < this.listHistory.length) this.cursor += 1;
        return newList;
    }

    public canSave = (): boolean => this.listHistory.length > 0 && this.cursor > 0;
    public onSave() {
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

type HistoryAction<Item extends IHistoryItem<Item>> = {
    redo: (list: Item[]) => Item[],
    undo: (list: Item[]) => Item[]
}

export interface IHistoryItem<Item> {
    copy: () => Item,
    equals: (item: Item) => boolean,
    isUpdatedRelativelyTo: (item: Item) => boolean,
    status: Status,
}

export function copyList<Item extends IHistoryItem<Item>>(list: Item[]): Item[] {
    if (!list || list.length === 0) {
        return [];
    } else {
        return list.map(el => el.copy());
    }
}