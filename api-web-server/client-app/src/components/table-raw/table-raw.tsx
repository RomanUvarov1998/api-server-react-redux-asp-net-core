import React from "react";
import { RawCell } from "../raw-cell/raw-cell";
import { PatientVM, FieldValue, PatientFieldDTM, SavingStatus, PatientSearchTemplateVM } from "../../library/patient";
import { Status } from "../../library/history";
import { Button } from "reactstrap";

export enum RawState {
    Editing,
    // Saved,
    Frozen
}
export type TableRawProps = {
    patientTemplate: PatientSearchTemplateVM,
    patient: PatientVM,
    editState: RawState,
    onCellFocus: () => void,
    onEdit: (id: number, fieldNameId: number, newValue: FieldValue) => void,
    onCellBlur: () => void,
    onDelete: (id: number) => void,
}

export function TableRaw(props: TableRawProps) {
    const rawCells = props.patientTemplate.fields.map(templateField => {
        const field = props.patient.fields.find(f => f.nameId === templateField.nameId);

        return (
            field ?
                (<RawCell
                    key={field.name}
                    setEntityValue={
                        newValue =>
                            props.onEdit(
                                props.patient.id,
                                (field as PatientFieldDTM).nameId,
                                newValue
                            )
                    }
                    value={field.value}
                    disabled={props.editState !== RawState.Editing || 
                        props.patient.status === Status.Deleted}
                    onFocus={props.onCellFocus}
                    onBlur={props.onCellBlur}
                />) :
                (<div>Не указано</div>)
        );
    });

    const rawStyle = statusToStyle(props.patient.status);

    return (
        <tr style={rawStyle}>
            {rawCells}
            <td>
                <Button
                    onClick={() => props.onDelete(props.patient.id)}
                    disabled={
                        props.editState === RawState.Frozen ||
                        props.patient.status === Status.Deleted ||
                        props.patient.savingStatus === SavingStatus.Saving
                    }
                >Удалить</Button>
            </td>
            <td>
                {statusToString(props.patient)}
            </td>
        </tr>
    );
}

function statusToString(patient: PatientVM): string {
    let status;

    if (patient.savingStatus === SavingStatus.Saving) {
        return "Сохранение...";
    } else {
        switch (patient.status) {
            case Status.Added: status = "Добавлен"; break;
            case Status.Modified: status = "Изменен "; break;
            case Status.Deleted: status = "Удален  "; break;
            case Status.Untouched: status = "        "; break;
            default: status = "unknown ";
        }
    }

    return `${status}`;// id:${patient.id}`;
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