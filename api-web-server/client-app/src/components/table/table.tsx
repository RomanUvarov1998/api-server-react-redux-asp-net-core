import React from 'react';
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';
import { TableRaw, RawState } from '../table-raw/table-raw'
import { Patient, FieldValue, FieldName, SavingStatus } from "../../library/patient";
import { SearchBar } from '../search-bar/search-bar';
import * as Actions from '../../store/actions';
import { History } from '../../library/history'

export type TableProps = {
    isWaitingPatientsList: boolean,
    isWaitingPatientFields: boolean,
    patientTemplate: Patient | null,
    patientsList: Patient[],
    editingPatient: Patient | null,
    history: History<Patient>,
    onAdd: () => Actions.ActionAddPatient,
    onStartEditing: (id: number) => Actions.ActionStartEditingPatient,
    onFinishEditing: (save: boolean) => Actions.ActionFinishEditingPatient,
    onEdit: (id: number, fieldName: FieldName, newValue: FieldValue) => Actions.ActionEditPatient,
    onDelete: (id: number) => Actions.ActionDeletePatient,
    onSetSearchTemplate: (fieldName: FieldName, newValue: FieldValue) => Actions.ActionSetSearchTemplate,
    onUndo: () => Actions.ActionUndo,
    onRedo: () => Actions.ActionRedo
}

export class Table extends React.Component<TableProps, {}, {}> {
    render(): React.ReactNode {
        let searchBar;
        let tableHeaderCells;
        let tableRows;
        const isLoadingSomething =
            this.props.isWaitingPatientFields ||
            this.props.isWaitingPatientsList;
        const isSavingSomething = this.props.patientsList
            .find(p => p.savingStatus === SavingStatus.Saving) !== undefined;

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
                    frozen={this.props.editingPatient !== null || isSavingSomething}
                    patientTemplate={this.props.patientTemplate}
                    onSetSearchTemplate={this.props.onSetSearchTemplate}
                />
            );
        } else {
            tableHeaderCells = (<th><p>Загрузка полей пациента...</p></th>);
            searchBar = (<p>Загрузка полей пациента...</p>);
        }

        if (!this.props.isWaitingPatientsList) {
            if (!this.props.patientTemplate) throw Error("patientTemplate is null");

            const editingId: number | undefined = this.props.editingPatient?.id;

            tableRows = filteredSortedList(
                this.props.patientsList,
                this.props.patientTemplate as Patient,
                this.props.editingPatient,
                p => p.id
            )
                .map((patient, ind) => {
                    let editingStatus: RawState;

                    if (isSavingSomething) {
                        editingStatus = RawState.Frozen;
                    } else if (editingId) {
                        editingStatus =
                            (editingId === patient.id) ?
                                RawState.Editing :
                                RawState.Frozen;
                    } else {
                        editingStatus = RawState.Saved;
                    }

                    return (<TableRaw
                        key={ind}
                        patientTemplate={this.props.patientTemplate as Patient}
                        patient={
                            (this.props.editingPatient &&
                                this.props.editingPatient.id === patient.id) ?
                                (this.props.editingPatient as Patient) :
                                patient
                        }
                        editState={editingStatus}
                        onEdit={this.props.onEdit}
                        onStartEditing={this.props.onStartEditing}
                        onFinishEditing={this.props.onFinishEditing}
                        onDelete={this.props.onDelete}
                    />)
                }
                );
        } else {
            tableRows = (
                <tr><td><p>Загрузка списка пациентов...</p></td></tr>
            );
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
                            disabled={
                                isLoadingSomething ||
                                !this.props.history.canSave() ||
                                this.props.editingPatient !== null ||
                                isSavingSomething
                            }
                        >
                            {isSavingSomething ? 'Идет сохранение...' : 'Сохранить изменения'}
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button
                            onClick={this.props.onUndo}
                            disabled={
                                isLoadingSomething ||
                                !this.props.history.canUndo() ||
                                isSavingSomething
                            }
                        >{"<-"}</Button>
                        <Button
                            onClick={() => this.props.onRedo()}
                            disabled={
                                isLoadingSomething ||
                                !this.props.history.canRedo() ||
                                isSavingSomething
                            }
                        >{"->"}</Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button
                            onClick={this.props.onAdd}
                            disabled={
                                isLoadingSomething ||
                                this.props.editingPatient !== null ||
                                isSavingSomething
                            }
                        >Добавить</Button>
                    </ButtonGroup>
                </ButtonToolbar>
                <div
                    style={{ maxHeight: 300, overflowY: 'auto', margin: 10 }}
                    onScroll={this.handleScroll}
                >
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
                </div>
            </div >
        );
    }

    private savePatients() {
        this.props.history.onSave();
        (this.props as any).savePatients(this.props.patientsList);
    }

    private loadedHeight: number = 0;
    private handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const scrolledHeight = (e.currentTarget as any).scrollTop + (e.currentTarget as any).clientHeight;
        if (scrolledHeight > this.loadedHeight) {
            this.loadedHeight = scrolledHeight;
            //console.log(`loaded to ${this.loadedHeight}`);
        }
        //console.log(e.currentTarget);
    }
}

function filteredSortedList(
    patientsList: Patient[],
    patientTemplate: Patient,
    editingPatient: Patient | null,
    sortBy: (p: Patient) => number
): Patient[] {
    const res = patientsList.filter(p => {
        if (editingPatient && editingPatient.equals(p)) return true;

        let contains = true;
        patientTemplate.fields.forEach(tf => {
            if (!tf.value) return;

            let foundField = p.fields.find(f => f.name === tf.name);

            if (foundField === undefined) return;
            if (
                !foundField.value.toLowerCase().startsWith(tf.value.toLowerCase())
            ) {
                contains = false;
            }
        });
        return contains;
    });

    return res.sort(sortBy);
}