import React from 'react'
import { FieldValue, PatientSearchTemplateVM, PatientSearchTemplateFieldVM } from '../../library/patient'
import { SearchField } from '../search-field/search-field'
import { Button, ButtonToolbar } from 'reactstrap';

export type SearchBarProps = {
    frozen: boolean,
    patientTemplate: PatientSearchTemplateVM,
    onSetSearchTemplate: (fieldNameId: number, newValue: FieldValue) => void,
    giveVariants: (fieldNameId: number, variants: string[]) => void,
    onClearTemplate: () => void,
    addPatientFromSearchFields: (template: PatientSearchTemplateVM) => void
}

export function SearchBar(props: SearchBarProps) {
    const searchFields = props.patientTemplate.fields.map((field, index) => {
        return (
            <SearchField
                key={index}
                frozen={props.frozen}
                field={field}
                onInput={newValue => props.onSetSearchTemplate(field.nameId, newValue)}
            />
        );
    });
    return (
        <>
            <h1>Поиск</h1>
            <ButtonToolbar>
                <Button onClick={() => clearTemplateHandler(props)}>Очистить фильтр</Button>
                <Button onClick={() => props.addPatientFromSearchFields(props.patientTemplate)}>Добавить</Button>
            </ButtonToolbar>
            <table><thead><tr>{searchFields}</tr></thead></table>
        </>
    );
}

function clearTemplateHandler(props: SearchBarProps) {
    if (props.patientTemplate.fields.reduce(
        (previousValue: boolean, currentValue: PatientSearchTemplateFieldVM) => {
            return previousValue && currentValue.value === '';
        },
        true)
    ) return;

    props.onClearTemplate();
}