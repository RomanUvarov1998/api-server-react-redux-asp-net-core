import { connect } from 'react-redux'
import { PatientVM, FieldValue, PatientSearchTemplateVM } from '../../library/patient';
import * as Actions from '../../store/actions';
import { PatientManager } from '../patients-manager';
import { Status } from '../../library/history';

export type MainContainerState = {
    isWaitingPatientsList: boolean,
    isWaitingPatientFields: boolean,

    isEditingPatientTemplate: boolean,
    searchingList: PatientVM[],
    patientTemplate: PatientSearchTemplateVM | null,
    canLoadMore: boolean,
    loadPortionCount: number,

    editingPatient: PatientVM | null,
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
    }
};

export type TableContainerDispatchProps = {
    onSetSearchTemplate: (fieldNameId: number, newValue: FieldValue) => Actions.ActionSetSearchTemplate,
    giveVariants: (fieldNameId: number, variants: string[]) => Actions.ActionGiveVariants,
    onClearSearchTemplate: () => Actions.ActionClearSearchTemplate,
    onLoadMorePatients: (template: PatientSearchTemplateVM, loadedCount: number, pageLength: number) => Actions.ActionLoadMorePatients,

    onEnterEditor: (patient: PatientVM | undefined, status: Status) => Actions.ActionEnterEditor,
    onExitEditor: (patient: PatientVM | undefined) => Actions.ActionExitEditor,
    onConfirmSavingResult: () => Actions.ActionConfirmSavingResult

    onStartEditPatientTemplate: () => Actions.ActionStartEditPatientTemplate,
    onFinishEditPatientTemplate: (save: boolean, newTemplate: PatientSearchTemplateVM) => Actions.ActionFinishEditPatientTemplate,
}
const mapDispatchToProps: TableContainerDispatchProps = {
    onSetSearchTemplate: Actions.setSearchTemplate,
    giveVariants: Actions.giveVariants,
    onClearSearchTemplate: Actions.clearSearchTemplate,
    onLoadMorePatients: Actions.loadMorePatients,

    onEnterEditor: Actions.enterEditor,
    onExitEditor: Actions.exitEditor,
    onConfirmSavingResult: Actions.confirmSavingResult,

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