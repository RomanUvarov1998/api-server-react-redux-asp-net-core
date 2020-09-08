import React from 'react';
import { PatientVM, FieldValue, PatientSearchTemplateVM, PatientEditingVM  } from "../../library/patient";
import { SearchTable } from '../search-table';
import { PatientEditor } from '../patient-editor';
import { PatientTemplateEditor } from '../patient-template-editor';
import { Status } from '../../library/history';

export type PatientManagerProps = {
    isWaitingPatientsList: boolean,
    isWaitingPatientFields: boolean,

    isEditingPatientTemplate: boolean,
    patientTemplate?: PatientSearchTemplateVM,
    searchingList: PatientVM[],
    canLoadMore: boolean,
    loadPortionCount: number,
    onSetSearchTemplate: (fieldNameId: number, newValue: FieldValue) => void,
    giveVariants: (fieldNameId: number, variants: string[]) => void,
    onClearSearchTemplate: () => void,
    onLoadMorePatients: (template: PatientSearchTemplateVM, loadedCount: number, pageLength: number) => void,

    editingPatient?: PatientEditingVM,
    onEnterEditor: (patient: PatientEditingVM) => void,
    onExitEditor: (status?: Status, patient?: PatientVM) => void,

    onStartEditPatientTemplate: () => void,
    onFinishEditPatientTemplate: (newTemplate?: PatientSearchTemplateVM) => void,

    errorsLog: string
}

export class PatientManager extends React.Component<PatientManagerProps, {}, {}> {
    render(): React.ReactNode {
        let content;

        if (this.props.isEditingPatientTemplate) {
            content = (<PatientTemplateEditor
                initialTemplate={this.props.patientTemplate!.copy()}
                onExit={this.props.onFinishEditPatientTemplate}
            />);
        } else if (this.props.editingPatient) {
            content = (<PatientEditor
                patient={this.props.editingPatient!}
                onExitEditor={this.props.onExitEditor}
            />);
        } else {
            content = (<SearchTable
                addPatientFromSearchFields={patient =>
                    this.props.onEnterEditor(
                        PatientEditingVM.newFromPatientSearchTemplateVM(patient))}
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

        return (
            <>
            <h1>{this.props.errorsLog}</h1>
            {content}
            </>
        );
    }
}