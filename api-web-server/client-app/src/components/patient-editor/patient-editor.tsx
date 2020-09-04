import React from 'react';
import { Button } from 'reactstrap';
import { PatientVM, PatientFieldDTM } from '../../library/patient';
import { Status } from '../../library/history';

type PatientEditorProps = {
    patient: PatientVM,
    onUpdate: (fieldNameId: number, newValue: string) => void,
    onExitEditor: (save: boolean) => void,
    isSyncronizingPatient: boolean
};
export function PatientEditor(props: PatientEditorProps): JSX.Element {
    let headerOperationText: string;
    switch (props.patient.status) {
        case Status.Added: headerOperationText = 'Добавление'; break;
        case Status.Modified: headerOperationText = 'Редактирование'; break;
        default: throw new Error('Invalid state to display');
    }
    const headerOperation = (<h1>{headerOperationText}</h1>);

    const headerSyncronizingStatus =
        props.isSyncronizingPatient ?
            (<h1>{'Сохранение...'}</h1>) :
            null;

    const fieldEditors = props.patient.fields.map((f, index) => (
        <PatientEditorField
            key={f.nameId}
            field={f}
            onChange={(fieldNameId: number, newValue: string) =>
                props.onUpdate(fieldNameId, newValue)}
            disabled={props.isSyncronizingPatient}
            autofocus={index === 0}
        />
    ));

    return (
        <div style={{ margin: 10 }}>
            {headerOperation}
            {headerSyncronizingStatus}
            <Button
                onClick={() => props.onExitEditor(false)}
            >Отмена</Button>
            <Button
                onClick={() => props.onExitEditor(true)}
            >Сохранить</Button>
            <div style={{ margin: 10 }}>
                {fieldEditors}
            </div>
        </div>
    );
}

type PatientEditorFieldProps = {
    field: PatientFieldDTM,
    onChange: (fieldNameId: number, newValue: string) => void,
    disabled: boolean,
    autofocus: boolean
};
export function PatientEditorField(props: PatientEditorFieldProps): JSX.Element {
    const inputId = `edit${props.field.nameId}`;
    return (
        <>
            <label htmlFor={inputId}>{props.field.name}</label>
            <input
                id={inputId}
                type={'text'}
                value={props.field.value}
                onChange={e => props.onChange(props.field.nameId, e.currentTarget.value)}
                style={{ display: 'block' }}
                autoFocus={props.autofocus}
            />
        </>
    );
}