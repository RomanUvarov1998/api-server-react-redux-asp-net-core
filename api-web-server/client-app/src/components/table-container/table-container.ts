import { connect } from 'react-redux'
import { PatientVM, FieldValue, PatientSearchTemplateVM } from '../../library/patient';
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

    editingList: PatientVM[]
}
export type TableContainerDispatchProps = {
    onTabChange: (newTabNum: TabNums) => void,

    onLoadMore: (template: PatientSearchTemplateVM, loadedCount: number, pageLength: number) => void,
    onSetSearchTemplate: (fieldNameId: number, newValue: FieldValue) => void,
    giveVariants: (fieldNameId: number, variants: string[]) => void,
    onClearTemplate: () => void,
    addToEditingList: (patient: PatientVM) => void,

    onAdd: (filledTemplate?: PatientSearchTemplateVM | undefined) => Actions.ActionAddPatient,
    onEdit: (patientCopy: PatientVM, fieldNameId: number, newValue: FieldValue) => Actions.ActionEditPatient,
    onDelete: (id: number) => Actions.ActionDeletePatient,
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

        editingList: state.editingList
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
    onEdit: Actions.edit,
    onDelete: Actions.del,
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