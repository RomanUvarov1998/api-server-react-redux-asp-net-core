import React from 'react';
import { Container, ButtonToolbar, Col, Row } from 'react-bootstrap';
import { PatientSearchTemplateVM, SavingStatus, PatientSearchTemplateFieldVM } from '../../library/patient';
import { FieldEditor } from '../field-editor';
import { CustomButton, PictureCansel, PictureSave, PictureAdd, BtnColors, PictureDelete } from '../custom-button';
import { fetchUpdatedPatientTemplate } from '../../library/fetchHelper';
import { KeyedCollection } from '../../library/myDictionary';

type PatientTemplateEditorProps = {
    initialTemplate: PatientSearchTemplateVM,
    onExit: (newTemplate?: PatientSearchTemplateVM) => void
};
type PatientTemplateEditorState = {
    editingTemplate: PatientSearchTemplateVM,
    savingStatus: SavingStatus,
    fieldValues: KeyedCollection<string>,
    errorLog: string[],
    lastAddedField?: PatientSearchTemplateFieldVM
};

export class PatientTemplateEditor extends React.Component<PatientTemplateEditorProps,
    PatientTemplateEditorState, {}> {
    constructor(props: PatientTemplateEditorProps) {
        super(props);

        const fieldValues = new KeyedCollection<string>();
        props.initialTemplate.fields.forEach(f => {
            fieldValues.Add(f.nameId.toString(), f.name);
        });

        this.state = {
            editingTemplate: props.initialTemplate.copy(),
            savingStatus: SavingStatus.NotSaved,
            fieldValues,
            errorLog: []
        };
    }

    render(): JSX.Element {
        return (
            <Container>
                <h1>Редактирование списка полей пациента</h1>
                {this.state.errorLog.map((m, ind) => (
                    <p
                        key={ind}
                        style={{ color: 'red' }}
                    >{m}</p>
                ))}
                <ButtonToolbar>{this.createControls()}</ButtonToolbar>
                <Row>{this.createEditingPanel()}</Row>
            </Container>
        );
    }

    private onEdit = (nameId: number, newName: string) => {
        const newFields = this.state.editingTemplate.fields.map(f => {
            if (f.nameId === nameId) {
                f.name = newName;
            }
            return f;
        });

        const newTemplate = this.state.editingTemplate.copy();
        newTemplate.fields = newFields;

        this.setState({ editingTemplate: newTemplate });
    }

    private onDelete = (nameId: number) => {
        const newFields = this.state.editingTemplate.fields.map(
            f => {
                if (f.nameId === nameId) {
                    f.isDeleted = true;
                }
                return f;
            });

        const newTemplate = this.state.editingTemplate.copy();
        newTemplate.fields = newFields;

        this.setState({ editingTemplate: newTemplate });
    }

    private onRestore = (nameId: number) => {
        const newFields = this.state.editingTemplate.fields.map(
            f => {
                if (f.nameId === nameId) {
                    f.isDeleted = false;
                }
                return f;
            });

        const newTemplate = this.state.editingTemplate.copy();
        newTemplate.fields = newFields;

        this.setState({ editingTemplate: newTemplate });
    }

    private onAddNewField = () => {
        let newId = 0;
        this.state.editingTemplate.fields.forEach(f => {
            if (f.nameId <= newId) {
                newId = f.nameId - 1;
            }
        });
        const lastAddedField = new PatientSearchTemplateFieldVM('', newId, [], '', false);
        const editingTemplate = this.state.editingTemplate.copy();
        editingTemplate.fields.push(lastAddedField);
        this.setState({ editingTemplate, lastAddedField });
    }

    private createEditingPanel = (): JSX.Element => {
        switch (this.state.savingStatus) {
            case SavingStatus.NotSaved:
                const { fields } = this.state.editingTemplate;
                const { lastAddedField, fieldValues } = this.state;
                const autofocusPredicate =
                    lastAddedField ?
                        ((f: PatientSearchTemplateFieldVM, index: number) =>
                            f === lastAddedField) :
                        ((f: PatientSearchTemplateFieldVM, index: number) =>
                            index === 0);

                const editFields = fields.map((f, index) => {
                    const initialName =
                        fieldValues.ContainsKey(f.nameId.toString()) ?
                            fieldValues.Item(f.nameId.toString()) :
                            '[Новое поле]';

                    const deleteRestoreBtn =
                        f.isDeleted ?
                            (<CustomButton
                                onClick={() => this.onRestore(f.nameId)}
                                svgPicture={PictureAdd}
                                tooltipText={'Отменить удаление поля из списка полей пациента'}
                            />) :
                            (<CustomButton
                                onClick={() => this.onDelete(f.nameId)}
                                svgPicture={PictureDelete}
                                tooltipText={'Удалить поле из списка полей пациента (можно отменить)'}
                            />);

                    return (<Col key={index} className={'col col-sm-12 col-md-6 col-lg-5 col-xl-4'}>
                        <Container style={{ margin: 10 }}>
                            <Row className={'row justify-content-start no-gutters'}>
                                <Col>
                                    <FieldEditor
                                        labelText={`${initialName}:`}
                                        value={f.name}
                                        onChange={newValue => this.onEdit(f.nameId, newValue)}
                                        disabled={f.isDeleted}
                                        autofocus={autofocusPredicate(f, index)}
                                    />
                                </Col>
                                <Col>{deleteRestoreBtn}</Col>
                            </Row>
                        </Container>
                    </Col>)
                }
                );
                return (<Row className={'row justify-content-start'}>{editFields}</Row>);
            case SavingStatus.Saving:
            case SavingStatus.Saved:
                return (<></>);
            default: throw new Error('unknown state');
        }
    }

    private createControls = (): JSX.Element => {
        switch (this.state.savingStatus) {
            case SavingStatus.NotSaved:
                return (<>
                    <CustomButton
                        onClick={() => this.props.onExit()}
                        svgPicture={PictureCansel}
                        tooltipText={'Отменить'}
                    />
                    <CustomButton
                        onClick={() => this.onAddNewField()}
                        svgPicture={PictureAdd}
                        btnText={'Добавить поле'}
                        tooltipText={'Добавить новое название поля'}
                        color={BtnColors.Success}
                    />
                    <CustomButton
                        onClick={() => this.saveToDB()}
                        svgPicture={PictureSave}
                        btnText={'Сохранить'}
                        tooltipText={'Сохранить все изменения'}
                        color={BtnColors.Primary}
                    />
                </>);
            case SavingStatus.Saving:
                return (<h3>Сохранение...</h3>);
            case SavingStatus.Saved:
                return (<>
                    <h3>Сохранено {PictureSave}</h3>
                    <CustomButton
                        onClick={() => this.props.onExit(this.state.editingTemplate)}
                        svgPicture={PictureCansel}
                        tooltipText={'Перейти к поиску'}
                    >
                        Ок
                    </CustomButton>
                </>);
            default: throw new Error('unknown state');
        }
    }

    private saveToDB() {
        fetchUpdatedPatientTemplate(
            this.state.editingTemplate.copy(),
            seriaizedData => {
                const parsedModel = PatientSearchTemplateVM.from(
                    JSON.parse(seriaizedData));
                this.setState({
                    editingTemplate: parsedModel,
                    savingStatus: SavingStatus.Saved
                });
            },
            (response, msg) => {
                const log = this.state.errorLog;
                this.setState({
                    errorLog: log.concat(`${log.length}) Not ok response: ${response.statusText}: ${msg}`)
                });
            },
            error => {
                const log = this.state.errorLog;
                this.setState({
                    errorLog: log.concat(`${log.length}) Error: ${error}`)
                });
            });
    }
}