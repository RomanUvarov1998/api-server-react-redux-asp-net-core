import React from 'react';
import { PatientVM, PatientSearchTemplateVM } from '../../library/patient'
import { SearchBar } from '../search-bar';
import { Button, Table, Container, Row, Col } from 'reactstrap';
import { Status } from '../../library/history';
import { CustomEditBtn, CustomDeleteBtn } from '../custom-buttons';

export type SearchTableProps = {
    isWaitingPatientsList: boolean,
    isWaitingPatientFields: boolean,
    patientsList: PatientVM[],
    patientTemplate: PatientSearchTemplateVM | null,
    canLoadMore: boolean,
    loadPortionCount: number,
    onSetSearchTemplate: (fieldNameId: number, newValue: string) => void,
    giveVariants: (fieldNameId: number, variants: string[]) => void,
    onClearTemplate: () => void,
    onLoadMore: (template: PatientSearchTemplateVM, loadedCount: number, pageLength: number) => void,
    addPatientFromSearchFields: (patient: PatientSearchTemplateVM) => void,
    onEnterEditor: (patient: PatientVM | undefined, status: Status) => void,
    onStartEditPatientTemplate: () => void
}

export function SearchTable(props: SearchTableProps): JSX.Element {
    let tableHeadRow;
    let tableBodyRows;
    let searchBar;

    if (!props.isWaitingPatientFields) {
        if (!props.patientTemplate) throw Error("patientTemplate is null");

        tableHeadRow = (
            <tr>
                {props.patientTemplate.fields.map(f => (<th key={f.nameId}>{f.name}</th>))}
            </tr>
        );
        searchBar = (
            <SearchBar
                frozen={false}
                patientTemplate={props.patientTemplate}
                onSetSearchTemplate={props.onSetSearchTemplate}
                giveVariants={props.giveVariants}
                onClearTemplate={props.onClearTemplate}
                addPatientFromSearchFields={props.addPatientFromSearchFields}
                onStartEditPatientTemplate={props.onStartEditPatientTemplate}
            />
        );
    } else {
        tableHeadRow = (<tr><th>Загрузка полей пациента...</th></tr>);
        searchBar = (<p>Загрузка полей пациента...</p>);
    }

    tableBodyRows = props.patientsList.map(p => {
        const controls = (<Container>
            <Row>
                <Col>
                    <CustomEditBtn
                        onClick={() => props.onEnterEditor(p, Status.Modified)}
                    />
                </Col>
                <Col>
                    <CustomDeleteBtn
                        onClick={() => props.onEnterEditor(p, Status.Deleted)}
                    />
                </Col>
            </Row>
        </Container>);

        const cells = p.fields
            .map(f => (<td key={f.nameId}>{f.value}</td>))
            .concat(<td key={'controls'}>{controls}</td>);

        return (<tr key={p.id}>{cells}</tr>)
    });

    const columnsCount =
        props.patientTemplate ?
            props.patientTemplate.fields.length :
            1;

    let noPatientsLabel = null;
    if (tableBodyRows.length === 0 && !props.isWaitingPatientsList) {
        noPatientsLabel = (
            <tr key={'noPatientsLabel'}>
                <td colSpan={columnsCount}>Список пуст</td >
            </tr >
        );
    }

    let loadingLabel = null;
    if (props.isWaitingPatientsList) {
        loadingLabel = (<tr><td
            colSpan={columnsCount}
            key={'loadingLabel'}
        >Загрузка списка пациентов...</td></tr>);
    }

    let loadMoreControl = null;
    if (!props.isWaitingPatientsList && props.patientsList.length) {
        loadMoreControl =
            props.canLoadMore ?
                (<Button onClick={() => onLoadMore(props)}>Загрузить ещё</Button>) :
                (<strong>Загружены все найденные результаты</strong>);
    }

    return (
        <Container>
            <Row><Col>{searchBar}</Col></Row>
            <Row><Col>
                <Table className={"table table-responsive table-striped table-bordered"}>
                    <thead className={"thead-dark"}>
                        {tableHeadRow}
                    </thead>
                    <tbody>
                        {tableBodyRows}
                        {noPatientsLabel}
                        {loadingLabel}
                    </tbody>
                </Table>
            </Col></Row>
            <Row><Col>{loadMoreControl}</Col></Row>
        </Container>
    );
}

function onLoadMore(props: SearchTableProps) {
    if (!props.patientTemplate) return;

    let patientTemplate = props.patientTemplate.copy();

    console.log(`search more ${patientTemplate.toString()}`);

    props.onLoadMore(patientTemplate, props.patientsList.length, props.loadPortionCount);
}