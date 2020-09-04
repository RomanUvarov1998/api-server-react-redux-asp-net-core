import React from 'react';
import { Button } from 'reactstrap';
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
    let headerOperationText: string;
    switch (props.patient.status) {
        case Status.Added: headerOperationText = 'Добавление'; break;
        case Status.Modified: headerOperationText = 'Редактирование'; break;
        default: throw new Error('Invalid state to display');
    }
    const headerOperation = (<h1>{headerOperationText}</h1>);

    let editingPanel;
    switch (props.patient.savingStatus) {
        case SavingStatus.NotSaved:
            const fieldEditors = props.patient.fields.map((f, index) => (
                <FieldEditor
                    key={f.nameId}
                    labelText={f.name}
                    value={f.value}
                    onChange={newValue =>
                        props.onUpdate(f.nameId, newValue)}
                    autofocus={index === 0}
                    disabled={true}
                />
            ));
            editingPanel = (
                <>
                    <Button
                        onClick={() => props.onExitEditor(false)}
                    >Отмена</Button>
                    <Button
                        onClick={() => props.onExitEditor(true)}
                    >Сохранить</Button>
                    <div style={{ margin: 10 }}>
                        {fieldEditors}
                    </div>
                </>
            );
            break;
        case SavingStatus.Saving:
            editingPanel = (<h1>{'Сохранение...'}</h1>);
            break;
        case SavingStatus.Saved:
            editingPanel = (
                <>
                    <h3>{'Сохранено'}</h3>
                    <Button onClick={props.onConfirmSavingResult}
                    >Ок</Button>
                </>
            );
            break;
        default: throw new Error('unknown savingStatus');
    }

    return (
        <div style={{ margin: 10 }}>
            {headerOperation}
            {editingPanel}
        </div>
    );
}