import { connect } from 'react-redux'
import { PatientVM, FieldValue, PatientSearchTemplateVM } from '../../library/patient';
import * as Actions from '../../store/actions';
import { PatientManager } from '../patients-manager';

export type MainContainerState = {
    isWaitingPatientsList: boolean,
    isWaitingPatientFields: boolean,

    searchingList: PatientVM[],
    patientTemplate: PatientSearchTemplateVM | null,
    canLoadMore: boolean,
    loadPortionCount: number,

    editingPatient: PatientVM | null,
    isSyncronizingPatient: boolean
}
const mapStateToProps = (state: MainContainerState): MainContainerState => {
    return {
        isWaitingPatientFields: state.isWaitingPatientFields,
        isWaitingPatientsList: state.isWaitingPatientsList, 

        searchingList: state.searchingList,
        patientTemplate: state.patientTemplate,
        canLoadMore: state.canLoadMore, 
        loadPortionCount: state.loadPortionCount, 

        editingPatient: state.editingPatient,
        isSyncronizingPatient: state.isSyncronizingPatient
    }
};

export type TableContainerDispatchProps = {
    onSetSearchTemplate: (fieldNameId: number, newValue: FieldValue) => Actions.ActionSetSearchTemplate,
    giveVariants: (fieldNameId: number, variants: string[]) => Actions.ActionGiveVariants,
    onClearSearchTemplate: () => Actions.ActionClearSearchTemplate,
    onLoadMorePatients: (template: PatientSearchTemplateVM, loadedCount: number, pageLength: number) => Actions.ActionLoadMorePatients,

    onEnterEditor: (patient: PatientVM | undefined) => Actions.ActionEnterEditor,
    onEditPatient: (fieldNameId: number, newValue: FieldValue) => Actions.ActionEditPatient,
    onDelete: (id: number) => Actions.ActionDeletePatient,
    onExitEditor: (save: boolean) => Actions.ActionExitEditor,
}
const mapDispatchToProps: TableContainerDispatchProps = {
    onSetSearchTemplate: Actions.setSearchTemplate,
    giveVariants: Actions.giveVariants,
    onClearSearchTemplate: Actions.clearSearchTemplate,
    onLoadMorePatients: Actions.loadMorePatients,

    onEnterEditor: Actions.enterEditor,
    onEditPatient: Actions.editPatient,
    onDelete: Actions.del,
    onExitEditor: Actions.exitEditor,
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