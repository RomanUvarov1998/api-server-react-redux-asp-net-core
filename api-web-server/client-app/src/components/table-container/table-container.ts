import { connect } from 'react-redux'
import { PatientVM, FieldValue, PatientSearchTemplateVM } from '../../library/patient';
import { History } from '../../library/history';
import * as Actions from '../../store/actions';
import { Table, TabNums } from '../table/table';

export type TableContainerState = {
    tabNum: TabNums,

    isWaitingPatientsList: boolean,
    isWaitingPatientFields: boolean,

    searchingList: PatientVM[],
    patientTemplate: PatientSearchTemplateVM | null,
    canLoadMore: boolean,
    loadCount: number,

    editingList: PatientVM[],
    editingPatient: PatientVM | null,
    history: History<PatientVM>,
}
export type TableContainerDispatchProps = {
    onTabChange: (newTabNum: TabNums) => void,

    onLoadMore: (template: PatientSearchTemplateVM, loadedCount: number, pageLength: number) => void,
    onSetSearchTemplate: (fieldNameId: number, newValue: FieldValue) => void,
    giveVariants: (fieldNameId: number, variants: string[]) => void,
    onClearTemplate: () => void,
    addToEditingList: (patient: PatientVM) => void,

    onAdd: (filledTemplate?: PatientSearchTemplateVM | undefined) => Actions.ActionAddPatient,
    onStartEditing: (id: number) => Actions.ActionStartEditingPatient,
    onFinishEditing: (save: boolean) => Actions.ActionFinishEditingPatient,
    onEdit: (id: number, fieldNameId: number, newValue: FieldValue) => Actions.ActionEditPatient,
    onDelete: (id: number) => Actions.ActionDeletePatient,
    onUndo: () => Actions.ActionUndo,
    onRedo: () => Actions.ActionRedo,
    savePatients: (patients: PatientVM[]) => Actions.ActionStartSaving,
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