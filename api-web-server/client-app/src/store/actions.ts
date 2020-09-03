import { FieldValue, PatientVM, PatientSearchTemplateVM } from "../library/patient";
import { TabNums } from "../components/table/table";

export const ACTION_CHANGE_TAB = 'ACTION_CHANGE_TAB';
export const ACTION_LOAD_MORE_PATIENTS = 'ACTION_LOAD_MORE_PATIENTS';
export const ACTION_RECIEVE_PATIENTS = 'ACTION_RECIEVE_PATIENTS';
export const ACTION_ADD_PATIENT_TO_EDIT_LIST = 'ACTION_ADD_PATIENT_TO_EDIT_LIST';
export const ACTION_RECIEVE_PATIENT_FIELDS = 'ACTION_RECIEVE_PATIENT_FIELDS';
export const ACTION_ADD_PATIENT = 'ACTION_ADD_PATIENT';
export const ACTION_START_EDIT_PATIENT = 'ACTION_START_EDIT_PATIENT';
export const ACTION_FINISH_EDIT_PATIENT = 'ACTION_FINISH_EDIT_PATIENT';
export const ACTION_EDIT_PATIENT = 'ACTION_EDIT_PATIENT';
export const ACTION_DELETE_PATIENT = 'ACTION_DELETE_PATIENT';
export const ACTION_SET_SEARCH_TEMPLATE = 'ACTION_SET_SEARCH_TEMPLATE';
export const ACTION_GIVE_VARIANTS = 'ACTION_GIVE_VARIANTS';
export const ACTION_CLEAR_SEARCH_TEMPLATE = 'ACTION_CLEAR_SEARCH_TEMPLATE';
export const ACTION_UNDO = 'ACTION_UNDO';
export const ACTION_REDO = 'ACTION_REDO';
export const ACTION_START_SAVING = 'ACTION_START_SAVING';
export const ACTION_SAVED_ADDED = 'ACTION_SAVED_ADDED';
export const ACTION_SAVED_UPDATED = 'ACTION_SAVED_UPDATED';
export const ACTION_SAVED_DELETED = 'ACTION_SAVED_DELETED';

export type MyAction =
    ActionChangeTab |
    ActionLoadMorePatients |
    ActionRecievePatients |
    ActionAddPatientToEditList |
    ActionRecievePatientFields |
    ActionAddPatient |
    ActionStartEditingPatient |
    ActionEditPatient |
    ActionDeletePatient |
    ActionSetSearchTemplate |
    ActionGiveVariants |
    ActionClearSearchTemplate |
    ActionUndo |
    ActionRedo |
    ActionStartSaving |
    ActionSavedAdded |
    ActionSavedUpdated |
    ActionSavedDeleted;

export type ActionChangeTab = { type: string, newTabNum: TabNums };
export type ActionLoadMorePatients = { type: string };
export type ActionRecievePatients = { type: string, patients: PatientVM[], append: boolean };
export type ActionAddPatientToEditList = { type: string, patient: PatientVM };
export type ActionRecievePatientFields = { type: string, patientTemplate: PatientSearchTemplateVM };
export type ActionAddPatient = { type: string, filledTemplate: PatientSearchTemplateVM | undefined };
export type ActionStartEditingPatient = { type: string, patientId: number };
export type ActionFinishEditingPatient = { type: string, save: boolean };
export type ActionEditPatient = { type: string, patientId: number, fieldNameId: number, newValue: FieldValue };
export type ActionDeletePatient = { type: string, patientId: number };
export type ActionSetSearchTemplate = { type: string, fieldNameId: number, newValue: FieldValue };
export type ActionGiveVariants = { type: string, fieldNameId: number, variants: string[] };
export type ActionClearSearchTemplate = { type: string };
export type ActionUndo = { type: string };
export type ActionRedo = { type: string };
export type ActionStartSaving = { type: string };
export type ActionSavedAdded = { type: string, newPatient: PatientVM, oldPatient: PatientVM };
export type ActionSavedUpdated = { type: string, updatedPatient: PatientVM };
export type ActionSavedDeleted = { type: string, deletedId: number };

export function changeTab(newTabNum: TabNums): ActionChangeTab {
    return {
        type: ACTION_CHANGE_TAB,
        newTabNum
    };
}
export function loadMorePatients(): ActionLoadMorePatients {
    return {
        type: ACTION_LOAD_MORE_PATIENTS
    };
}
export function recievePatients(patients: PatientVM[], append: boolean): ActionRecievePatients {
    return {
        type: ACTION_RECIEVE_PATIENTS,
        patients,
        append
    };
}
export function addPatientToEditList(patient: PatientVM): ActionAddPatientToEditList {
    return {
        type: ACTION_ADD_PATIENT_TO_EDIT_LIST,
        patient
    };
}
export function recievePatientFields(patientTemplate: PatientSearchTemplateVM): ActionRecievePatientFields {
    return {
        type: ACTION_RECIEVE_PATIENT_FIELDS,
        patientTemplate
    };
}
export function add(filledTemplate: PatientSearchTemplateVM | undefined = undefined): ActionAddPatient {
    return {
        type: ACTION_ADD_PATIENT,
        filledTemplate
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
export function giveVariants(fieldNameId: number, variants: string[]): ActionGiveVariants {
    return {
        type: ACTION_GIVE_VARIANTS,
        fieldNameId,
        variants
    };
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
export function savedAdded(newPatient: PatientVM, oldPatient: PatientVM): ActionSavedAdded {
    return {
        type: ACTION_SAVED_ADDED,
        newPatient,
        oldPatient
    };
}
export function savedUpdated(updatedPatient: PatientVM): ActionSavedUpdated {
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