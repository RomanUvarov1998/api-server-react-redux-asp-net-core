import { FieldValue, Patient } from "../library/patient";

export const ACTION_START_WAITING = 'ACTION_START_WAITING';
export const ACTION_LOAD_MORE_PATIENTS = 'ACTION_LOAD_MORE_PATIENTS';
export const ACTION_RECIEVE_PATIENTS = 'ACTION_RECIEVE_PATIENTS';
export const ACTION_ADD_PATIENT_TO_EDIT_LIST = 'ACTION_ADD_PATIENT_TO_EDIT_LIST';
export const ACTION_CLEAR_LIST = 'ACTION_CLEAR_LIST';
export const ACTION_RECIEVE_PATIENT_FIELDS = 'ACTION_RECIEVE_PATIENT_FIELDS';
export const ACTION_ADD_PATIENT = 'ACTION_ADD_PATIENT';
export const ACTION_START_EDIT_PATIENT = 'ACTION_START_EDIT_PATIENT';
export const ACTION_FINISH_EDIT_PATIENT = 'ACTION_FINISH_EDIT_PATIENT';
export const ACTION_EDIT_PATIENT = 'ACTION_EDIT_PATIENT';
export const ACTION_DELETE_PATIENT = 'ACTION_DELETE_PATIENT';
export const ACTION_SET_SEARCH_TEMPLATE = 'ACTION_SET_SEARCH_TEMPLATE';
export const ACTION_CLEAR_SEARCH_TEMPLATE = 'ACTION_CLEAR_SEARCH_TEMPLATE';
export const ACTION_UNDO = 'ACTION_UNDO';
export const ACTION_REDO = 'ACTION_REDO';
export const ACTION_START_SAVING = 'ACTION_START_SAVING';
export const ACTION_SAVED_ADDED = 'ACTION_SAVED_ADDED';
export const ACTION_SAVED_UPDATED = 'ACTION_SAVED_UPDATED';
export const ACTION_SAVED_DELETED = 'ACTION_SAVED_DELETED';

export type MyAction =
    ActionStartWaiting |
    ActionLoadMorePatients |
    ActionRecievePatients |
    ActionAddPatientToEditList |
    ActionClearList |
    ActionRecievePatientFields |
    ActionAddPatient |
    ActionStartEditingPatient |
    ActionEditPatient |
    ActionDeletePatient |
    ActionSetSearchTemplate |
    ActionClearSearchTemplate |
    ActionUndo |
    ActionRedo |
    ActionStartSaving |
    ActionSavedAdded |
    ActionSavedUpdated |
    ActionSavedDeleted;

export type ActionStartWaiting = { type: string, waitPatients: boolean, waitPatientFields: boolean };
export type ActionLoadMorePatients = { type: string };
export type ActionRecievePatients = { type: string, patients: Patient[], append: boolean };
export type ActionAddPatientToEditList = { type: string, patient: Patient };
export type ActionClearList = { type: string };
export type ActionRecievePatientFields = { type: string, patientTemplate: Patient };
export type ActionAddPatient = { type: string };
export type ActionStartEditingPatient = { type: string, patientId: number };
export type ActionFinishEditingPatient = { type: string, save: boolean };
export type ActionEditPatient = { type: string, patientId: number, fieldNameId: number, newValue: FieldValue };
export type ActionDeletePatient = { type: string, patientId: number };
export type ActionSetSearchTemplate = { type: string, fieldNameId: number, newValue: FieldValue };
export type ActionClearSearchTemplate = { type: string };
export type ActionUndo = { type: string };
export type ActionRedo = { type: string };
export type ActionStartSaving = { type: string };
export type ActionSavedAdded = { type: string, newPatient: Patient, oldPatient: Patient };
export type ActionSavedUpdated = { type: string, updatedPatient: Patient };
export type ActionSavedDeleted = { type: string, deletedId: number };

export function startWaiting(
    waitPatients: boolean,
    waitPatientFields: boolean
): ActionStartWaiting {
    return {
        type: ACTION_START_WAITING,
        waitPatients,
        waitPatientFields
    };
}
export function loadMorePatients(): ActionLoadMorePatients {
    return {
        type: ACTION_LOAD_MORE_PATIENTS
    };
}
export function recievePatients(patients: Patient[], append: boolean): ActionRecievePatients {
    return {
        type: ACTION_RECIEVE_PATIENTS,
        patients,
        append
    };
}
export function addPatientToEditList(patient: Patient): ActionAddPatientToEditList {
    return {
        type: ACTION_ADD_PATIENT_TO_EDIT_LIST,
        patient
    };
}
export function clearList(): ActionClearList {
    return {
        type: ACTION_CLEAR_LIST,
    };
}
export function recievePatientFields(patientTemplate: Patient): ActionRecievePatientFields {
    return {
        type: ACTION_RECIEVE_PATIENT_FIELDS,
        patientTemplate
    };
}
export function add(): ActionAddPatient {
    return {
        type: ACTION_ADD_PATIENT
    };
}
export function startEditing(patientId: number): ActionStartEditingPatient {
    return {
        type: ACTION_START_EDIT_PATIENT,
        patientId
    }
}
export function finishEditing(save: boolean): ActionFinishEditingPatient {
    return {
        type: ACTION_FINISH_EDIT_PATIENT,
        save
    }
}
export function edit(patientId: number, fieldNameId: number, newValue: FieldValue): ActionEditPatient {
    return {
        type: ACTION_EDIT_PATIENT,
        patientId,
        fieldNameId,
        newValue,
    }
}
export function del(patientId: number): ActionDeletePatient {
    return {
        type: ACTION_DELETE_PATIENT,
        patientId,
    }
}
export function setSearchTemplate(fieldNameId: number, newValue: FieldValue): ActionSetSearchTemplate {
    return {
        type: ACTION_SET_SEARCH_TEMPLATE,
        fieldNameId,
        newValue,
    }
}
export function clearSearchTemplate(): ActionClearSearchTemplate {
    return {
        type: ACTION_CLEAR_SEARCH_TEMPLATE
    }
}
export function undo(): ActionUndo {
    return {
        type: ACTION_UNDO
    };
}
export function redo(): ActionRedo {
    return {
        type: ACTION_REDO
    };
}
export function startSaving(): ActionStartSaving {
    return {
        type: ACTION_START_SAVING
    };
}
export function savedAdded(newPatient: Patient, oldPatient: Patient): ActionSavedAdded {
    return {
        type: ACTION_SAVED_ADDED,
        newPatient,
        oldPatient
    };
}
export function savedUpdated(updatedPatient: Patient): ActionSavedUpdated {
    return {
        type: ACTION_SAVED_UPDATED,
        updatedPatient
    };
}
export function savedDeleted(deletedId: number): ActionSavedDeleted {
    return {
        type: ACTION_SAVED_DELETED,
        deletedId
    };
}