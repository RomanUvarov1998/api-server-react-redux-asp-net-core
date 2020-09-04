import React from 'react';
import { PatientVM, FieldValue, PatientSearchTemplateVM, PatientFieldDTM } from "../../library/patient";
import { SearchTable } from '../search-table/search-table';
import { PatientEditor } from '../patient-editor/patient-editor';
import { Status, History } from '../../library/history';

export type PatientManagerProps = {
    isWaitingPatientsList: boolean,
    isWaitingPatientFields: boolean,

    patientTemplate: PatientSearchTemplateVM | null,
    searchingList: PatientVM[],
    canLoadMore: boolean,
    loadPortionCount: number,
    onSetSearchTemplate: (fieldNameId: number, newValue: FieldValue) => void,
    giveVariants: (fieldNameId: number, variants: string[]) => void,
    onClearSearchTemplate: () => void,
    onLoadMorePatients: (template: PatientSearchTemplateVM, loadedCount: number, pageLength: number) => void,

    editingPatient: PatientVM | null,
    onEnterEditor: (patient: PatientVM | undefined) => void,
    onEditPatient: (fieldNameId: number, newValue: FieldValue) => void,
    onDelete: (id: number) => void,
    onExitEditor: (save: boolean) => void,
    isSyncronizingPatient: boolean
}

export class PatientManager extends React.Component<PatientManagerProps, {}, {}> {
    render(): React.ReactNode {
        let content;        
        const ep = this.props.editingPatient;
        
        if (ep && ep.status !== Status.Deleted && ep.status !== Status.Untouched) {
            content = (<PatientEditor 
                patient={this.props.editingPatient!}
                onUpdate={(fieldNameId: number, newValue: string) => 
                    this.props.onEditPatient(fieldNameId, newValue)}
                onExitEditor={this.props.onExitEditor}
                isSyncronizingPatient={this.props.isSyncronizingPatient}
            />);
        } else {
            content = (<SearchTable
                addPatientFromSearchFields={(patient: PatientSearchTemplateVM) => 
                    this.props.onEnterEditor(patient.toPatientVM())}
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
                onDelete={this.props.onDelete}
            />);
        }            

        return content;
    }
}