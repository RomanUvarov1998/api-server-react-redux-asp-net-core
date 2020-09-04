import React from 'react';
import { Button } from 'reactstrap';
import { PatientSearchTemplateVM, PatientSearchTemplateFieldVM } from '../../library/patient';

type PatientTemplateEditorProps = {
    initialTemplate: PatientSearchTemplateVM,
    onSave: (save: boolean, newTemplate: PatientSearchTemplateVM) => void
};
type PatientTemplateEditorState = {
    editingTemplate: PatientSearchTemplateVM
};

export class PatientTemplateEditor extends React.Component<PatientTemplateEditorProps,
    PatientTemplateEditorState, {}> {
    constructor(props: PatientTemplateEditorProps) {
        super(props);
        this.state = {
            editingTemplate: props.initialTemplate.copy()
        };
    }

    render(): JSX.Element {
        const editFields = this.state.editingTemplate.fields.map((f, index) =>
            (<PatientTemplateEditField
                key={index}
                initialName={this.props.initialTemplate.fields.find(fi =>
                    fi.nameId === f.nameId)!.name}
                field={f}
                onEdit={this.onEdit}
                autofocus={index === 0}
            />)
        );

        return (
            <>
                <Button
                    onClick={() => this.props.onSave(true, this.state.editingTemplate)}
                >Сохранить</Button>
                <Button
                    onClick={() => this.props.onSave(false, this.state.editingTemplate)}
                >Отмена</Button>
                {editFields}
            </>
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

type PatientTemplateEditFieldProps = {
    initialName: string,
    field: PatientSearchTemplateFieldVM,
    onEdit: (nameId: number, newName: string) => void,
    autofocus: boolean
}
function PatientTemplateEditField(props: PatientTemplateEditFieldProps): JSX.Element {
    const inputId = `ptef${props.field.nameId}`;
    return (
        <>
            <label
                htmlFor={inputId}
                style={{ display: 'block' }}
            >{`${props.initialName}:`}</label>
            <input
                value={props.field.name}
                onChange={e => props.onEdit(props.field.nameId, e.currentTarget.value)}
                autoFocus={props.autofocus}
            />
        </>
    );
}