// import { Table as T } from 'react-bootstrap'
import * as React from "react"
import { TableRaw, RawState } from '../table-raw/table-raw'
import { Patient, FieldValue, FieldName, filteredList } from "../../library/patient";
import { SearchBar } from '../search-bar/search-bar'
import {
    ActionAddPatient,
    ActionStartEditingPatient,
    ActionEditPatient,
    ActionDeletePatient,
    ActionSetSearchTemplate
} from '../../store/actions';
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';

export type TableProps = {
    patientTemplate: Patient,
    patientsList: Patient[],
    editingId: number,
    onAdd: () => ActionAddPatient,
    onStartEditing: (id: number) => ActionStartEditingPatient,
    onEdit: (id: number, fieldName: FieldName, newValue: FieldValue) => ActionEditPatient,
    onDelete: (id: number) => ActionDeletePatient,
    onSetSearchTemplate: (fieldName: FieldName, newValue: FieldValue) => ActionSetSearchTemplate,
}

export class Table extends React.Component<TableProps, {}, {}> {
    render(): React.ReactNode {
        var tableRaws = filteredList(this.props.patientsList, this.props.patientTemplate)
            .map((patient, ind) =>
                (<TableRaw
                    key={ind}
                    patient={patient}
                    editState={getRawState(this.props.editingId, patient.id)}
                    onEdit={this.props.onEdit}
                    onStartEditing={this.props.onStartEditing}
                    onDelete={this.props.onDelete}
                />)
            );

        var table = (
            <table className={"table table-responsive table-striped table-bordered table-normal"}>
                <thead className={"thead-dark"}>
                    <tr>
                        <th></th><th></th><th>Name:</th><th>Surname:</th><th>Patronimyc:</th>
                    </tr>
                </thead>
                <tbody>
                    {tableRaws}
                </tbody>
            </table>
        );

        var noPatientsSign = (<div>No patients found</div >);

        return (
            <div>
                <SearchBar
                    patientTemplate={this.props.patientTemplate}
                    onSetSearchTemplate={this.props.onSetSearchTemplate}
                />
                <h1>Patients:</h1>
                <ButtonToolbar>
                    <ButtonGroup>
                        <Button
                            onClick={() => this.props.onAdd()}
                            disabled={this.props.editingId > 0}
                        >Undo</Button>
                        <Button
                            onClick={() => this.props.onAdd()}
                            disabled={this.props.editingId > 0}
                        >Redo</Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button
                            onClick={() => this.props.onAdd()}
                            disabled={this.props.editingId > 0}
                        >Add</Button>
                    </ButtonGroup>
                </ButtonToolbar>
                {(this.props.patientsList.length > 0) ? table : noPatientsSign}
            </div >

        );
    }
}

function getRawState(editingId: number, patientId: number): RawState {
    if (editingId !== patientId) {
        return (
            editingId ?
                RawState.Frozen :
                RawState.Saved
        );
    } else {
        return RawState.Editing;
    }
}

