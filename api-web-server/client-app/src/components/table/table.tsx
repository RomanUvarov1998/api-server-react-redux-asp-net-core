import * as React from "react"
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';
import { TableRaw, RawState } from '../table-raw/table-raw'
import { Patient, FieldValue, FieldName, filteredList } from "../../library/patient";
import { SearchBar } from '../search-bar/search-bar'
import * as Actions from '../../store/actions';
import { History } from '../../library/history'

export type TableProps = {
    patientTemplate: Patient,
    patientsList: Patient[],
    editingId: number,
    history: History<Patient>,
    onAdd: () => Actions.ActionAddPatient,
    onStartEditing: (id: number) => Actions.ActionStartEditingPatient,
    onEdit: (id: number, fieldName: FieldName, newValue: FieldValue) => Actions.ActionEditPatient,
    onDelete: (id: number) => Actions.ActionDeletePatient,
    onSetSearchTemplate: (fieldName: FieldName, newValue: FieldValue) => Actions.ActionSetSearchTemplate,
    onUndo: () => Actions.ActionUndo,
    onRedo: () => Actions.ActionRedo,
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

        // {
        //     let p = this.props.patientsList[2];
        //     if (p) {
        //         let f = p.fields[0];
        //         if (f) {
        //             console.log(`{ ${f.name} : ${f.value} }`);
        //         }
        //     }
        // }

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
                            onClick={() => this.props.onUndo()}
                            disabled={!this.props.history.canUndo()}
                        >Undo</Button>
                        <Button
                            onClick={() => this.props.onRedo()}
                            disabled={!this.props.history.canRedo()}
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

