import { Status, IHistoryItem } from './history';

export type FieldName = string;
export type FieldValue = string;

export class PatientField {
    constructor(_name: FieldName, _value: FieldValue) {
        this.name = _name;
        this.value = _value;
    }

    public copy = (): PatientField => new PatientField(this.name, this.value);

    public value: FieldValue;
    public name: FieldName;
}

export enum SavingStatus {
    Saved,
    Saving
}

export class Patient implements IHistoryItem<Patient> {
    constructor(fields: PatientField[], id: number,
        status: Status) {
        this.fields = fields;
        this.id = id;
        this.status = status;
        this.savingStatus = SavingStatus.Saved;
    }

    fields: PatientField[];
    id: number;
    status: Status;
    savingStatus: SavingStatus;

    public updateField = (fieldName: FieldName, newFieldValue: FieldValue) => {
        const newFields = this.fields.map(field => {
            if (field.name === fieldName) {
                return new PatientField(fieldName, newFieldValue);
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

        return new Patient(newFields, this.id, newStatus);
    }

    public updateWhole = (template: Patient) => {
        const newFields = template.fields.map(field => field.copy());

        let newStatus;
        switch (this.status) {
            case Status.Added: newStatus = Status.Added; break;
            case Status.Modified: newStatus = Status.Modified; break;
            case Status.Deleted: throw new Error("Status is deleted");
            case Status.Untouched: newStatus = Status.Modified; break;
            default: throw new Error("Unknown status");
        }

        return new Patient(newFields, this.id, newStatus);
    }

    public copy = (): Patient => {
        return new Patient(
            this.fields.map(f => f.copy()),
            this.id,
            this.status
        );
    }
    public equals = (item: Patient): boolean => item.id === this.id;
    public isUpdatedRelativelyTo = (item: Patient): boolean => {
        let updated = false;

        this.fields.forEach(field => {
            if (updated) return;
            const itemField = item.fields.find(f => f.name === field.name);
            if (!itemField || itemField.value !== field.value) {
                updated = true;
            }
        });

        return updated;
    }
}

export function toPatient(obj: any): Patient {
    let fields: PatientField[] = obj.fields.map((f: any) => toPatientField(f));
    let id = obj.id as number;
    let status = obj.status;
    return new Patient(fields, id, status);
}
export function toPatientField(obj: any): PatientField {
    let name = obj.name as string;
    let value = obj.value as string;
    return new PatientField(name, value);
}