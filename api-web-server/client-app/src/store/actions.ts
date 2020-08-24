import { FieldValue, FieldName, Patient } from "../library/patient";

export const ACTION_START_WAITING = 'ACTION_START_WAITING';
export const ACTION_RECIEVE_PATIENTS = 'ACTION_RECIEVE_PATIENTS';
export const ACTION_RECIEVE_PATIENT_FIELDS = 'ACTION_RECIEVE_PATIENT_FIELDS';
export const ACTION_ADD_PATIENT = 'ACTION_ADD_PATIENT';
export const ACTION_START_EDIT_PATIENT = 'ACTION_START_EDIT_PATIENT';
export const ACTION_FINISH_EDIT_PATIENT = 'ACTION_FINISH_EDIT_PATIENT';
export const ACTION_EDIT_PATIENT = 'ACTION_EDIT_PATIENT';
export const ACTION_DELETE_PATIENT = 'ACTION_DELETE_PATIENT';
export const ACTION_SET_SEARCH_TEMPLATE = 'ACTION_SET_SEARCH_TEMPLATE';
export const ACTION_UNDO = 'ACTION_UNDO';
export const ACTION_REDO = 'ACTION_REDO';
export const ACTION_START_SAVING = 'ACTION_START_SAVING';
export const ACTION_SAVED = 'ACTION_SAVED';

export type MyAction =
    ActionStartWaiting |
    ActionRecievePatients |
    ActionRecievePatientFields |
    ActionAddPatient |
    ActionStartEditingPatient |
    ActionEditPatient |
    ActionDeletePatient |
    ActionSetSearchTemplate |
    ActionUndo |
    ActionRedo |
    ActionStartSaving |
    ActionSaved;

export type ActionStartWaiting = { type: string, waitPatients: boolean, waitPatientFields: boolean };
export type ActionRecievePatients = { type: string, patients: Patient[] };
export type ActionRecievePatientFields = { type: string, patientTemplate: Patient };
export type ActionAddPatient = { type: string };
export type ActionStartEditingPatient = { type: string, patientId: number };
export type ActionFinishEditingPatient = { type: string, save: boolean };
export type ActionEditPatient = { type: string, patientId: number, fieldName: FieldName, newValue: FieldValue };
export type ActionDeletePatient = { type: string, patientId: number };
export type ActionSetSearchTemplate = { type: string, fieldName: FieldName, newValue: FieldValue };
export type ActionUndo = { type: string };
export type ActionRedo = { type: string };
export type ActionStartSaving = { type: string };
export type ActionSaved = { type: string, patient: Patient };

export const startWaiting = (
    waitPatients: boolean,
    waitPatientFields: boolean
) => {
    return {
        type: ACTION_START_WAITING,
        waitPatients,
        waitPatientFields
    };
}
export const recievePatients = (patients: Patient[]) => {
    return {
        type: ACTION_RECIEVE_PATIENTS,
        patients
    };
}
export const recievePatientFields = (patientTemplate: Patient) => {
    return {
        type: ACTION_RECIEVE_PATIENT_FIELDS,
        patientTemplate
    };
}
export const add = () => {
    return {
        type: ACTION_ADD_PATIENT
    };
}
export const startEditing = (patientId: number) => {
    return {
        type: ACTION_START_EDIT_PATIENT,
        patientId
    }
}
export const finishEditing = (save: boolean) => {
    return {
        type: ACTION_FINISH_EDIT_PATIENT,
        save
    }
}
export const edit = (patientId: number, fieldName: FieldName, newValue: FieldValue) => {
    return {
        type: ACTION_EDIT_PATIENT,
        patientId,
        fieldName,
        newValue,
    }
}
export const del = (patientId: number) => {
    return {
        type: ACTION_DELETE_PATIENT,
        patientId,
    }
}
export const setSearchTemplate = (fieldName: FieldName, newValue: FieldValue) => {
    return {
        type: ACTION_SET_SEARCH_TEMPLATE,
        fieldName,
        newValue,
    }
}
export const undo = () => {
    return {
        type: ACTION_UNDO
    };
}
export const redo = () => {
    return {
        type: ACTION_REDO
    };
}
export const startSaving = () => {
    return {
        type: ACTION_START_SAVING
    };
}
export const saved = (patient: Patient) => {
    return {
        type: ACTION_SAVED,
        patient
    };
}