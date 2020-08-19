import * as React from "react";
import { RawCell } from "../raw-cell/raw-cell";
import { Patient, FieldName, FieldValue, PatientField } from "../../library/patient";

export enum RawState {
    Editing = "Save",
    Saved = "Edit",
    Frozen = "Frozen"
}
export type TableRawProps = {
    patientTemplate: Patient,
    patient: Patient,
    editState: RawState,
    onEdit: (id: number, fieldName: FieldName, newValue: FieldValue) => void,
    onStartEditing: (id: number) => void,
    onDelete: (id: number) => void,
}

export function TableRaw(props: TableRawProps) {
    var rawCells = props.patientTemplate.fields.map(templateField => {
        var field = props.patient.fields.find(f => f.name === templateField.name);

        return (
            field ?
                (<RawCell
                    key={field.name}
                    setEntityValue={
                        newValue =>
                            props.onEdit(
                                props.patient.localId,
                                (field as PatientField).name,
                                newValue
                            )
                    }
                    value={field.value}
                    isEditing={props.editState === RawState.Editing}
                />) :
                (<div>Не указано</div>)
        );
    });

    return (
        <tr>
            <td>
                <button
                    onClick={e => props.onStartEditing(props.patient.localId)}
                    disabled={props.editState === RawState.Frozen}
                >{getEditBtnLabel(props.editState)}</button>
            </td>
            <td>
                <button
                    onClick={e => props.onDelete(props.patient.localId)}
                    disabled={props.editState === RawState.Frozen}
                >Удалить</button>
            </td>
            {rawCells}
        </tr>
    );
}

function getEditBtnLabel(rawState: RawState) {
    switch (rawState) {
        case RawState.Editing: return "Сохранить";
        case RawState.Saved: return "Изменить";
        case RawState.Frozen: return "Изменить";
        default: console.log("Unknown btn edit state");
    }
}