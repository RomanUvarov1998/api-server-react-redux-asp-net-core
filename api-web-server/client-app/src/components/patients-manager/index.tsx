import React from 'react';
import { PatientVM, FieldValue, PatientSearchTemplateVM  } from "../../library/patient";
import { SearchTable } from '../search-table';
import { PatientEditor } from '../patient-editor';
import { PatientTemplateEditor } from '../patient-template-editor';
import { Status } from '../../library/history';

export type PatientManagerProps = {
    isWaitingPatientsList: boolean,
    isWaitingPatientFields: boolean,

    isEditingPatientTemplate: boolean,
    patientTemplate: PatientSearchTemplateVM | null,
    searchingList: PatientVM[],
    canLoadMore: boolean,
    loadPortionCount: number,
    onSetSearchTemplate: (fieldNameId: number, newValue: FieldValue) => void,
    giveVariants: (fieldNameId: number, variants: string[]) => void,
    onClearSearchTemplate: () => void,
    onLoadMorePatients: (template: PatientSearchTemplateVM, loadedCount: number, pageLength: number) => void,

    editingPatient: PatientVM | null,
    onEnterEditor: (patient: PatientVM | undefined, status: Status) => void,
    onEditPatient: (fieldNameId: number, newValue: FieldValue) => void,
    onExitEditor: (save: boolean) => void,
    onConfirmSavingResult: () => void,

    onStartEditPatientTemplate: () => void,
    onFinishEditPatientTemplate: (save: boolean, newTemplate: PatientSearchTemplateVM) => void,
}

export class PatientManager extends React.Component<PatientManagerProps, {}, {}> {
    render(): React.ReactNode {
        let content;

        if (this.props.isEditingPatientTemplate) {
            content = (<PatientTemplateEditor
                initialTemplate={this.props.patientTemplate!.copy()}
                onSave={this.props.onFinishEditPatientTemplate}
            />);
        } else if (this.props.editingPatient) {
            content = (<PatientEditor
                patient={this.props.editingPatient!}
                onUpdate={(fieldNameId: number, newValue: string) =>
                    this.props.onEditPatient(fieldNameId, newValue)}
                onExitEditor={this.props.onExitEditor}
                onConfirmSavingResult={this.props.onConfirmSavingResult}
            />);
        } else {
            content = (<SearchTable
                addPatientFromSearchFields={(patient: PatientSearchTemplateVM) =>
                    this.props.onEnterEditor(patient.toPatientVM(), Status.Added)}
                isWaitingPatientsList={this.props.isWaitingPatientsList}
                isWaitingPatientFields={this.props.isWaitingPatientFields}
                patientsList={this.props.searchingList}
                patientTemplate={this.props.patientTemplate}
                canLoadMore={this.props.canLoadMore}
                loadPortionCount={this.props.loadPortionCount}
                onSetSearchTemplate={this.props.onSetSearchTemplate}
                giveVariants={this.props.giveVariants}
                onClearTemplate={this.props.onClearSearchTemplate}
                onLoadMore={this.props.onLoadMorePatients}
                onEnterEditor={this.props.onEnterEditor}
                onStartEditPatientTemplate={this.props.onStartEditPatientTemplate}
            />);
        }

        return content;
    }
}