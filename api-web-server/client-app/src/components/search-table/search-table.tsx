import React from 'react';
import { Patient } from '../../library/patient'
import { SearchBar } from '../search-bar/search-bar';
import { Button } from 'reactstrap';

export type SearchTableProps = {
    addToEditingList: (patient: Patient) => void,
    isWaitingPatientsList: boolean,
    isWaitingPatientFields: boolean,
    patientsList: Patient[],
    isInEditingList: (patient: Patient) => boolean,
    patientTemplate: Patient | null,
    canLoadMore: boolean,
    loadCount: number,
    onSetSearchTemplate: (fieldNameId: number, newValue: string) => void,
    onClearTemplate: () => void,
    onLoadMore: (template: Patient, loadedCount: number, pageLength: number) => void
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

    if (!props.isWaitingPatientsList) {
        if (!props.patientTemplate) throw Error("patientTemplate is null");

        tableBodyRows =
            props.patientsList.length > 0 ?
                (
                    props.patientsList.map(p => {
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
                    })
                ) :
                (<tr><td>Список пуст</td></tr>);
    } else {
        let pt = props.patientTemplate;
        tableBodyRows = (<tr><td colSpan={pt ? pt.fields.length : 1}>Загрузка списка пациентов...</td></tr>);
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
                    </tbody>
                </table>
                {
                    props.canLoadMore ?
                        (<Button onClick={() => onLoadMore(props)}>Загрузить ещё</Button>) :
                        (<strong>Загружены все найденные результаты</strong>)
                }
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