import { connect } from 'react-redux'
import { Patient, FieldValue } from '../../library/patient';
import { History } from '../../library/history';
import * as Actions from '../../store/actions';
import { Table, TableProps } from '../table/table';

export type TableContainerState = {
    isWaitingPatientsList: boolean,
    isWaitingPatientFields: boolean,
    patientsList: Patient[],
    patientTemplate: Patient | null,
    editingPatient: Patient | null,
    history: History<Patient>
}
export type TableContainerDispatchProps = {
    onAdd: () => Actions.ActionAddPatient,
    onStartEditing: (id: number) => Actions.ActionStartEditingPatient,
    onFinishEditing: (save: boolean) => Actions.ActionFinishEditingPatient,
    onEdit: (id: number, fieldNameId: number, newValue: FieldValue) => Actions.ActionEditPatient,
    onDelete: (id: number) => Actions.ActionDeletePatient,
    onSetSearchTemplate: (fieldNameId: number, newValue: FieldValue) => Actions.ActionSetSearchTemplate,
    onUndo: () => Actions.ActionUndo,
    onRedo: () => Actions.ActionRedo
}
export type TableContainerProps = {
    savePatients: (list: Patient[]) => void
}

const mapStateToProps = (state: TableContainerState): TableProps => {
    return {
        isWaitingPatientsList: state.isWaitingPatientsList,
        isWaitingPatientFields: state.isWaitingPatientFields,
        patientsList: state.patientsList,
        patientTemplate: state.patientTemplate,
        editingPatient: state.editingPatient,
        history: state.history,
        onAdd: Actions.add,
        onStartEditing: Actions.startEditing,
        onFinishEditing: Actions.finishEditing,
        onEdit: Actions.edit,
        onDelete: Actions.del,
        onSetSearchTemplate: Actions.setSearchTemplate,
        onClearTemplate: Actions.clearSearchTemplate,
        onUndo: Actions.undo,
        onRedo: Actions.redo,
    }
};

const mapDispatchToProps: TableContainerDispatchProps = {
    onAdd: Actions.add,
    onStartEditing: Actions.startEditing,
    onFinishEditing: Actions.finishEditing,
    onEdit: Actions.edit,
    onDelete: Actions.del,
    onSetSearchTemplate: Actions.setSearchTemplate,
    onUndo: Actions.undo,
    onRedo: Actions.redo,
};

function mergeProps(
    stateProps: TableProps,
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