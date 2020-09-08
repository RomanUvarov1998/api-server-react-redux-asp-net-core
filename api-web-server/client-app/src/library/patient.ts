import { Status } from "./history";

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

    public toPatientSearchTemplateFieldVM = () => {
        return new PatientSearchTemplateFieldVM(
            this.name, this.nameId, [], '');
    }

    public static from(obj: any): PatientFieldDTM {
        let name = obj.name as string;
        let value = obj.value as string;
        let nameId = obj.nameId as number;
        return new PatientFieldDTM(name, value, nameId);
    }
}

export enum SavingStatus {
    NotSaved,
    Saving,
    Saved
}

export class PatientVM {
    constructor(fields: PatientFieldDTM[], id: number) {
        this.fields = fields;
        this.id = id;
    }

    public fields: PatientFieldDTM[];
    public id: number;

    public getUpdatedCopy = (fieldNameId: number, newFieldValue: FieldValue) => {
        const newFields = this.fields.map(field =>
            field.nameId === fieldNameId ?
                new PatientFieldDTM(field.name, newFieldValue, field.nameId) :
                field);

        return new PatientVM(newFields, this.id);
    }

    public copy = (): PatientVM => {
        return new PatientVM(
            this.fields.map(f => f.copy()),
            this.id
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
        return new PatientVM(fields, id);
    }
}

export class PatientSearchTemplateFieldVM {
    constructor(name: string, nameId: number, variants: string[], value: string) {
        this.name = name;
        this.nameId = nameId;
        this.variants = variants;
        this.value = value;
    }

    public name: FieldName;
    public nameId: number;
    public variants: FieldValue[];
    public value: FieldValue;
}
export class PatientSearchTemplateVM {
    constructor(fields: PatientFieldDTM[]) {
        this.fields = fields.map(f => f.toPatientSearchTemplateFieldVM());
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
    public getUpdatedCopy = (fieldNameId: number, newFieldValue: FieldValue) => {
        const copy = this.copy();

        copy.fields.forEach(f => {
            if (f.nameId === fieldNameId) {
                f.value = newFieldValue;
            }
        });

        return copy;
    }
    public copyToPatientVM = () => {
        return new PatientVM(
            this.fields.map(f => new PatientFieldDTM(f.name, f.value, f.nameId)),
            0
        );
    }

    public sortFieldsByNameId = (): void => {
        this.fields.sort((f1, f2) => f1.nameId - f2.nameId);
    }

    public static from(obj: any): PatientSearchTemplateVM {
        let fields: PatientFieldDTM[] = obj.fields.map(
            (f: any) => PatientFieldDTM.from(f));
        return new PatientSearchTemplateVM(fields);
    }
};

export class PatientEditingVM {
    constructor(id: number, fields: PatientFieldDTM[], status: Status, savingStatus: SavingStatus) {
        this.id = id;
        this.fields = fields;
        this.status = status;
        this.savingStatus = savingStatus;
    }

    public id: number;
    public fields: PatientFieldDTM[];
    public status: Status;
    public savingStatus: SavingStatus;

    public copy = (): PatientEditingVM => {
        return new PatientEditingVM(
            this.id,
            this.fields,
            this.status,
            this.savingStatus
        );
    };
    public getUpdatedCopy = (fieldNameId: number, newFieldValue: FieldValue) => {
        const copy = this.copy();

        copy.fields.forEach(f => {
            if (f.nameId === fieldNameId) {
                f.value = newFieldValue;
            }
        });

        return copy;
    }
    public toPatientVM(): PatientVM {
        const thisCopy = this.copy();
        const pvm = new PatientVM(
            thisCopy.fields,
            this.id
        );
        return pvm;
    }
    public static newFromPatientVM(pvm: PatientVM, status: Status,
        savingStatus: SavingStatus = SavingStatus.NotSaved): PatientEditingVM {
        return new PatientEditingVM(
            pvm.id,
            pvm.fields,
            status,
            savingStatus
        );
    }
    public static newFromPatientSearchTemplateVM(pvm: PatientSearchTemplateVM): PatientEditingVM {
        return new PatientEditingVM(
            0,
            pvm.fields.map(f => new PatientFieldDTM(f.name, f.value, f.nameId)),
            Status.Added,
            SavingStatus.NotSaved
        );
    }
}

export class PatientDTM {
    fields: PatientFieldDTM[] = [];
    id: number = 0;

    public static from({ fields, id }: PatientVM): PatientDTM {
        const p = {
            fields,
            id
        };

        return p;
    }
}