import { connect } from 'react-redux'
import { Patient, FieldName, FieldValue } from '../../library/patient';
import { History } from '../../library/history';
import * as Actions from '../../store/actions';
import { Table, TableProps } from '../table/table';

type TableContainerState = {
    isWaitingPatientsList: boolean,
    isWaitingPatientFields: boolean,
    patientsList: Patient[],
    patientTemplate: Patient,
    editingId: number,
    editingPatient: Patient | null,
    history: History<Patient>
}
export type TableContainerDispatchProps = {
    onAdd: () => Actions.ActionAddPatient,
    onStartEditing: (id: number) => Actions.ActionStartEditingPatient,
    onFinishEditing: (save: boolean) => Actions.ActionFinishEditingPatient,
    onEdit: (id: number, fieldName: FieldName, newValue: FieldValue) => Actions.ActionEditPatient,
    onDelete: (id: number) => Actions.ActionDeletePatient,
    onSetSearchTemplate: (fieldName: FieldName, newValue: FieldValue) => Actions.ActionSetSearchTemplate,
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
        editingId: state.editingId,
        editingPatient: state.editingPatient,
        history: state.history,
        onAdd: Actions.add,
        onStartEditing: Actions.startEditing,
        onFinishEditing: Actions.finishEditing,
        onEdit: Actions.edit,
        onDelete: Actions.del,
        onSetSearchTemplate: Actions.setSearchTemplate,
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