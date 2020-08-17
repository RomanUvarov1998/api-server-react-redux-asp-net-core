import * as React from "react";
import { RawCell } from "../raw-cell/raw-cell";
import { Patient, FieldName, FieldValue } from "../../library/patient";

export enum RawState {
    Editing = "Save",
    Saved = "Edit",
    Frozen = "Frozen"
}
export type TableRawProps = {
    patient: Patient,
    editState: RawState,
    onEdit: (id: number, fieldName: FieldName, newValue: FieldValue) => void,
    onStartEditing: (id: number) => void,
    onDelete: (id: number) => void,
}

export function TableRaw(props: TableRawProps) {
    var rawCells = props.patient.fields.map(field => {
        return (<RawCell
            key={field.name}
            setEntityValue={newValue => props.onEdit(props.patient.id, field.name, newValue)}
            value={field.value}
            isEditing={props.editState === RawState.Editing}
        />)
    });

    return (
        <tr>
            <td>
                <button
                    onClick={e => props.onStartEditing(props.patient.id)}
                    disabled={props.editState === RawState.Frozen}
                >
                    {getEditBtnLabel(props.editState)}
                </button>
            </td>
            <td>
                <button
                    onClick={e => props.onDelete(props.patient.id)}
                    disabled={props.editState === RawState.Frozen}
                >
                    Delete
                </button>
            </td>
            {rawCells}
        </tr>
    );
}

function getEditBtnLabel(rawState: RawState) {
    switch (rawState) {
        case RawState.Editing: return "Save";
        case RawState.Saved: return "Edit";
        case RawState.Frozen: return "Edit";
        default: console.log("Unknown btn edit state");
    }
}