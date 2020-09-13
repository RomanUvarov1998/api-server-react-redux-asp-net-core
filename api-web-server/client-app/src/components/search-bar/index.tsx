import React from 'react'
import { FieldValue, PatientSearchTemplateVM, 
    PatientSearchTemplateFieldVM } from '../../library/patient'
import { SearchField } from '../search-field'
import { ButtonToolbar, Dropdown, Container, Row, 
    Col } from 'react-bootstrap';
import { CustomButton, PictureClear, PictureAdd, PictureSettings, 
    BtnColors } from '../custom-button';

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

    return (
        <>
            <h1>Поиск</h1>
            <ButtonToolbar>
                <CustomButton
                    onClick={() => clearTemplateHandler(props)}
                    tooltipText={'Очистить фильтр'}
                    svgPicture={PictureClear}
                    color={BtnColors.Danger}
                />
                <CustomButton
                    onClick={() => props.addPatientFromSearchFields(
                        props.patientTemplate)}
                    tooltipText={'Добавить из полей поиска'}
                    svgPicture={PictureAdd}
                    color={BtnColors.Success}
                />
                <Dropdown>
                    <Dropdown.Toggle>{PictureSettings}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item
                            onClick={props.onStartEditPatientTemplate}
                        >Изменить список полей пациента</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </ButtonToolbar>
            <Container style={{ margin: 10 }}>
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