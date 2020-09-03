import React from 'react';
import classnames from 'classnames';
import { Button, ButtonGroup, ButtonToolbar, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { TableRaw, RawState } from '../table-raw/table-raw'
import { PatientVM, FieldValue, SavingStatus, PatientSearchTemplateVM } from "../../library/patient";
import * as Actions from '../../store/actions';
import { SearchTable } from '../search-table/search-table';

export type TableProps = {
    tabNum: TabNums,
    onTabChange: (newTabNum: TabNums) => void,

    isWaitingPatientsList: boolean,
    isWaitingPatientFields: boolean,

    patientTemplate: PatientSearchTemplateVM | null,
    searchingList: PatientVM[],
    canLoadMore: boolean,
    loadCount: number,
    onLoadMore: (template: PatientSearchTemplateVM, loadedCount: number, pageLength: number) => void,
    onSetSearchTemplate: (fieldNameId: number, newValue: FieldValue) => void,
    giveVariants: (fieldNameId: number, variants: string[]) => void,
    onClearTemplate: () => void,
    addToEditingList: (patient: PatientVM) => void,

    editingList: PatientVM[],
    onAdd: (filledTemplate?: PatientSearchTemplateVM | undefined) => Actions.ActionAddPatient,
    onEdit: (patientCopy: PatientVM, fieldNameId: number, newValue: FieldValue) => Actions.ActionEditPatient,
    onDelete: (id: number) => Actions.ActionDeletePatient,
    savePatients: (patients: PatientVM[]) => Actions.ActionStartSaving,
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

            tableHeadCells = this.props.patientTemplate!.fields.map(
                tf => (<th key={tf.nameId}>{tf.name}</th>));
        } else {
            tableHeadCells = (<th><p>Загрузка полей пациента...</p></th>);
        }

        if (this.props.editingList.length > 0) {
            if (!this.props.patientTemplate) throw Error("patientTemplate is null");

            tableBodyRows = this.props.editingList
                .map((patient, ind) => {
                    const editingStatus =
                        isSavingSomething ?
                            RawState.Frozen :
                            RawState.Editing;

                    return (
                        <TableRaw
                            key={ind}
                            patientTemplate={this.props.patientTemplate!}
                            patient={patient}
                            editState={editingStatus}
                            onEdit={this.props.onEdit}
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

        const el = this.props.editingList.length;
        const editingTabLabel = el ? `Редактирование (${el})` : 'Редактирование';

        return (
            <>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.props.tabNum === TabNums.Searching })}
                            onClick={() => this.props.onTabChange(TabNums.Searching)}
                            style={{ cursor: "pointer" }}
                        >Поиск</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.props.tabNum === TabNums.Editing })}
                            onClick={() => this.props.onTabChange(TabNums.Editing)}
                            style={{ cursor: "pointer" }}
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
                            giveVariants={this.props.giveVariants}
                            onClearTemplate={this.props.onClearTemplate}
                            onLoadMore={this.props.onLoadMore}
                            isInEditingList={p => this.props.editingList.some(ep => ep.equals(p))}
                            onAdd={this.props.onAdd}
                        />
                    </TabPane>
                    <TabPane
                        tabId={TabNums.Editing}
                        style={{ margin: 10 }}
                    >
                        <h1>Редактирование</h1>
                        <ButtonToolbar>
                            <ButtonGroup>
                                <Button
                                    onClick={() => this.props
                                        .savePatients(this.props.editingList)}
                                    disabled={
                                        isLoadingSomething ||
                                        isSavingSomething
                                    }
                                >
                                    {isSavingSomething ? 'Идет сохранение...' : 'Сохранить изменения'}
                                </Button>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Button
                                    onClick={() => this.props.onAdd()}
                                    disabled={
                                        isLoadingSomething ||
                                        isSavingSomething
                                    }
                                >Добавить</Button>
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

    // private cellFocusHandler = (id: number) => {
    //     if (this.props.editingPatient && this.props.editingPatient.id !== id) {
    //         this.props.onFinishEditing(true);
    //         this.props.onStartEditing(id);
    //     } else if (!this.props.editingPatient) {
    //         this.props.onStartEditing(id);
    //     }
    // }

    // private cellBlurHandler = () => {
    //     if (!this.props.editingPatient) throw new Error('No editing patient!');
    //     this.props.onFinishEditing(true);
    // }
}