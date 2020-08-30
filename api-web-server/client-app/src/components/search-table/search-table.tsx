import React from 'react';
import { Patient, PatientSearchTemplate } from '../../library/patient'
import { SearchBar } from '../search-bar/search-bar';
import { Button } from 'reactstrap';

export type SearchTableProps = {
    addToEditingList: (patient: Patient) => void,
    isWaitingPatientsList: boolean,
    isWaitingPatientFields: boolean,
    patientsList: Patient[],
    isInEditingList: (patient: Patient) => boolean,
    patientTemplate: PatientSearchTemplate | null,
    canLoadMore: boolean,
    loadCount: number,
    onSetSearchTemplate: (fieldNameId: number, newValue: string) => void,
    onClearTemplate: () => void,
    onLoadMore: (template: PatientSearchTemplate, loadedCount: number, pageLength: number) => void
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
                onClearTemplate={props.onClearTemplate}
            />
        );
    } else {
        tableHeadRow = (<tr><th>Загрузка полей пациента...</th></tr>);
        searchBar = (<p>Загрузка полей пациента...</p>);
    }

    tableBodyRows = props.patientsList.map(p => {
        let btnEdit =
            props.isInEditingList(p) ?
                ('Редактируется') :
                (<Button
                    onClick={() => props.addToEditingList(p)}
                >Редактировать</Button>);

        const cells = p.fields
            .map(f => (<td key={f.nameId}>{f.value}</td>))
            .concat(<td key={'edit'}>{btnEdit}</td>);


        return (<tr key={p.id}>{cells}</tr>)
    });

    const columnsCount =
        props.patientTemplate ?
            props.patientTemplate.fields.length :
            1;

    let noPatientsLable = null;
    if (tableBodyRows.length === 0 && !props.isWaitingPatientsList) {
        noPatientsLable = (
            <tr key={'noPatientsLable'}>
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

    let loadMoreControl = null
    if (!props.isWaitingPatientsList && props.patientsList.length) {
        loadMoreControl =
            props.canLoadMore ?
                (<Button onClick={() => onLoadMore(props)}>Загрузить ещё</Button>) :
                (<strong>Загружены все найденные результаты</strong>)
    }

    return (
        <div style={{ margin: 10 }}>
            {searchBar}
            <div
                style={{ maxHeight: 300, overflowY: 'auto', margin: 10 }}
            >
                <table className={"table table-responsive table-striped table-bordered table-normal"}>
                    <thead className={"thead-dark"}>
                        {tableHeadRow}
                    </thead>
                    <tbody>
                        {tableBodyRows}
                        {noPatientsLable}
                        {loadingLable}
                    </tbody>
                </table>
                {loadMoreControl}
            </div>
        </div>
    );
}

function onLoadMore(props: SearchTableProps) {
    if (!props.patientTemplate) return;

    let patientTemplate = props.patientTemplate.copy();

    console.log(`search more ${patientTemplate.toString()}`);

    props.onLoadMore(patientTemplate, props.patientsList.length, props.loadCount);
}