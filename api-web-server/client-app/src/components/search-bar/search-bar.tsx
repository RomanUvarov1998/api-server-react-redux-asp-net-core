import React from 'react'
import { Patient, FieldValue, PatientField } from '../../library/patient'
import { SearchField } from '../search-field/search-field'
import { Button } from 'reactstrap';

export type SearchBarProps = {
    frozen: boolean,
    patientTemplate: Patient,
    onSetSearchTemplate: (fieldNameId: number, newValue: FieldValue) => void,
    onClearTemplate: () => void
}

export function SearchBar(props: SearchBarProps) {
    const searchFields = props.patientTemplate.fields.map((field, ind) => {
        return (
            <SearchField
                key={ind}
                frozen={props.frozen}
                field={field}
                onInput={newValue => props.onSetSearchTemplate(field.nameId, newValue)}
            />
        );
    });
    return (
        <>
            <h1>Поиск</h1>
            <table><thead><tr>{searchFields}</tr></thead></table>
            <Button onClick={() => clearTemplateHandler(props)}>Очистить фильтр</Button>
        </>
    );
}

function clearTemplateHandler(props: SearchBarProps) {
    if (props.patientTemplate.fields.reduce(
        (previousValue: boolean, currentValue: PatientField) => {
            return previousValue && currentValue.value === '';
        },
        true)
    ) return;

    props.onClearTemplate();
}