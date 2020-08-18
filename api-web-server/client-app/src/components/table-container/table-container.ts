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
    history: History<Patient>
}
const mapStateToProps = (state: TableContainerState): TableProps => {
    return {
        isWaitingPatientsList: (state as any).red.isWaitingPatientsList,
        isWaitingPatientFields: (state as any).red.isWaitingPatientFields,
        patientsList: (state as any).red.patientsList,
        patientTemplate: (state as any).red.patientTemplate,
        editingId: (state as any).red.editingId,
        history: (state as any).red.history,
        onAdd: Actions.add,
        onStartEditing: Actions.startEditing,
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
    onEdit: Actions.edit,
    onDelete: Actions.del,
    onSetSearchTemplate: Actions.setSearchTemplate,
    onUndo: Actions.undo,
    onRedo: Actions.redo,
};

const mergeProps = (stateProps: any, dispatchProps: any, ownProps: any) => {
    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps
    };
}

export const TableContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Table)