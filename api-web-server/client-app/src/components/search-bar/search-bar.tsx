import * as React from "react"
import { Patient, FieldValue, FieldName } from '../../library/patient'
import { SearchField } from '../search-field/search-field'

export type SearchBarProps = {
    patientTemplate: Patient,
    onSetSearchTemplate: (newValue: FieldValue, fieldName: FieldName) => void
}

export function SearchBar(props: SearchBarProps) {
    var searchFields = props.patientTemplate.fields.map((field, ind) => {
        return (
            <SearchField
                key={ind}
                value={field.value}
                onInput={newValue => props.onSetSearchTemplate(newValue, field.name)}
            />
        );
    });

    var searchHeaders = props.patientTemplate.fields
        .map(field => (<th>{field.name}</th>));

    return (
        <div>
            <h1>Search:</h1>
            <table>
                <thead><tr>{searchHeaders}</tr></thead>
                <tbody><tr>{searchFields}</tr></tbody>
            </table>
        </div>
    );
}