import { FieldValue, PatientVM, PatientSearchTemplateVM, PatientEditingVM } from "../library/patient";
import { Status } from "../library/history";

export const ACTION_RECIEVE_PATIENT_FIELDS = 'ACTION_RECIEVE_PATIENT_FIELDS';
export const ACTION_SET_SEARCH_TEMPLATE = 'ACTION_SET_SEARCH_TEMPLATE';
export const ACTION_GIVE_VARIANTS = 'ACTION_GIVE_VARIANTS';
export const ACTION_CLEAR_SEARCH_TEMPLATE = 'ACTION_CLEAR_SEARCH_TEMPLATE';
export const ACTION_RECIEVE_PATIENTS = 'ACTION_RECIEVE_PATIENTS';
export const ACTION_LOAD_MORE_PATIENTS = 'ACTION_LOAD_MORE_PATIENTS';

export const ACTION_ENTER_PATIENT_EDITOR = 'ACTION_ENTER_PATIENT_EDITOR';
export const ACTION_EXIT_PATIENT_EDITOR = 'ACTION_EXIT_PATIENT_EDITOR';

export const ACTION_START_EDIT_PATIENT_TEMPLATE = 'ACTION_START_EDIT_PATIENT_TEMPLATE';
export const ACTION_FINISH_EDIT_PATIENT_TEMPLATE = 'ACTION_FINISH_EDIT_PATIENT_TEMPLATE';

export const ACTION_NOTIFY_BAD_RESPONSE = 'ACTION_NOTIFY_BAD_RESPONSE';
export const ACTION_NOTIFY_RESPONSE_PROCESSING_ERROR = 'ACTION_NOTIFY_RESPONSE_PROCESSING_ERROR';

export type MyAction =
    ActionRecievePatientFields |
    ActionSetSearchTemplate |
    ActionGiveVariants |
    ActionClearSearchTemplate |
    ActionRecievePatients |
    ActionLoadMorePatients |

    ActionEnterPatientEditor |
    ActionExitPatientEditor |
    
    ActionNotifyBadResponse|
    ActionNotifyResponseProcessingError;

export type ActionRecievePatientFields = { type: string, patientTemplate: PatientSearchTemplateVM };
export type ActionSetSearchTemplate = { type: string, fieldNameId: number, newValue: FieldValue };
export type ActionGiveVariants = { type: string, fieldNameId: number, variants: string[] };
export type ActionClearSearchTemplate = { type: string };
export type ActionRecievePatients = { type: string, patients: PatientVM[], append: boolean };
export type ActionLoadMorePatients = { type: string };

export type ActionEnterPatientEditor = { type: string, patient: PatientEditingVM };
export type ActionExitPatientEditor = { type: string, patient?: PatientVM, status?: Status };

export type ActionStartEditPatientTemplate = { type: string };
export type ActionFinishEditPatientTemplate = { type: string, newTemplate?: PatientSearchTemplateVM };

export type ActionNotifyBadResponse = { type: string, response: Response, msg: string };
export type ActionNotifyResponseProcessingError = { type: string, error: any };


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

export function enterPatientEditor(patient: PatientEditingVM): ActionEnterPatientEditor {
    return {
        type: ACTION_ENTER_PATIENT_EDITOR,
        patient
    };
}
export function exitPatientEditor(status?: Status, patient?: PatientVM): ActionExitPatientEditor {
    return {
        type: ACTION_EXIT_PATIENT_EDITOR,
        patient,
        status
    };
}

export function startEditPatientTemplate(): ActionStartEditPatientTemplate {
    return {
        type: ACTION_START_EDIT_PATIENT_TEMPLATE
    };
}
export function finishEditPatientTemplate(newTemplate?: PatientSearchTemplateVM): ActionFinishEditPatientTemplate {
    return {
        type: ACTION_FINISH_EDIT_PATIENT_TEMPLATE,
        newTemplate
    };
}

export function notifyBadResponse(response: Response, msg: string): ActionNotifyBadResponse {
    return {
        type: ACTION_NOTIFY_BAD_RESPONSE,
        response,
        msg
    };
}
export function notifyResponseProcessingError(error: any): ActionNotifyResponseProcessingError {
    return {
        type: ACTION_NOTIFY_BAD_RESPONSE,
        error
    };
}