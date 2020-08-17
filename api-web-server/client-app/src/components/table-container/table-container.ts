import { connect } from 'react-redux'
import { Patient } from '../../library/patient';
import { History } from '../../library/history';
import {
    onAdd,
    onStartEditing,
    onEdit,
    onDelete,
    onSetSearchTemplate,
    onUndo,
    onRedo,
} from '../../store/actions';
import { Table, TableProps } from '../table/table';

type TableContainerState = {
    patientsList: Patient[],
    patientTemplate: Patient,
    editingId: number,
    history: History<Patient>
}
const mapStateToProps = (state: TableContainerState): TableProps => {
    return {
        patientsList: (state as any).red.patientsList,
        patientTemplate: (state as any).red.patientTemplate,
        editingId: (state as any).red.editingId,
        history: (state as any).red.history,
        onAdd,
        onStartEditing,
        onEdit,
        onDelete,
        onSetSearchTemplate,
        onUndo,
        onRedo,
    }
};

const mapDispatchToProps = {
    onAdd,
    onStartEditing,
    onEdit,
    onDelete,
    onSetSearchTemplate,
    onUndo,
    onRedo,
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