import * as React from 'react';
import { PatientFieldDTM } from '../../library/patient';

type PatientEditFieldProps = {
    field: PatientFieldDTM,
    onChange: (fieldNameId: number, newValue: string) => void,
    disabled: boolean,
    autofocus: boolean
};
export function PatientEditField(props: PatientEditFieldProps): JSX.Element {
    const inputId = `edit${props.field.nameId}`;
    return (
        <>
            <label htmlFor={inputId}>{props.field.name}</label>
            <input
                id={inputId}
                type={'text'}
                value={props.field.value}
                onChange={e => props.onChange(props.field.nameId, e.currentTarget.value)}
                style={{ display: 'block' }}
                autoFocus={props.autofocus}
            />
        </>
    );
}