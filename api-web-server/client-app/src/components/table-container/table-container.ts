import { connect } from 'react-redux'
import { Patient } from '../../library/patient';
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
    history: History<Patient, string>
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

const mapDispatchToProps = {
    onAdd: Actions.add,
    onStartEditing: Actions.startEditing,
    onFinishEditing: Actions.finishEditing,
    onEdit: Actions.edit,
    onDelete: Actions.del,
    onSetSearchTemplate: Actions.setSearchTemplate,
    onUndo: Actions.undo,
    onRedo: Actions.redo,
};

const mergeProps = (stateProps: TableProps, dispatchProps: any, ownProps: any) => {
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