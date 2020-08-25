import * as React from "react";
import { RawCell } from "../raw-cell/raw-cell";
import { Patient, FieldName, FieldValue, PatientField, SavingStatus } from "../../library/patient";
import { Status } from "../../library/history";

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
    onFinishEditing: (save: boolean) => void,
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

    var rawStyle = statusToStyle(props.patient.status);

    return (
        <tr style={rawStyle}>
            <td>
                {getBtnEditOrSave(props)}
            </td>
            <td>
                {getBtnDeleteOrCancel(props)}
            </td>
            {rawCells}
            <td>
                {statusToString(props.patient)}
            </td>
        </tr>
    );
}

function getBtnEditOrSave(props: TableRawProps) {
    return (
        props.editState === RawState.Editing ?
            (<button
                onClick={e => props.onFinishEditing(true)}
                disabled={
                    props.patient.savingStatus === SavingStatus.Saving
                }
            >Сохранить</button>) :
            (<button
                onClick={e => props.onStartEditing(props.patient.localId)}
                disabled={
                    props.editState === RawState.Frozen ||
                    props.patient.status === Status.Deleted ||
                    props.patient.savingStatus === SavingStatus.Saving
                }
            >Редактировать</button>)
    );
}

function getBtnDeleteOrCancel(props: TableRawProps): JSX.Element {
    return (
        props.editState === RawState.Editing ?
            (<button
                onClick={e => props.onFinishEditing(false)}
                disabled={
                    props.patient.status === Status.Deleted ||
                    props.patient.savingStatus === SavingStatus.Saving
                }
            >Отмена</button>) :
            (<button
                onClick={e => props.onDelete(props.patient.localId)}
                disabled={
                    props.editState === RawState.Frozen ||
                    props.patient.status === Status.Deleted ||
                    props.patient.savingStatus === SavingStatus.Saving
                }
            >Удалить</button>)
    );
}

function statusToString(patient: Patient): string {
    if (patient.savingStatus === SavingStatus.Saving) {
        return "Сохранение...";
    } else {
        switch (patient.status) {
            case Status.Added: return "Добавлен";
            case Status.Modified: return "Изменен";
            case Status.Deleted: return "Удален";
            case Status.Untouched: return "";
            default: return "unknown ???";
        }
    }
}

function statusToStyle(status: Status): {
    backgroundColor: string,
    color: string,
    padding: number
} {
    let padding = 5;
    switch (status) {
        case Status.Added: return {
            backgroundColor: '#00ff00',
            color: '#000000',
            padding
        };
        case Status.Modified: return {
            backgroundColor: '#ffff00',
            color: '#000000',
            padding
        };
        case Status.Deleted: return {
            backgroundColor: '#ffffff',
            color: '#a1a1a1',
            padding
        };
        case Status.Untouched: return {
            backgroundColor: '#ffffff',
            color: '#000000',
            padding
        };
        default: return {
            backgroundColor: '#ffffff',
            color: '#000000',
            padding
        };
    }
}