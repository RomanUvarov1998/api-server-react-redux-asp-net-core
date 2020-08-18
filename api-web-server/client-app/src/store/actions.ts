import { FieldValue, FieldName, Patient } from "../library/patient";

export const ACTION_WAIT_PATIENTS = 'ACTION_WAIT_PATIENTS';
export const ACTION_RECIEVE_PATIENTS = 'ACTION_RECIEVE_PATIENTS';
export const ACTION_ADD_PATIENT = 'ACTION_ADD_PATIENT';
export const ACTION_START_EDIT_PATIENT = 'ACTION_START_EDIT_PATIENT';
export const ACTION_EDIT_PATIENT = 'ACTION_EDIT_PATIENT';
export const ACTION_DELETE_PATIENT = 'ACTION_DELETE_PATIENT';
export const ACTION_SET_SEARCH_TEMPLATE = 'ACTION_SET_SEARCH_TEMPLATE';
export const ACTION_UNDO = 'ACTION_UNDO';
export const ACTION_REDO = 'ACTION_REDO';

export type ActionRecievePatients = { type: string, patients: Patient[] };
export type ActionAddPatient = { type: string };
export type ActionStartEditingPatient = { type: string, patientId: number };
export type ActionEditPatient = { type: string, patientId: number, fieldName: FieldName, newValue: FieldValue };
export type ActionDeletePatient = { type: string, patientId: number };
export type ActionSetSearchTemplate = { type: string, fieldName: FieldName, newValue: FieldValue };
export type ActionUndo = { type: string };
export type ActionRedo = { type: string };

export const onWait = () => {
    return { 
        type: ACTION_WAIT_PATIENTS
    };
}
export const onRecieve = (patients: Patient[]) => {
    return { 
        type: ACTION_RECIEVE_PATIENTS,
        patients
    };
}
export const onAdd = () => {
    return { 
        type: ACTION_ADD_PATIENT 
    };
}
export const onStartEditing = (patientId: number) => {
    return {
        type: ACTION_START_EDIT_PATIENT,
        patientId
    }
}
export const onEdit = (patientId: number, fieldName: FieldName, newValue: FieldValue) => {
    return {
        type: ACTION_EDIT_PATIENT,
        patientId,
        fieldName,
        newValue,
    }
}
export const onDelete = (patientId: number) => {
    return {
        type: ACTION_DELETE_PATIENT,
        patientId,
    }
}
export const onSetSearchTemplate = (fieldName: FieldName, newValue: FieldValue) => {
    return {
        type: ACTION_SET_SEARCH_TEMPLATE,
        fieldName,
        newValue,
    }
}
export const onUndo = () => {
    return {
        type: ACTION_UNDO
    };
}
export const onRedo = () => {
    return {
        type: ACTION_REDO
    };
}