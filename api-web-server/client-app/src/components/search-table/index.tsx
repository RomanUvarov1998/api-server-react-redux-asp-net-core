import React from 'react';
import { PatientVM, PatientSearchTemplateVM } from '../../library/patient'
import { SearchBar } from '../search-bar';
import { Button, Table } from 'reactstrap';
import { Status } from '../../library/history';

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
    onEnterEditor: (patient: PatientVM | undefined) => void,
    onDelete: (id: number) => void
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
            />
        );
    } else {
        tableHeadRow = (<tr><th>Загрузка полей пациента...</th></tr>);
        searchBar = (<p>Загрузка полей пациента...</p>);
    }

    tableBodyRows = props.patientsList.map(p => {
        let deleteControl;

        if (p.status === Status.Deleted) {
            deleteControl = (<td key={'delete'}>Удаление...</td>);
        } else {
            deleteControl = (<td key={'delete'}><Button
                onClick={() => {
                    p.status = Status.Deleted;
                    props.onDelete(p.id);
                }}
            >Удалить</Button></td>);
        }

        const cells = p.fields
            .map(f => (<td key={f.nameId}>{f.value}</td>))
            .concat(
                (<td key={'edit'}><Button
                    onClick={() => {
                        p.status = Status.Modified;
                        props.onEnterEditor(p);
                    }}
                >Редактировать</Button></td>),
                deleteControl
            );


        return (<tr key={p.id}>{cells}</tr>)
    });

    const columnsCount =
        props.patientTemplate ?
            props.patientTemplate.fields.length :
            1;

    let noPatientsLable = null;
    if (tableBodyRows.length === 0 && !props.isWaitingPatientsList) {
        noPatientsLable = (
            <tr key={'noPatientsLabel'}>
                <td colSpan={columnsCount}>Список пуст</td >
            </tr >
        );
    }

    let loadingLable = null;
    if (props.isWaitingPatientsList) {
        loadingLable = (<tr><td
            colSpan={columnsCount}
            key={'loadingLable'}
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
        <div style={{ margin: 10 }}>
            {searchBar}
            <div
                style={{ marginTop: 10 }}
            >
                <Table className={"table table-responsive table-striped table-bordered table-normal"}>
                    <thead className={"thead-dark"}>
                        {tableHeadRow}
                    </thead>
                    <tbody>
                        {tableBodyRows}
                        {noPatientsLable}
                        {loadingLable}
                    </tbody>
                </Table>
                {loadMoreControl}
            </div>
        </div>
    );
}

function onLoadMore(props: SearchTableProps) {
    if (!props.patientTemplate) return;

    let patientTemplate = props.patientTemplate.copy();

    console.log(`search more ${patientTemplate.toString()}`);

    props.onLoadMore(patientTemplate, props.patientsList.length, props.loadPortionCount);
}