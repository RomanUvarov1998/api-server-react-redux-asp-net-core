import React, { useState } from 'react'
import { FieldValue, PatientSearchTemplateVM, PatientSearchTemplateFieldVM } from '../../library/patient'
import { SearchField } from '../search-field'
import { Button, ButtonToolbar, DropdownMenu, DropdownItem, DropdownToggle, Dropdown, Container, Row, Col } from 'reactstrap';
import { CustomAddBtn, SettingsPicture, CustomClearBtn } from '../custom-buttons';

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
            <Col key={index}>
                <SearchField
                    frozen={props.frozen}
                    field={field}
                    onInput={newValue => props.onSetSearchTemplate(field.nameId, newValue)}
                />
            </Col>
        );
    });

    const [isSettingsDropdownOpen, setSettingsDropdownOpen] = useState(false);

    return (
        <>
            <h1>Поиск</h1>
            <ButtonToolbar>
                <CustomClearBtn
                    onClick={() => clearTemplateHandler(props)}
                    tooltipText={'Очистить фильтр'}
                />
                <CustomAddBtn onClick={() => props.addPatientFromSearchFields(props.patientTemplate)} />
                <Dropdown
                    isOpen={isSettingsDropdownOpen}
                    toggle={() => setSettingsDropdownOpen(!isSettingsDropdownOpen)}
                >
                    <DropdownToggle caret>{SettingsPicture}</DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem
                            onClick={props.onStartEditPatientTemplate}
                        >Изменить список полей пациента</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </ButtonToolbar>
            <Container style={{margin: 10}}>
                <Row>{searchFields}</Row>
            </Container>
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