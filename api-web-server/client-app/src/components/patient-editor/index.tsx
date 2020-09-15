import React from 'react';
import { ButtonToolbar, Container, Row, Col } from 'react-bootstrap';
import { PatientVM, SavingStatus, PatientEditingVM, PatientSearchTemplateVM } from '../../library/patient';
import { Status } from '../../library/history';
import { FieldEditor } from '../field-editor';
import { CustomButton, PictureSave, PictureCansel, BtnColors } from '../custom-button';
import { fetchSyncPatient } from '../../library/fetchHelper';

type PatientEditorProps = {
    patient: PatientEditingVM,
    template: PatientSearchTemplateVM,
    onExitEditor: (patientAndAction?: { patient: PatientVM, status: Status }) => void
};
type PatientEditorState = {
    patient: PatientEditingVM,
    notifyMessages: string[]
};
export class PatientEditor extends React.Component<PatientEditorProps, PatientEditorState, {}> {
    constructor(props: PatientEditorProps) {
        super(props);

        this.state = {
            patient: props.patient.copy(),
            notifyMessages: []
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
                            color={this.getSaveButtonColor(this.state.patient.status)}
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
                    <CustomButton
                        onClick={() => this.props.onExitEditor({
                            patient: this.state.patient.toPatientVM(),
                            status: this.state.patient.status})}
                        svgPicture={PictureCansel}
                        btnText={'Ок'}
                    />
                </>);
                break;
            default: throw new Error('unknown savingStatus');
        }
        return (<Container>
            <Row>
                <Col>
                    {this.state.notifyMessages.map((m, ind) => (
                        <p
                            style={{ color: 'red' }}
                            key={ind}
                        >{m}</p>
                    ))}
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
                const fieldEditors = this.props.template.fields.map((tf, index) => {
                    const pf = this.state.patient.fields
                        .find(_pf => _pf.nameId === tf.nameId);
                    const content = pf ? pf.value : '';
                    return (<Col key={tf.nameId}>
                        <FieldEditor
                            labelText={tf.name}
                            value={content}
                            onChange={newValue => this.onEditPatient(tf.nameId, newValue)}
                            autofocus={index === 0}
                            disabled={false}
                        />
                    </Col>);
                });
                return (<Container><Row>{fieldEditors}</Row></Container>);
            default:
                throw new Error('unknown status');
        }
    }

    private handleSubmit = () => {
        const savingEVM = this.state.patient.copy();
        savingEVM.savingStatus = SavingStatus.Saving;
        const savingEVMCopy = savingEVM.copy();
        this.setState({ patient: savingEVM });
        const status = this.state.patient.status;

        let myThen;
        switch (status) {
            case Status.Added:
            case Status.Modified:
                myThen = (serializedData: string) => {
                    const recievedVM = PatientVM.from(JSON.parse(serializedData));
                    const savedEVM = PatientEditingVM.newFromPatientVM(
                        recievedVM, status, SavingStatus.Saved);
                    this.setState({ patient: savedEVM });
                };
                break;
            case Status.Deleted:
                myThen = (serializedData: string) => {
                    const recievedId = JSON.parse(serializedData) as number;

                    if (savingEVMCopy.id !== recievedId) {
                        throw new Error("Deleted id != recieved id");
                    }

                    savingEVMCopy.savingStatus = SavingStatus.Saved;
                    this.setState({ patient: savingEVMCopy });
                };
                break;
            default: throw new Error("unknown status");
        }

        fetchSyncPatient(
            myThen,
            savingEVM.toPatientVM(),
            savingEVM.status,
            this.notOkResponseHandler,
            this.responseParceHandler);
    }
    private notOkResponseHandler = (response: Response, msg: string) => {
        const previousMsg = this.state.notifyMessages.slice();
        this.setState({
            notifyMessages: previousMsg
                .concat(`${previousMsg.length}) Not ok response (${response.statusText}): ${msg}`)
        });
    }
    private responseParceHandler = (error: any) => {
        const previousMsg = this.state.notifyMessages.slice();
        this.setState({
            notifyMessages: previousMsg
                .concat(`${previousMsg.length}) JSON parcing error: ${error.toString()}`)
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
    private getSaveButtonColor(status: Status): BtnColors {
        switch (status) {
            case Status.Added: return BtnColors.Success;
            case Status.Modified: return BtnColors.Primary;
            case Status.Deleted: return BtnColors.Danger;
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