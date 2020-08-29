import { connect } from 'react-redux'
import { Patient, FieldValue } from '../../library/patient';
import { History } from '../../library/history';
import * as Actions from '../../store/actions';
import { Table, TabNums } from '../table/table';

export type TableContainerState = {
    tabNum: TabNums,

    isWaitingPatientsList: boolean,
    isWaitingPatientFields: boolean,

    searchingList: Patient[],
    patientTemplate: Patient | null,
    canLoadMore: boolean,
    loadCount: number,

    editingList: Patient[],
    editingPatient: Patient | null,
    history: History<Patient>,
}
export type TableContainerDispatchProps = {
    onTabChange: (newTabNum: TabNums) => void,
    onAdd: () => Actions.ActionAddPatient,
    onStartEditing: (id: number) => Actions.ActionStartEditingPatient,
    onFinishEditing: (save: boolean) => Actions.ActionFinishEditingPatient,
    onEdit: (id: number, fieldNameId: number, newValue: FieldValue) => Actions.ActionEditPatient,
    onDelete: (id: number) => Actions.ActionDeletePatient,
    onUndo: () => Actions.ActionUndo,
    onRedo: () => Actions.ActionRedo,
    addToEditingList: (patient: Patient) => Actions.ActionAddPatientToEditList,
    clearList: () => Actions.ActionClearList,
    onLoadMore: () => Actions.ActionLoadMorePatients
}
export type TableContainerProps = {    
    onSetSearchTemplate: (fieldNameId: number, newValue: string) => void,
    onClearTemplate: () => void,
    onLoadMore: () => void,

    savePatients: (list: Patient[]) => void,
    clearList: () => void,
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
    onAdd: Actions.add,
    onStartEditing: Actions.startEditing,
    onFinishEditing: Actions.finishEditing,
    onEdit: Actions.edit,
    onDelete: Actions.del,
    onUndo: Actions.undo,
    onRedo: Actions.redo,
    addToEditingList: Actions.addPatientToEditList,
    clearList: Actions.clearList,
    onLoadMore: Actions.loadMorePatients
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