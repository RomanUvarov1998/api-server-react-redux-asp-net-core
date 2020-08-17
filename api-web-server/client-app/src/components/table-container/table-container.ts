import { connect } from 'react-redux'
import { Patient } from '../../library/patient';
import {
    onAdd,
    onStartEditing,
    onEdit,
    onDelete,
    onSetSearchTemplate
} from '../../store/actions';
import { Table, TableProps } from '../table/table';

type TableContainerState = {
    patientsList: Patient[],
    patientTemplate: Patient,
    editingId: number,
}
const mapStateToProps = (state: TableContainerState): TableProps => {
    return {
        patientsList: (state as any).red.patientsList,
        patientTemplate: (state as any).red.patientTemplate,
        editingId: (state as any).red.editingId,
        onAdd,
        onStartEditing,
        onEdit,
        onDelete,
        onSetSearchTemplate,
    }
};

const mapDispatchToProps = {
    onAdd,
    onStartEditing,
    onEdit,
    onDelete,
    onSetSearchTemplate
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