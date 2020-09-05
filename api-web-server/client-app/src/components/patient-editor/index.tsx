import React from 'react';
import { Button, ButtonToolbar } from 'reactstrap';
import { PatientVM, SavingStatus } from '../../library/patient';
import { Status } from '../../library/history';
import { FieldEditor } from '../field-editor';

type PatientEditorProps = {
    patient: PatientVM,
    onUpdate: (fieldNameId: number, newValue: string) => void,
    onExitEditor: (save: boolean) => void,
    onConfirmSavingResult: () => void
};
export function PatientEditor(props: PatientEditorProps): JSX.Element {
    switch (props.patient.savingStatus) {
        case SavingStatus.NotSaved:
            return (
                <div style={{ margin: 10 }}>
                    {createHeader(props.patient.status)}
                    <ButtonToolbar>
                        <Button
                            onClick={() => props.onExitEditor(false)}
                        >Отмена</Button>
                        <Button
                            onClick={() => props.onExitEditor(true)}
                        >{getSaveButtonText(props.patient.status)}</Button>
                    </ButtonToolbar>
                    {createEditingPanel(props)}
                </div>
            );
        case SavingStatus.Saving:
            return (
                <div style={{ margin: 10 }}>
                    {createHeader(props.patient.status)}
                    <h1>{getSavingName(props.patient.status)}</h1>
                </div>
            );
        case SavingStatus.Saved:
            return (
                <div style={{ margin: 10 }}>
                    {createHeader(props.patient.status)}
                    <h1>{getCompletionName(props.patient.status)}</h1>
                    <Button onClick={props.onConfirmSavingResult}>Ок</Button>
                </div>
            );
        default: throw new Error('unknown savingStatus');
    }
}

function createEditingPanel(props: PatientEditorProps): JSX.Element | null {
    switch (props.patient.status) {
        case Status.Deleted: return null;
        case Status.Added:
        case Status.Modified:
            const fieldEditors = props.patient.fields.map((f, index) => (
                <FieldEditor
                    key={f.nameId}
                    labelText={f.name}
                    value={f.value}
                    onChange={newValue =>
                        props.onUpdate(f.nameId, newValue)}
                    autofocus={index === 0}
                    disabled={false}
                />
            ));
            return (<div style={{ margin: 10 }}> {fieldEditors} </div>);
        default:
            throw new Error('unknown status');
    }
}

function createHeader(status: Status): JSX.Element {
    switch (status) {
        case Status.Added: return (<h1>Добавление</h1>);
        case Status.Modified: return (<h1>Редактирование</h1>);
        case Status.Deleted: return (<h1>Подтверждение удаления</h1>);
        default: throw new Error('Invalid state to display');
    }
}

function getSaveButtonText(status: Status): string {
    switch (status) {
        case Status.Added: return 'Добавить';
        case Status.Modified: return 'Сохранить изменения';
        case Status.Deleted: return 'Подтвердить удаление';
        default: throw new Error('Invalid state to display');
    }
}

function getSavingName(status: Status): string {
    switch (status) {
        case Status.Added: return 'Добавление...';
        case Status.Modified: return 'Сохранение изменений...';
        case Status.Deleted: return 'Удаление...';
        default: throw new Error('Invalid state to display');
    }
}

function getCompletionName(status: Status): string {
    switch (status) {
        case Status.Added: return 'Добавлено';
        case Status.Modified: return 'Изменения сохранены';
        case Status.Deleted: return 'Удалено';
        default: throw new Error('Invalid state to display');
    }
}