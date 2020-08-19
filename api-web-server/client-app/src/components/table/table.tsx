import * as React from "react"
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';
import { TableRaw, RawState } from '../table-raw/table-raw'
import { Patient, FieldValue, FieldName, filteredSortedList } from "../../library/patient";
import { SearchBar } from '../search-bar/search-bar'
import * as Actions from '../../store/actions';
import { History } from '../../library/history'

export type TableProps = {
    isWaitingPatientsList: boolean,
    isWaitingPatientFields: boolean,
    patientTemplate: Patient,
    patientsList: Patient[],
    editingId: number,
    editingPatient: Patient | null,
    history: History<Patient, string>,
    onAdd: () => Actions.ActionAddPatient,
    onStartEditing: (id: number) => Actions.ActionStartEditingPatient,
    onEdit: (id: number, fieldName: FieldName, newValue: FieldValue) => Actions.ActionEditPatient,
    onDelete: (id: number) => Actions.ActionDeletePatient,
    onSetSearchTemplate: (fieldName: FieldName, newValue: FieldValue) => Actions.ActionSetSearchTemplate,
    onUndo: () => Actions.ActionUndo,
    onRedo: () => Actions.ActionRedo
}

export class Table extends React.Component<TableProps, {}, {}> {
    render(): React.ReactNode {
        var searchBar;
        var tableHeaderCells;
        var tableRows;
        var isLoadingSomething = false;

        if (!this.props.isWaitingPatientFields) {
            if (!this.props.patientTemplate) throw Error("patientTemplate is null");

            tableHeaderCells = [
                <th key={"btnEdit"}></th>,
                <th key={"btnDelete"}></th>
            ];
            tableHeaderCells.push(...this.props.patientTemplate.fields.map(
                tf => (
                    <th key={tf.name}>
                        {tf.name}
                    </th>
                )
            ));
            searchBar = (
                <SearchBar
                    frozen={this.props.editingId > 0}
                    patientTemplate={this.props.patientTemplate}
                    onSetSearchTemplate={this.props.onSetSearchTemplate}
                />
            );
        } else {
            tableHeaderCells = (<th><p>Загрузка полей пациента...</p></th>);
            searchBar = (<p>Загрузка полей пациента...</p>);
            isLoadingSomething = true;
        }

        if (!this.props.isWaitingPatientsList) {
            if (!this.props.patientTemplate) throw Error("patientTemplate is null");

            tableRows = filteredSortedList(
                this.props.patientsList,
                this.props.patientTemplate,
                p => p.localId === this.props.editingId,
                p => p.localId
            )
                .map((patient, ind) =>
                    (<TableRaw
                        key={ind}
                        patientTemplate={this.props.patientTemplate}
                        patient={
                            this.props.editingId === patient.localId ?
                                (this.props.editingPatient as Patient) :
                                patient
                        }
                        editState={getRawState(this.props.editingId, patient.localId)}
                        onEdit={this.props.onEdit}
                        onStartEditing={this.props.onStartEditing}
                        onDelete={this.props.onDelete}
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
                            onClick={e => this.savePatients()}
                            disabled={isLoadingSomething || !this.props.history.isEmpty() || this.props.editingId > 0}
                        >Сохранить изменения</Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button
                            onClick={this.props.onUndo}
                            disabled={isLoadingSomething || !this.props.history.canUndo()}
                        >{"<-"}</Button>
                        <Button
                            onClick={() => this.props.onRedo()}
                            disabled={isLoadingSomething || !this.props.history.canRedo()}
                        >{"->"}</Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button
                            onClick={this.props.onAdd}
                            disabled={isLoadingSomething || this.props.editingId > 0}
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
    private savePatients() {
        let ids = this.props.history.getIdsToDelete();
        (this.props as any)
            .savePatients(
                this.props.patientsList,
                ids
            );
    }
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

