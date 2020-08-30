import { connect } from 'react-redux'
import { Patient, FieldValue, PatientSearchTemplate } from '../../library/patient';
import { History } from '../../library/history';
import * as Actions from '../../store/actions';
import { Table, TabNums } from '../table/table';

export type TableContainerState = {
    tabNum: TabNums,

    isWaitingPatientsList: boolean,
    isWaitingPatientFields: boolean,

    searchingList: Patient[],
    patientTemplate: PatientSearchTemplate | null,
    canLoadMore: boolean,
    loadCount: number,

    editingList: Patient[],
    editingPatient: Patient | null,
    history: History<Patient>,
}
export type TableContainerDispatchProps = {
    onTabChange: (newTabNum: TabNums) => void,

    onLoadMore: (template: PatientSearchTemplate, loadedCount: number, pageLength: number) => void,
    onSetSearchTemplate: (fieldNameId: number, newValue: FieldValue) => void,
    giveVariants: (fieldNameId: number, variants: string[]) => void,
    onClearTemplate: () => void,
    addToEditingList: (patient: Patient) => void,

    onAdd: () => Actions.ActionAddPatient,
    onStartEditing: (id: number) => Actions.ActionStartEditingPatient,
    onFinishEditing: (save: boolean) => Actions.ActionFinishEditingPatient,
    onEdit: (id: number, fieldNameId: number, newValue: FieldValue) => Actions.ActionEditPatient,
    onDelete: (id: number) => Actions.ActionDeletePatient,
    onUndo: () => Actions.ActionUndo,
    onRedo: () => Actions.ActionRedo,
    savePatients: (patients: Patient[]) => Actions.ActionStartSaving,
    clearList: () => Actions.ActionClearList
}
export type TableContainerProps = {    
    
}

const mapStateToProps = (state: TableContainerState): TableContainerState => {
    return {
        tabNum: state.tabNum,

        isWaitingPatientFields: state.isWaitingPatientFields,
        isWaitingPatientsList: state.isWaitingPatientsList, 

        searchingList: state.searchingList,
        patientTemplate: state.patientTemplate,
        canLoadMore: state.canLoadMore, 
        loadCount: state.loadCount, 

        editingList: state.editingList,
        editingPatient: state.editingPatient,
        history: state.history,
    }
};

const mapDispatchToProps: TableContainerDispatchProps = {
    onTabChange: Actions.changeTab,

    onLoadMore: Actions.loadMorePatients,
    onSetSearchTemplate: Actions.setSearchTemplate,
    giveVariants: Actions.giveVariants,
    onClearTemplate: Actions.clearSearchTemplate,
    addToEditingList: Actions.addPatientToEditList,

    onAdd: Actions.add,
    onStartEditing: Actions.startEditing,
    onFinishEditing: Actions.finishEditing,
    onEdit: Actions.edit,
    onDelete: Actions.del,
    onUndo: Actions.undo,
    onRedo: Actions.redo,
    savePatients: Actions.startSaving,
    clearList: Actions.clearList,
};

function mergeProps(
    stateProps: TableContainerState,
    dispatchProps: TableContainerDispatchProps,
    ownProps: TableContainerProps
) {
    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps
    };
};

export const TableContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Table);