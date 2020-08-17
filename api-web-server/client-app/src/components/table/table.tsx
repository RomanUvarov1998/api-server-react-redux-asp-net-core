// import { Table as T } from 'react-bootstrap'
import * as React from "react"
import { TableRaw, RawState } from '../table-raw/table-raw'
import { Patient, FieldValue, FieldName } from "../../library/patient";
import { SearchBar } from '../search-bar/search-bar'
import {
    ActionAddPatient,
    ActionStartEditingPatient,
    ActionEditPatient,
    ActionDeletePatient,
    ActionSetSearchTemplate
} from '../../store/actions';

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
    filteredList(patientsList: Patient[], patientTemplate: Patient): Patient[] {
        var res = patientsList.filter(p => {
            var contains = true;
            patientTemplate.fields.forEach(tf => {
                if (!tf.value) return;

                var foundField = p.fields.find(f => f.name === tf.name);

                if (foundField === undefined) return;
                if (!foundField.value.startsWith(tf.value)) {
                    contains = false;
                }
            });
            return contains;
        });

        return res;
    }

    render(): React.ReactNode {
        var tableRaws = this.filteredList(this.props.patientsList, this.props.patientTemplate)
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
                <div className={"container"}>
                    <div className={"row"}>
                        <div className={"col-sm-auto"}>
                            <button
                                onClick={() => this.props.onAdd()}
                                disabled={this.props.editingId > 0}
                            >
                                Add
                            </button>
                        </div>
                        <div className={"col-sm-auto"}>
                            <button
                                onClick={() => this.props.onAdd()}
                                disabled={this.props.editingId > 0}
                            >
                                Undo
                            </button>
                        </div>
                        <div className={"col-sm-auto"}>
                            <button
                                onClick={() => this.props.onAdd()}
                                disabled={this.props.editingId > 0}
                            >
                                Redo
                            </button>
                        </div>
                    </div>
                </div>
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