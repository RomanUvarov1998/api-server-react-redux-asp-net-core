import React from 'react';
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';
import { TableRaw, RawState } from '../table-raw/table-raw'
import { Patient, FieldValue, SavingStatus } from "../../library/patient";
import * as Actions from '../../store/actions';
import { History } from '../../library/history'
import { SearchTable } from '../search-table/search-table';

export type TableProps = {
    isWaitingPatientsList: boolean,
    isWaitingPatientFields: boolean,
    patientTemplate: Patient | null,
    searchingList: Patient[],
    editingList: Patient[],
    editingPatient: Patient | null,
    history: History<Patient>,
    onAdd: () => Actions.ActionAddPatient,
    onStartEditing: (id: number) => Actions.ActionStartEditingPatient,
    onFinishEditing: (save: boolean) => Actions.ActionFinishEditingPatient,
    onEdit: (id: number, fieldNameId: number, newValue: FieldValue) => Actions.ActionEditPatient,
    onDelete: (id: number) => Actions.ActionDeletePatient,
    onSetSearchTemplate: (fieldNameId: number, newValue: FieldValue) => void,
    onClearTemplate: () => void,
    onUndo: () => Actions.ActionUndo,
    onRedo: () => Actions.ActionRedo,
    clearList: () => void,
    addToEditingList: (patient: Patient) => void,
    canLoadMore: boolean,
    loadCount: number,
    onLoadMore: (template: Patient, loadedCount: number, pageLength: number) => void
}

export class Table extends React.Component<TableProps, {}, {}> {
    render(): React.ReactNode {
        let tableHeadCells;
        let tableBodyRows;
        const isLoadingSomething =
            this.props.isWaitingPatientFields;
        const isSavingSomething = this.props.editingList
            .find(p => p.savingStatus === SavingStatus.Saving) !== undefined;

        if (!this.props.isWaitingPatientFields) {
            if (!this.props.patientTemplate) throw Error("patientTemplate is null");

            tableHeadCells = [
                <th key={"btnEdit"}></th>,
                <th key={"btnDelete"}></th>
            ];
            tableHeadCells.push(...this.props.patientTemplate.fields.map(
                tf => (
                    <th key={tf.nameId}>
                        {tf.name}
                    </th>
                )
            ));
        } else {
            tableHeadCells = (<th><p>Загрузка полей пациента...</p></th>);
        }

        if (this.props.editingList.length > 0) {
            if (!this.props.patientTemplate) throw Error("patientTemplate is null");

            const editingId: number | undefined = this.props.editingPatient?.id;

            tableBodyRows = this.props.editingList
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

                    return (
                        <TableRaw
                            key={ind}
                            patientTemplate={this.props.patientTemplate!}
                            patient={
                                (this.props.editingPatient &&
                                    this.props.editingPatient.id === patient.id) ?
                                    (this.props.editingPatient!) :
                                    patient
                            }
                            editState={editingStatus}
                            onEdit={this.props.onEdit}
                            onStartEditing={this.props.onStartEditing}
                            onFinishEditing={this.props.onFinishEditing}
                            onDelete={this.props.onDelete}
                        />
                    );
                }
                );
        } else {
            tableBodyRows = (
                <tr><td><p>Список редактирования пуст</p></td></tr>
            );
        }

        let canClearList = !this.props.history.hasSomethingToSave();

        return (
            <>
                <SearchTable
                    addToEditingList={this.props.addToEditingList}
                    isWaitingPatientsList={this.props.isWaitingPatientsList}
                    isWaitingPatientFields={this.props.isWaitingPatientFields}
                    patientsList={this.props.searchingList}
                    patientTemplate={this.props.patientTemplate}
                    canLoadMore={this.props.canLoadMore}
                    loadCount={this.props.loadCount}
                    onSetSearchTemplate={this.props.onSetSearchTemplate}
                    onClearTemplate={this.props.onClearTemplate}
                    onLoadMore={this.props.onLoadMore}
                    isInEditingList={p => this.props.editingList.some(ep => ep.equals(p))}
                />
                <h1>Редактирование</h1>
                <ButtonToolbar>
                    <ButtonGroup>
                        <Button
                            onClick={() => this.savePatients()}
                            disabled={
                                isLoadingSomething ||
                                !this.props.history.hasSomethingToSave() ||
                                this.props.editingPatient !== null ||
                                isSavingSomething
                            }
                        >
                            {isSavingSomething ? 'Идет сохранение...' : 'Сохранить изменения'}
                        </Button>
                        <Button
                            onClick={() => this.props.clearList()}
                            disabled={!canClearList || this.props.editingList.length === 0}
                        >Очистить список</Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button
                            onClick={this.props.onUndo}
                            disabled={
                                isLoadingSomething ||
                                !this.props.history.canUndo() ||
                                isSavingSomething
                            }
                        >{"Отменить"}</Button>
                        <Button
                            onClick={() => this.props.onRedo()}
                            disabled={
                                isLoadingSomething ||
                                !this.props.history.canRedo() ||
                                isSavingSomething
                            }
                        >{"Повторить"}</Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button
                            onClick={this.props.onAdd}
                            disabled={
                                isLoadingSomething ||
                                this.props.editingPatient !== null ||
                                isSavingSomething
                            }
                        >Новый</Button>
                    </ButtonGroup>
                </ButtonToolbar>
                <div
                    style={{ maxHeight: 300, overflowY: 'auto', margin: 10 }}
                    onScroll={this.handleScroll}
                >
                    <table className={"table table-responsive table-striped table-bordered table-normal"}>
                        <thead className={"thead-dark"}>
                            <tr>{tableHeadCells}</tr>
                        </thead>
                        <tbody>
                            {tableBodyRows}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }

    private savePatients() {
        (this.props as any).savePatients(this.props.editingList);
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

// function filteredSortedList(
//     patientsList: Patient[],
//     patientTemplate: Patient,
//     editingPatient: Patient | null,
//     sortBy: (p: Patient) => number
// ): Patient[] {
//     const res = patientsList.filter(p => {
//         if (editingPatient && editingPatient.equals(p)) return true;

//         let contains = true;
//         patientTemplate.fields.forEach(tf => {
//             if (!tf.value) return;

//             let foundField = p.fields.find(f => f.nameId === tf.nameId);

//             if (foundField === undefined) return;
//             if (
//                 !foundField.value.toLowerCase().startsWith(tf.value.toLowerCase())
//             ) {
//                 contains = false;
//             }
//         });
//         return contains;
//     });

//     return res.sort(sortBy);
// }