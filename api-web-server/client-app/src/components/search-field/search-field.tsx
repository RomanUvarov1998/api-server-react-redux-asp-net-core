import React from 'react'
import { FieldValue, PatientSearchTemplateFieldVM } from '../../library/patient';

export type SearchFieldProps = {
    frozen: boolean,
    field: PatientSearchTemplateFieldVM,
    onInput: (newValue: FieldValue) => void
}

export function SearchField(props: SearchFieldProps) {
    const items = props.field.variants
                .map((v, ind) => (
                    <option
                        key={ind}
                        onClick={() => props.onInput(v)}
                    >{v}</option>
                ));

    console.log(items.length);

    const inputId = `input${props.field.nameId}`;
    const datalistId = `datalist${props.field.nameId}`;

    return (
        <td>        
            <label 
                htmlFor={inputId}
                style={{display: "block"}}
            >{props.field.name}</label>    
            <input
                id={inputId}
                value={props.field.value}
                onFocus={() => props.onInput(props.field.value)}
                onClick={() => props.onInput(props.field.value)}
                onChange={e => props.onInput(e.currentTarget.value)}
                disabled={props.frozen}
                list={datalistId}
            />
            <datalist id={datalistId}>
                {items}
            </datalist>
        </td>
    );
}