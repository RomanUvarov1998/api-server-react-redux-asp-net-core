import React from 'react';
import classnames from 'classnames';
import { Button, ButtonGroup, ButtonToolbar, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { TableRaw, RawState } from '../table-raw/table-raw'
import { Patient, FieldValue, SavingStatus } from "../../library/patient";
import * as Actions from '../../store/actions';
import { History } from '../../library/history'
import { SearchTable } from '../search-table/search-table';

export type TableProps = {
    tabNum: TabNums,
    onTabChange: (newTabNum: TabNums) => void,

    isWaitingPatientsList: boolean,
    isWaitingPatientFields: boolean,

    patientTemplate: Patient | null,
    searchingList: Patient[],
    canLoadMore: boolean,
    loadCount: number,
    onLoadMore: (template: Patient, loadedCount: number, pageLength: number) => void,
    onSetSearchTemplate: (fieldNameId: number, newValue: FieldValue) => void,
    onClearTemplate: () => void,
    addToEditingList: (patient: Patient) => void,

    editingList: Patient[],
    editingPatient: Patient | null,
    history: History<Patient>,
    onAdd: () => Actions.ActionAddPatient,
    onStartEditing: (id: number) => Actions.ActionStartEditingPatient,
    onFinishEditing: (save: boolean) => Actions.ActionFinishEditingPatient,
    onEdit: (id: number, fieldNameId: number, newValue: FieldValue) => Actions.ActionEditPatient,
    onDelete: (id: number) => Actions.ActionDeletePatient,
    onUndo: () => Actions.ActionUndo,
    onRedo: () => Actions.ActionRedo,
    clearList: () => void
}

export enum TabNums {
    Searching,
    Editing
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
            let pt = this.props.patientTemplate;
            tableBodyRows = (
                <tr><td colSpan={pt ? (pt.fields.length + 2) : 0}><p>Список редактирования пуст</p></td></tr>
            );
        }

        const canClearList = !this.props.history.hasSomethingToSave();
        const el = this.props.editingList.length;
        const editingTabLabel = el ? `Редактирование (${el})` : 'Редактирование';

        return (
            <>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.props.tabNum === TabNums.Searching })}
                            onClick={() => this.props.onTabChange(TabNums.Searching)}
                        >Поиск</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.props.tabNum === TabNums.Editing })}
                            onClick={() => this.props.onTabChange(TabNums.Editing)}
                        >{editingTabLabel}</NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.props.tabNum}>
                    <TabPane tabId={TabNums.Searching}>
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
                    </TabPane>
                    <TabPane tabId={TabNums.Editing}>
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
                    </TabPane>
                </TabContent>
            </>
        );
    }

    private savePatients() {
        (this.props as any).savePatients(this.props.editingList);
    }
}