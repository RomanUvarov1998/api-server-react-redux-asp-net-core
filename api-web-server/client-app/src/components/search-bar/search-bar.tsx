import React from 'react'
import { FieldValue, PatientSearchTemplate, PatientSearchTemplateField } from '../../library/patient'
import { SearchField } from '../search-field/search-field'
import { Button } from 'reactstrap';

export type SearchBarProps = {
    frozen: boolean,
    patientTemplate: PatientSearchTemplate,
    onSetSearchTemplate: (fieldNameId: number, newValue: FieldValue) => void,
    giveVariants: (fieldNameId: number, variants: string[]) => void,
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
            <Button onClick={() => clearTemplateHandler(props)}>Очистить фильтр</Button>
            <table><thead><tr>{searchFields}</tr></thead></table>
        </>
    );
}

function clearTemplateHandler(props: SearchBarProps) {
    if (props.patientTemplate.fields.reduce(
        (previousValue: boolean, currentValue: PatientSearchTemplateField) => {
            return previousValue && currentValue.value === '';
        },
        true)
    ) return;

    props.onClearTemplate();
}