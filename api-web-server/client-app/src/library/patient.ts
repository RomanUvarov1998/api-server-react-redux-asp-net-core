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
}