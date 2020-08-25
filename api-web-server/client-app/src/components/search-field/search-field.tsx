import * as React from 'react'
import { FieldValue, PatientField } from '../../library/patient';

export type SearchFieldProps = {
    frozen: boolean,
    field: PatientField,
    onInput: (newValue: FieldValue) => void
}

export function SearchField(props: SearchFieldProps) {
    var id = `searchField${props.field.name}`;
    return (
        <td>
            <label htmlFor={id} style={{ display: 'block' }}>{props.field.name}</label>
            <input
                id={id}
                value={props.field.value}
                onChange={(e) => onChange(e, props)}
                disabled={props.frozen}
            />
        </td>
    );
}

function onChange(e: React.FormEvent<HTMLInputElement>, props: SearchFieldProps) {
    props.onInput(e.currentTarget.value);
}