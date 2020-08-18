import * as React from "react"
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';
import { TableRaw, RawState } from '../table-raw/table-raw'
import { Patient, FieldValue, FieldName, filteredList } from "../../library/patient";
import { SearchBar } from '../search-bar/search-bar'
import * as Actions from '../../store/actions';
import { History } from '../../library/history'

export type TableProps = {
    isWaitingPatientsList: boolean,
    isWaitingPatientFields: boolean,
    patientTemplate: Patient,
    patientsList: Patient[],
    editingId: number,
    history: History<Patient>,
    onAdd: () => Actions.ActionAddPatient,
    onStartEditing: (id: number) => Actions.ActionStartEditingPatient,
    onEdit: (id: number, fieldName: FieldName, newValue: FieldValue) => Actions.ActionEditPatient,
    onDelete: (id: number) => Actions.ActionDeletePatient,
    onSetSearchTemplate: (fieldName: FieldName, newValue: FieldValue) => Actions.ActionSetSearchTemplate,
    onUndo: () => Actions.ActionUndo,
    onRedo: () => Actions.ActionRedo,
}

export function Table(props: TableProps): React.ReactNode {
    var searchBar;
    var tableHeaderCells;
    var tableRows;
    var isLoadingSomething = false;

    if (!props.isWaitingPatientFields) {
        if (!props.patientTemplate) throw Error("patientTemplate is null");

        tableHeaderCells = [
            <th key={"btnEdit"}></th>,
            <th key={"btnDelete"}></th>
        ];
        tableHeaderCells.push(...props.patientTemplate.fields.map(
            tf => (
                <th key={tf.name}>
                    {tf.name}
                </th>
            )
        ));
        searchBar = (
            <SearchBar
                frozen={props.editingId > 0}
                patientTemplate={props.patientTemplate}
                onSetSearchTemplate={props.onSetSearchTemplate}
            />
        );
    } else {
        tableHeaderCells = (<th><p>Загрузка полей пациента...</p></th>);
        searchBar = (<p>Загрузка полей пациента...</p>);
        isLoadingSomething = true;
    }

    if (!props.isWaitingPatientsList) {
        if (!props.patientTemplate) throw Error("patientTemplate is null");

        tableRows = filteredList(
            props.patientsList,
            props.patientTemplate,
            p => p.id === props.editingId
        )
            .map((patient, ind) =>
                (<TableRaw
                    key={ind}
                    patientTemplate={props.patientTemplate}
                    patient={patient}
                    editState={getRawState(props.editingId, patient.id)}
                    onEdit={props.onEdit}
                    onStartEditing={props.onStartEditing}
                    onDelete={props.onDelete}
                />)
            );
    } else {
        tableRows = (
            <tr><td><p>Загрузка списка пациентов...</p></td></tr>
        );
        isLoadingSomething = true;
    }

    return (
        <div>
            <h1>Поиск:</h1>
            {searchBar}
            <h1>Пациенты:</h1>
            <ButtonToolbar>
                <ButtonGroup>
                    <Button
                        onClick={() => props.onUndo()}
                        disabled={isLoadingSomething || !props.history.canUndo()}
                    >{"<-"}</Button>
                    <Button
                        onClick={() => props.onRedo()}
                        disabled={isLoadingSomething || !props.history.canRedo()}
                    >{"->"}</Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button
                        onClick={() => props.onAdd()}
                        disabled={isLoadingSomething || props.editingId > 0}
                    >Добавить</Button>
                </ButtonGroup>
            </ButtonToolbar>
            <table className={"table table-responsive table-striped table-bordered table-normal"}>
                <thead className={"thead-dark"}>
                    <tr>
                        {tableHeaderCells}
                    </tr>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
            </table>
        </div >
    );
}

function getRawState(editingId: number, patientId: number): RawState {
    if (editingId !== patientId) {
        return (
            editingId ?
                RawState.Frozen :
                RawState.Saved
        );
    } else {
        return RawState.Editing;
    }
}

