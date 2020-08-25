import * as React from 'react'
import { Patient, FieldValue, FieldName } from '../../library/patient'
import { SearchField } from '../search-field/search-field'

export type SearchBarProps = {
    frozen: boolean,
    patientTemplate: Patient,
    onSetSearchTemplate: (newValue: FieldValue, fieldName: FieldName) => void
}

export function SearchBar(props: SearchBarProps) {
    if (props.patientTemplate) { 
        var searchFields = props.patientTemplate.fields.map((field, ind) => {
            return (
                <SearchField
                    key={ind}
                    frozen={props.frozen}
                    field={field}
                    onInput={newValue => props.onSetSearchTemplate(newValue, field.name)}
                />
            );
        });
        return (<table><thead><tr>{searchFields}</tr></thead></table>);
    } else {
        return (
            <div>
                <h1>Поиск:</h1>
                <p>Загрузка списка полей пациента...</p>
            </div>
        );
    }
}