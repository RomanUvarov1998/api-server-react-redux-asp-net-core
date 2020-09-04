import React, { useState } from 'react'
import { FieldValue, PatientSearchTemplateVM, PatientSearchTemplateFieldVM } from '../../library/patient'
import { SearchField } from '../search-field'
import { Button, ButtonToolbar, DropdownMenu, DropdownItem, DropdownToggle, Dropdown } from 'reactstrap';

export type SearchBarProps = {
    frozen: boolean,
    patientTemplate: PatientSearchTemplateVM,
    onSetSearchTemplate: (fieldNameId: number, newValue: FieldValue) => void,
    giveVariants: (fieldNameId: number, variants: string[]) => void,
    onClearTemplate: () => void,
    addPatientFromSearchFields: (template: PatientSearchTemplateVM) => void,
    onStartEditPatientTemplate: () => void
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

    const [isSettingsDropdownOpen, setSettingsDropdownOpen] = useState(false);

    return (
        <>
            <h1>Поиск</h1>
            <ButtonToolbar>
                <Button onClick={() => clearTemplateHandler(props)}>Очистить фильтр</Button>
                <Button onClick={() => props.addPatientFromSearchFields(props.patientTemplate)}>Добавить</Button>
                <Dropdown
                    isOpen={isSettingsDropdownOpen}
                    toggle={() => setSettingsDropdownOpen(!isSettingsDropdownOpen)}
                >
                    <DropdownToggle caret>Настройки</DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem
                            onClick={props.onStartEditPatientTemplate}
                        >Изменить список полей пациента</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
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