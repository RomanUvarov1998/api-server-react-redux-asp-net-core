export type FieldName = string;
export type FieldValue = string;

export class PatientField {
    constructor(_name: FieldName, _value: FieldValue) {
        this.name = _name;
        this.value = _value;
    }

    public value: FieldValue;
    public name: FieldName;
}

export class Patient {
    constructor(fields: PatientField[], id: number) {
        this.fields = fields;
        this.id = id;
    }

    fields: PatientField[];
    id: number;

    public update = (fieldName: FieldName, newFieldValue: FieldValue) => {
        var newFields = this.fields.map((field) => {
            if (field.name === fieldName) {
                return new PatientField(fieldName, newFieldValue);
            } else {
                return field;
            }
        });

        return new Patient(newFields, this.id);
    }

    public copy = (): Patient => {
        return new Patient(
            this.fields.map(f => new PatientField(f.name, f.value)),
            this.id
        );
    }
    public equals = (item: Patient): boolean => item.id === this.id;
}

export function filteredList(
    patientsList: Patient[],
    patientTemplate: Patient,
    additionalFilter: (p: Patient) => boolean
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

    return res;
}

export function toPatient(obj: any): Patient {
    let fields = obj.fields as PatientField[];
    let id = obj.id as number;
    return new Patient(fields, id);
}
export function toPatientField(obj: any): PatientField {
    let name = obj.name as string;
    let value = obj.value as string;
    return new PatientField(name, value);
}