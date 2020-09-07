import React from 'react';
import { Button, ButtonToolbar, Container, Row, Col } from 'reactstrap';
import { PatientVM, SavingStatus, PatientEditingVM } from '../../library/patient';
import { Status } from '../../library/history';
import { FieldEditor } from '../field-editor';
import { CustomButton, PictureSave, PictureCansel } from '../custom-button';
import { fetchSyncPatient } from '../../library/fetchHelper';

type PatientEditorProps = {
    patient: PatientEditingVM,
    onExitEditor: (status?: Status, patient?: PatientVM) => void
};
type PatientEditorState = {
    patient: PatientEditingVM,
    notifyMessage?: string
};
export class PatientEditor extends React.Component<PatientEditorProps, PatientEditorState, {}> {
    constructor(props: PatientEditorProps) {
        super(props);

        this.state = {
            patient: props.patient.copy()
        };
    }

    render(): JSX.Element {
        let content;
        switch (this.state.patient.savingStatus) {
            case SavingStatus.NotSaved:
                content = (<>
                    {this.createHeader(this.state.patient.status)}
                    <ButtonToolbar>
                        <CustomButton 
                        onClick={() => this.props.onExitEditor()} 
                        svgPicture={PictureCansel}
                        tooltipText={'Отменить'}
                        />
                        <CustomButton
                            onClick={this.handleSubmit}
                            btnText={this.getSaveButtonText(this.state.patient.status)}
                            svgPicture={PictureSave}
                        />
                    </ButtonToolbar >
                    {this.createEditingPanel()}
                </>);
                break;
            case SavingStatus.Saving:
                content = (<>
                    {this.createHeader(this.state.patient.status)}
                    <h3>{this.getSavingName(this.state.patient.status)}</h3>
                </>);
                break;
            case SavingStatus.Saved:
                content = (<>
                    {this.createHeader(this.state.patient.status)}
                    <h3>
                        {this.getCompletionName(this.state.patient.status)}
                        {PictureSave}
                    </h3>
                    <Button
                        onClick={() => this.props.onExitEditor(
                            this.state.patient.status,
                            this.state.patient.toPatientVM())}
                    >Ок</Button>
                </>);
                break;
            default: throw new Error('unknown savingStatus');
        }
        return (<Container>
            <Row>
                <Col>
                    <h1>{this.state.notifyMessage}</h1>
                </Col>
            </Row>
            <Row className={'justify-content-xl-center'}>
                <Col className={'auto'}>
                    {content}
                </Col>
            </Row>
        </Container>);
    }

    private createEditingPanel = (): JSX.Element | null => {
        switch (this.state.patient.status) {
            case Status.Deleted: return null;
            case Status.Added:
            case Status.Modified:
                const fieldEditors = this.state.patient.fields.map((f, index) => (
                    <Col key={f.nameId}>
                        <FieldEditor
                            labelText={f.name}
                            value={f.value}
                            onChange={newValue => this.onEditPatient(f.nameId, newValue)}
                            autofocus={index === 0}
                            disabled={false}
                        />
                    </Col>
                ));
                return (<Container><Row>{fieldEditors}</Row></Container>);
            default:
                throw new Error('unknown status');
        }
    }

    private handleSubmit = () => {
        const savingEVM = this.state.patient.copy();
        savingEVM.savingStatus = SavingStatus.Saving;
        this.setState({ patient: savingEVM });
        const status = this.state.patient.status;

        fetchSyncPatient(
            serializedData => {
                const recievedVM = PatientVM.from(JSON.parse(serializedData));
                const savedEVM = PatientEditingVM.newFromPatientVM(
                    recievedVM, status, SavingStatus.Saved);
                this.setState({ patient: savedEVM });
            },
            savingEVM.toPatientVM(),
            savingEVM.status,
            this.badResponseHandler,
            this.responseParceHandler);
    }
    private badResponseHandler = (response: Response) => {
        this.setState({
            notifyMessage: `Bad response: ${response.statusText}`
        });
    }
    private responseParceHandler = (error: any) => {
        this.setState({
            notifyMessage: `JSON parcing error: ${error.toString()}`
        });
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