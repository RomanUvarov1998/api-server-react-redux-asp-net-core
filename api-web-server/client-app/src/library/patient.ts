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

export class Patient {
    constructor(fields: PatientField[], databaseId: string, localId: number) {
        this.fields = fields;
        this.databaseId = databaseId;
        this.localId = localId;
    }

    fields: PatientField[];
    databaseId: string;
    localId: number;

    public updateField = (fieldName: FieldName, newFieldValue: FieldValue) => {
        var newFields = this.fields.map(field => {
            if (field.name === fieldName) {
                return new PatientField(fieldName, newFieldValue);
            } else {
                return field;
            }
        });

        return new Patient(newFields, this.databaseId, this.localId);
    }

    public updateWhole = (template: Patient) => {
        var newFields = template.fields.map(field => field.copy());

        return new Patient(newFields, this.databaseId, this.localId);
    }

    public copy = (): Patient => {
        return new Patient(
            this.fields.map(f => new PatientField(f.name, f.value)),
            this.databaseId,
            this.localId
        );
    }
    public equals = (item: Patient): boolean => item.localId === this.localId;
    public equalsByFields = (item: Patient): boolean => {
        var eq = true;

        this.fields.forEach(field => {
            if (!eq) return;
            var itemField = item.fields.find(f => f.name === field.name);
            if (!itemField || itemField.value !== field.value) {
                eq = false;
            }
        });

        return eq;
    }
}

export function filteredSortedList(
    patientsList: Patient[],
    patientTemplate: Patient,
    additionalFilter: (p: Patient) => boolean,
    sortBy: (p: Patient) => number
): Patient[] {
    var res = patientsList.filter(p => {
        var contains = true;
        patientTemplate.fields.forEach(tf => {
            if (!tf.value) return;

            var foundField = p.fields.find(f => f.name === tf.name);

            if (foundField === undefined) return;
            if (
                !foundField.value.toLowerCase().startsWith(tf.value.toLowerCase())
                && !additionalFilter(p)
            ) {
                contains = false;
            }
        });
        return contains;
    });

    return res.sort(sortBy);
}

export function toPatient(obj: any): Patient {
    let fields = obj.fields as PatientField[];
    let id = obj.databaseId as number;
    return new Patient(fields, id.toString(), id);
}
export function toPatientField(obj: any): PatientField {
    let name = obj.name as string;
    let value = obj.value as string;
    return new PatientField(name, value);
}