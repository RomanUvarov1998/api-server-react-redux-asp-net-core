import React from 'react';
import { Button, ButtonToolbar } from 'reactstrap';
import { PatientVM, SavingStatus } from '../../library/patient';
import { Status } from '../../library/history';
import { FieldEditor } from '../field-editor';

type PatientEditorProps = {
    patient: PatientVM,
    onExitEditor: (patient: PatientVM | undefined) => void,
    onConfirmSavingResult: () => void
};
type PatientEditorState = {
    patient: PatientVM
};
export class PatientEditor extends React.Component<PatientEditorProps, PatientEditorState, {}> {
    constructor(props: PatientEditorProps) {
        super(props);

        const patient = props.patient.copy();
        patient.savingStatus= SavingStatus.NotSaved;

        this.state = {
            patient
        };
    }

    render(): JSX.Element {
        let content;
        switch (this.props.patient.savingStatus) {
            case SavingStatus.NotSaved:
                content = (
                    <div style={{ margin: 10 }}>
                        {this.createHeader(this.state.patient.status)}
                        <ButtonToolbar>
                            <Button onClick={() => this.props.onExitEditor(undefined)} >
                                Отмена
                        </Button>
                            <Button onClick={() => this.props.onExitEditor(this.state.patient.copy())}>
                                {this.getSaveButtonText(this.state.patient.status)}
                            </Button>
                        </ButtonToolbar >
                        {this.createEditingPanel()}
                    </div >
                );
                break;
            case SavingStatus.Saving:
                content = (
                    <div style={{ margin: 10 }}>
                        {this.createHeader(this.state.patient.status)}
                        <h3>{this.getSavingName(this.state.patient.status)}</h3>
                    </div>
                );
                break;
            case SavingStatus.Saved:
                content = (
                    <div style={{ margin: 10 }}>
                        {this.createHeader(this.state.patient.status)}
                        <h3>{this.getCompletionName(this.state.patient.status)}</h3>
                        <Button onClick={this.props.onConfirmSavingResult}>Ок</Button>
                    </div>
                );
                break;
            default: throw new Error('unknown savingStatus');
        }
        return content;
    }

    private createEditingPanel = (): JSX.Element | null => {
        switch (this.state.patient.status) {
            case Status.Deleted: return null;
            case Status.Added:
            case Status.Modified:
                const fieldEditors = this.state.patient.fields.map((f, index) => (
                    <FieldEditor
                        key={f.nameId}
                        labelText={f.name}
                        value={f.value}
                        onChange={newValue => this.onEditPatient(f.nameId, newValue)}
                        autofocus={index === 0}
                        disabled={false}
                    />
                ));
                return (<div style={{ margin: 10 }}> {fieldEditors} </div>);
            default:
                throw new Error('unknown status');
        }
    }

    private onEditPatient = (fieldNameId: number, newValue: string): void => {
        this.setState({
            patient: this.state.patient.getUpdatedCopy(fieldNameId, newValue)
        })
    }

    private createHeader(status: Status): JSX.Element {
        switch (status) {
            case Status.Added: return (<h1>Добавление</h1>);
            case Status.Modified: return (<h1>Редактирование</h1>);
            case Status.Deleted: return (<h1>Подтверждение удаления</h1>);
            default: throw new Error('Invalid state to display');
        }
    }
    
    private getSaveButtonText(status: Status): string {
        switch (status) {
            case Status.Added: return 'Добавить';
            case Status.Modified: return 'Сохранить изменения';
            case Status.Deleted: return 'Подтвердить удаление';
            default: throw new Error('Invalid state to display');
        }
    }
    
    private getSavingName(status: Status): string {
        switch (status) {
            case Status.Added: return 'Добавление...';
            case Status.Modified: return 'Сохранение изменений...';
            case Status.Deleted: return 'Удаление...';
            default: throw new Error('Invalid state to display');
        }
    }
    
    private getCompletionName(status: Status): string {
        switch (status) {
            case Status.Added: return 'Добавлено';
            case Status.Modified: return 'Изменения сохранены';
            case Status.Deleted: return 'Удалено';
            default: throw new Error('Invalid state to display');
        }
    }
}