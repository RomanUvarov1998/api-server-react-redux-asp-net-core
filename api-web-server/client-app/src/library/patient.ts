import { Status } from './history';

export type FieldName = string;
export type FieldValue = string;

export class PatientFieldDTM {
    constructor(_name: FieldName, _value: FieldValue, _nameId: number) {
        this.name = _name;
        this.value = _value;
        this.nameId = _nameId;
    }

    public copy = (): PatientFieldDTM => new PatientFieldDTM(this.name, this.value, this.nameId);
    public toString = () => `{ ${this.name}:${this.value} }`;

    public value: FieldValue;
    public name: FieldName;
    public nameId: number;

    public static from(obj: any): PatientFieldDTM {
        let name = obj.name as string;
        let value = obj.value as string;
        let nameId = obj.nameId as number;
        return new PatientFieldDTM(name, value, nameId);
    }
}

export enum SavingStatus {
    Saved,
    Saving
}

export class PatientVM {
    constructor(fields: PatientFieldDTM[], id: number,
        status: Status) {
        this.fields = fields;
        this.id = id;
        this.status = status;
        this.savingStatus = SavingStatus.Saved;
    }

    public fields: PatientFieldDTM[];
    public id: number;
    public status: Status;
    public savingStatus: SavingStatus;

    public updateField = (fieldNameId: number, newFieldValue: FieldValue) => {
        const newFields = this.fields.map(field => {
            if (field.nameId === fieldNameId) {
                return new PatientFieldDTM(field.name, newFieldValue, field.nameId);
            } else {
                return field;
            }
        });

        let newStatus;
        switch (this.status) {
            case Status.Added: newStatus = Status.Added; break;
            case Status.Modified: newStatus = Status.Modified; break;
            case Status.Deleted: throw new Error("Status is deleted");
            case Status.Untouched: newStatus = Status.Modified; break;
            default: throw new Error("Unknown status");
        }

        return new PatientVM(newFields, this.id, newStatus);
    }

    public updateWhole = (template: PatientVM) => {
        const newFields = template.fields.map(field => field.copy());

        let newStatus;
        switch (this.status) {
            case Status.Added: newStatus = Status.Added; break;
            case Status.Modified: newStatus = Status.Modified; break;
            case Status.Deleted: throw new Error("Status is deleted");
            case Status.Untouched: newStatus = Status.Modified; break;
            default: throw new Error("Unknown status");
        }

        return new PatientVM(newFields, this.id, newStatus);
    }

    public copy = (): PatientVM => {
        return new PatientVM(
            this.fields.map(f => f.copy()),
            this.id,
            this.status
        );
    }
    public equals = (item: PatientVM): boolean => item.id === this.id;
    public isUpdatedRelativelyTo = (item: PatientVM): boolean => {
        let updated = false;

        this.fields.forEach(field => {
            if (updated) return;
            const itemField = item.fields.find(f => f.nameId === field.nameId);
            if (!itemField || itemField.value !== field.value) {
                updated = true;
            }
        });

        return updated;
    }

    public toString = () => {
        let str: string = '{ ';
        this.fields.forEach(f => str += `${f.nameId}:${f.name}=${f.value} `);
        str += ' }';
        return str;
    }

    public static from(obj: any): PatientVM {
        let fields: PatientFieldDTM[] = obj.fields.map(
            (f: any) => PatientFieldDTM.from(f));
        let id = obj.id as number;
        let status = obj.status as Status;
        return new PatientVM(fields, id, status);
    }
}

export class PatientSearchTemplateFieldVM {
    constructor({ name, nameId }: PatientFieldDTM) {
        this.name = name;
        this.nameId = nameId;
        this.variants = [];
        this.value = '';
    }

    public name: FieldName;
    public nameId: number;
    public variants: FieldValue[];
    public value: FieldValue;
}
export class PatientSearchTemplateVM {
    constructor(fields: PatientFieldDTM[]) {
        this.fields = fields.map(f => new PatientSearchTemplateFieldVM(f));
    }

    public fields: PatientSearchTemplateFieldVM[];

    public copy = () => {
        const pst = new PatientSearchTemplateVM(
            this.fields.map(f => new PatientFieldDTM(f.name, '', f.nameId)));

        pst.fields.forEach(f => {
            const copyf = this.fields.find(tf => tf.nameId === f.nameId);
            f.variants = copyf!.variants.slice();
            f.value = copyf!.value;
        });

        return pst;
    };
    public updateField = (fieldNameId: number, newFieldValue: FieldValue) => {
        const copy = this.copy();

        copy.fields.forEach(f => {
            if (f.nameId === fieldNameId) {
                f.value = newFieldValue;
            }
        });

        return copy;
    }
    public toPatientVM = () => {
        return new PatientVM(
            this.fields.map(f => new PatientFieldDTM(f.name, f.value, f.nameId)),
            0,
            Status.Added
        );
    }

    public static from(obj: any): PatientSearchTemplateVM {
        let fields: PatientFieldDTM[] = obj.fields.map(
            (f: any) => PatientFieldDTM.from(f));
        return new PatientSearchTemplateVM(fields);
    }
};

export class PatientDTM {
    fields: PatientFieldDTM[] = [];
    id: number = 0;
    status: Status = Status.Untouched;

    public static from({ fields, id, status }: PatientVM): PatientDTM {
        const p = {
            fields,
            id,
            status
        };

        return p;
    }
}