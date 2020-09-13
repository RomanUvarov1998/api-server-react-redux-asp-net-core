import { connect } from 'react-redux'
import { PatientVM, FieldValue, PatientSearchTemplateVM, PatientEditingVM } from '../../library/patient';
import * as Actions from '../../store/actions';
import { PatientManager } from '../patients-manager';
import { Status } from '../../library/history';

export type MainContainerState = {
    isWaitingPatientsList: boolean,
    isWaitingPatientFields: boolean,

    isEditingPatientTemplate: boolean,
    searchingList: PatientVM[],
    patientTemplate?: PatientSearchTemplateVM,
    canLoadMore: boolean,
    loadPortionCount: number,

    editingPatient?: PatientEditingVM

    errorsLog: string[]
}
const mapStateToProps = (state: MainContainerState): MainContainerState => {
    return {
        isWaitingPatientFields: state.isWaitingPatientFields,
        isWaitingPatientsList: state.isWaitingPatientsList, 

        isEditingPatientTemplate: state.isEditingPatientTemplate,
        searchingList: state.searchingList,
        patientTemplate: state.patientTemplate,
        canLoadMore: state.canLoadMore, 
        loadPortionCount: state.loadPortionCount, 

        editingPatient: state.editingPatient,

        errorsLog: state.errorsLog
    }
};

export type TableContainerDispatchProps = {
    onSetSearchTemplate: (fieldNameId: number, newValue: FieldValue) => Actions.ActionSetSearchTemplate,
    giveVariants: (fieldNameId: number, variants: string[]) => Actions.ActionGiveVariants,
    onClearSearchTemplate: () => Actions.ActionClearSearchTemplate,
    onLoadMorePatients: (template: PatientSearchTemplateVM, loadedCount: number, pageLength: number) => Actions.ActionLoadMorePatients,

    onEnterPatientEditor: (patient: PatientEditingVM) => Actions.ActionEnterPatientEditor,
    onExitPatientEditor: (status?: Status, patient?: PatientVM) => Actions.ActionExitPatientEditor,

    onStartEditPatientTemplate: () => Actions.ActionStartEditPatientTemplate,
    onFinishEditPatientTemplate: (newTemplate?: PatientSearchTemplateVM) => Actions.ActionFinishEditPatientTemplate,
}
const mapDispatchToProps: TableContainerDispatchProps = {
    onSetSearchTemplate: Actions.setSearchTemplate,
    giveVariants: Actions.giveVariants,
    onClearSearchTemplate: Actions.clearSearchTemplate,
    onLoadMorePatients: Actions.loadMorePatients,

    onEnterPatientEditor: Actions.enterPatientEditor,
    onExitPatientEditor: Actions.exitPatientEditor,

    onStartEditPatientTemplate: Actions.startEditPatientTemplate,
    onFinishEditPatientTemplate: Actions.finishEditPatientTemplate
};

export type MainContainerProps = {    
    
}

function mergeProps(
    stateProps: MainContainerState,
    dispatchProps: TableContainerDispatchProps,
    ownProps: MainContainerProps
) {
    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps
    };
};

export const MainContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(PatientManager);