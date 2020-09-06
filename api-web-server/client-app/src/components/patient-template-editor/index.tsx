import React from 'react';
import { Button, Container, ButtonToolbar, Col, Row } from 'reactstrap';
import { PatientSearchTemplateVM } from '../../library/patient';
import { FieldEditor } from '../field-editor';
import { Dictionary } from 'lodash';
import { CustomCancelBtn, CustomSaveBtn } from '../custom-buttons';

type PatientTemplateEditorProps = {
    initialTemplate: PatientSearchTemplateVM,
    onSave: (save: boolean, newTemplate: PatientSearchTemplateVM) => void
};
type PatientTemplateEditorState = {
    editingTemplate: PatientSearchTemplateVM,
    fieldValues: Dictionary<string>
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
            fieldValues
        };
    }

    render(): JSX.Element {
        const editFields = this.state.editingTemplate.fields.map((f, index) =>
            (<Col key={index}>
                <FieldEditor
                    labelText={this.state.fieldValues[f.nameId] + ':'}
                    value={f.name}
                    onChange={newValue => this.onEdit(f.nameId, newValue)}
                    disabled={false}
                    autofocus={index === 0}
                />
            </Col>)
        );

        return (
            <Container>
                <h1>Редактирование списка полей пациента</h1>
                <ButtonToolbar>
                    <CustomCancelBtn onClick={() => this.props.onSave(false, this.state.editingTemplate)} />
                    <CustomSaveBtn
                        onClick={() => this.props.onSave(true, this.state.editingTemplate)}
                        btnText={'Сохранить (пока что не сохранится в бд)'}
                        noTooltip={true}
                    />
                </ButtonToolbar>
                <Row>{editFields}</Row>
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
}