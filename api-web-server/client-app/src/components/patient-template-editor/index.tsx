import React from 'react';
import { Container, ButtonToolbar, Col, Row, Button } from 'reactstrap';
import { PatientSearchTemplateVM, SavingStatus, PatientSearchTemplateFieldVM } from '../../library/patient';
import { FieldEditor } from '../field-editor';
import { Dictionary } from 'lodash';
import { CustomButton, PictureCansel, PictureSave, PictureAdd } from '../custom-button';
import { fetchUpdatedPatientTemplate } from '../../library/fetchHelper';

type PatientTemplateEditorProps = {
    initialTemplate: PatientSearchTemplateVM,
    onExit: (newTemplate?: PatientSearchTemplateVM) => void
};
type PatientTemplateEditorState = {
    editingTemplate: PatientSearchTemplateVM,
    savingStatus: SavingStatus,
    fieldValues: Dictionary<string>,
    errorLog: string,
    lastAddedField?: PatientSearchTemplateFieldVM
};

export class PatientTemplateEditor extends React.Component<PatientTemplateEditorProps,
    PatientTemplateEditorState, {}> {
    constructor(props: PatientTemplateEditorProps) {
        super(props);

        const fieldValues: Dictionary<string> = {};
        props.initialTemplate.fields.forEach(f =>
            fieldValues[f.nameId] = f.name);

        this.state = {
            editingTemplate: props.initialTemplate.copy(),
            savingStatus: SavingStatus.NotSaved,
            fieldValues,
            errorLog: ''
        };
    }

    render(): JSX.Element {
        return (
            <Container>
                <h1>Редактирование списка полей пациента</h1>
                <h1>{this.state.errorLog}</h1>
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

    private onAddNewField = () => {
        const lastAddedField = new PatientSearchTemplateFieldVM('', 0, [], '');
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
                        fieldValues[f.nameId] ?
                            fieldValues[f.nameId] :
                            '[Новое поле]';

                    return (<Col key={index}>
                        <FieldEditor
                            labelText={`${initialName}:`}
                            value={f.name}
                            onChange={newValue => this.onEdit(f.nameId, newValue)}
                            disabled={false}
                            autofocus={autofocusPredicate(f, index)}
                        />
                    </Col>)
                }
                );
                return (<Row>{editFields}</Row>);
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
                    />
                    <CustomButton
                        onClick={() => this.saveToDB()}
                        svgPicture={PictureSave}
                        btnText={'Сохранить'}
                    />
                </>);
            case SavingStatus.Saving:
                return (<h3>Сохранение...</h3>);
            case SavingStatus.Saved:
                return (<>
                    <h3>Сохранено {PictureSave}</h3>
                    <Button onClick={() => this.props.onExit(this.state.editingTemplate)}>
                        Ок
                    </Button>
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
            response => {
                const log = this.state.errorLog;
                this.setState({
                    errorLog: `${log}\nBad response: ${response.statusText}`
                });
            },
            error => {
                const log = this.state.errorLog;
                this.setState({
                    errorLog: `${log}\nError: ${error}`
                });
            });
    }
}