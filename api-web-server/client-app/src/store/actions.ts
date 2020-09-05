import { FieldValue, PatientVM, PatientSearchTemplateVM } from "../library/patient";
import { Status } from "../library/history";

export const ACTION_RECIEVE_PATIENT_FIELDS = 'ACTION_RECIEVE_PATIENT_FIELDS';
export const ACTION_SET_SEARCH_TEMPLATE = 'ACTION_SET_SEARCH_TEMPLATE';
export const ACTION_GIVE_VARIANTS = 'ACTION_GIVE_VARIANTS';
export const ACTION_CLEAR_SEARCH_TEMPLATE = 'ACTION_CLEAR_SEARCH_TEMPLATE';
export const ACTION_RECIEVE_PATIENTS = 'ACTION_RECIEVE_PATIENTS';
export const ACTION_LOAD_MORE_PATIENTS = 'ACTION_LOAD_MORE_PATIENTS';

export const ACTION_ENTER_EDITOR = 'ACTION_ENTER_EDITOR';
export const ACTION_EDIT_PATIENT = 'ACTION_EDIT_PATIENT';
export const ACTION_EXIT_EDITOR = 'ACTION_EXIT_EDITOR';
export const ACTION_GET_SAVING_RESULT = 'ACTION_GET_SAVING_RESULT';
export const ACTION_CONFIRM_SAVING_RESULT = 'ACTION_CONFIRM_SAVING_RESULT';

export const ACTION_START_EDIT_PATIENT_TEMPLATE = 'ACTION_START_EDIT_PATIENT_TEMPLATE';
export const ACTION_FINISH_EDIT_PATIENT_TEMPLATE = 'ACTION_FINISH_EDIT_PATIENT_TEMPLATE';

export type MyAction =
    ActionRecievePatientFields |
    ActionSetSearchTemplate |
    ActionGiveVariants |
    ActionClearSearchTemplate |
    ActionRecievePatients |
    ActionLoadMorePatients |

    ActionEnterEditor |
    ActionEditPatient |
    ActionExitEditor | 
    ActionConfirmSavingResult |
    ActionGetSavingResult;

export type ActionRecievePatientFields = { type: string, patientTemplate: PatientSearchTemplateVM };
export type ActionSetSearchTemplate = { type: string, fieldNameId: number, newValue: FieldValue };
export type ActionGiveVariants = { type: string, fieldNameId: number, variants: string[] };
export type ActionClearSearchTemplate = { type: string };
export type ActionRecievePatients = { type: string, patients: PatientVM[], append: boolean };
export type ActionLoadMorePatients = { type: string };

export type ActionEnterEditor = { type: string, patient: PatientVM | undefined, status: Status };
export type ActionEditPatient = { type: string, fieldNameId: number, newValue: FieldValue };
export type ActionExitEditor = { type: string, save: boolean };
export type ActionGetSavingResult = { type: string, success: boolean, message: string };
export type ActionConfirmSavingResult = { type: string };

export type ActionStartEditPatientTemplate = { type: string };
export type ActionFinishEditPatientTemplate = { type: string, save: boolean, newTemplate: PatientSearchTemplateVM };


export function recievePatientFields(patientTemplate: PatientSearchTemplateVM): ActionRecievePatientFields {
    return {
        type: ACTION_RECIEVE_PATIENT_FIELDS,
        patientTemplate
    };
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
export function recievePatients(patients: PatientVM[], append: boolean): ActionRecievePatients {
    return {
        type: ACTION_RECIEVE_PATIENTS,
        patients,
        append
    };
}
export function loadMorePatients(): ActionLoadMorePatients {
    return {
        type: ACTION_LOAD_MORE_PATIENTS
    };
}

export function enterEditor(patient: PatientVM | undefined, status: Status): ActionEnterEditor {
    return {
        type: ACTION_ENTER_EDITOR,
        patient,
        status
    };
}
export function editPatient(fieldNameId: number, newValue: FieldValue): ActionEditPatient {
    return {
        type: ACTION_EDIT_PATIENT,
        fieldNameId,
        newValue,
    }
}
export function exitEditor(save: boolean): ActionExitEditor {
    return {
        type: ACTION_EXIT_EDITOR,
        save
    };
}
export function getSavingResult(success: boolean, message: string): ActionGetSavingResult {
    return {
        type: ACTION_GET_SAVING_RESULT,
        success,
        message
    };
}
export function confirmSavingResult(): ActionConfirmSavingResult {
    return {
        type: ACTION_CONFIRM_SAVING_RESULT
    };
}

export function startEditPatientTemplate(): ActionStartEditPatientTemplate {
    return {
        type: ACTION_START_EDIT_PATIENT_TEMPLATE
    };
}
export function finishEditPatientTemplate(save: boolean, newTemplate: PatientSearchTemplateVM, ): ActionFinishEditPatientTemplate {
    return {
        type: ACTION_FINISH_EDIT_PATIENT_TEMPLATE,
        save,
        newTemplate
    };
}