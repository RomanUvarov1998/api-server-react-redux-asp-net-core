import {
    PatientVM, FieldValue,
    PatientSearchTemplateVM,
    SavingStatus,
    PatientEditingVM
} from "../library/patient";
import { Status } from "../library/history";
import { MainContainerState } from '../components/main-container'
import { fetchPatientsList, fetchVariants } from "../library/fetchHelper";
import * as Actions from '../store/actions';


export function onRecievePatientFields(state: MainContainerState, patientTemplate: PatientSearchTemplateVM): MainContainerState {
    const patientTemplateCopy = patientTemplate.copy();
    patientTemplateCopy.sortFieldsByNameId();
    return {
        ...state,
        patientTemplate: patientTemplateCopy,
        isWaitingPatientFields: false
    }
}
export function onSetSearchTemplate(state: MainContainerState,
    newValue: FieldValue, fieldNameId: number,
    delayedStoreDispatch: (action: Actions.MyAction) => void
): MainContainerState {
    if (!state.patientTemplate) throw new Error("template is null");

    const patientTemplate = state.patientTemplate.getUpdatedCopy(fieldNameId, newValue);

    fetchPatientsList(
        patientTemplate,
        0,
        state.loadPortionCount,
        delayedStoreDispatch);

    fetchVariants(
        fieldNameId,
        patientTemplate,
        delayedStoreDispatch);

    return ({
        ...state,
        patientTemplate
    });
}
export function onGiveVariants(state: MainContainerState,
    fieldNameId: number,
    variants: string[]): MainContainerState {
    if (!state.patientTemplate) throw new Error("template is null");

    const patientTemplate = state.patientTemplate.copy();
    patientTemplate.fields.forEach(f => {
        if (f.nameId === fieldNameId) {
            f.variants = variants.slice();
        } else {
            f.variants = [];
        }
    });

    return {
        ...state,
        patientTemplate
    };
}
export function onClearSearchTemplate(state: MainContainerState,
    delayedStoreDispatch: (action: Actions.MyAction) => void
): MainContainerState {
    if (!state.patientTemplate) return state;

    const patientTemplate = state.patientTemplate.copy();
    patientTemplate.fields.forEach(f => f.value = '');

    fetchPatientsList(
        patientTemplate,
        0,
        state.loadPortionCount,
        delayedStoreDispatch);

    return ({
        ...state,
        patientTemplate
    });
}
export function onRecievePatients(state: MainContainerState, patients: PatientVM[],
    append: boolean): MainContainerState {
    let searchingList =
        append ?
            state.searchingList.concat(patients) :
            patients;
    let canLoadMore = patients.length === state.loadPortionCount;

    return {
        ...state,
        canLoadMore,
        searchingList,
        isWaitingPatientsList: false
    };
}
export function onLoadMorePatients(state: MainContainerState,
    delayedStoreDispatch: (action: Actions.MyAction) => void
): MainContainerState {
    const patientTemplate = state.patientTemplate!.copy();

    fetchPatientsList(
        patientTemplate,
        state.searchingList.length,
        state.loadPortionCount,
        delayedStoreDispatch);

    return {
        ...state,
        isWaitingPatientsList: true
    };
}


export function onEnterEditor(state: MainContainerState, patient: PatientEditingVM): MainContainerState {
    if (!state.patientTemplate) throw new Error('No patient template');
    if (state.editingPatient) throw new Error('editingPatient must be null');

    const editingPatient = patient.copy();
    editingPatient.savingStatus = SavingStatus.NotSaved;

    return ({
        ...state,
        editingPatient
    })
}
export function onExitEditor(state: MainContainerState,
    patientAndAction?: { patient: PatientVM, status: Status }
): MainContainerState {
    if (!patientAndAction) return {
        ...state,
        editingPatient: undefined
    };

    const { patient, status } = patientAndAction;

    let searchingList;
    switch (status) {
        case Status.Added:
            searchingList = state.searchingList.concat(patient!);
            break;
        case Status.Modified:
            searchingList = state.searchingList.map(p =>
                p.equals(patient!) ? (patient!) : p);
            break;
        case Status.Deleted:
            searchingList = state.searchingList.filter(p =>
                !p.equals(patient!));
            break;
        default: throw new Error('patient state is untouched');
    }

    return {
        ...state,
        editingPatient: undefined,
        searchingList
    };
}


export function onStartEditPatientTemplate(state: MainContainerState): MainContainerState {
    return {
        ...state,
        isEditingPatientTemplate: true
    };
}
export function onFinishEditPatientTemplate(state: MainContainerState, newTemplate?: PatientSearchTemplateVM): MainContainerState {
    const patientTemplate = newTemplate ? newTemplate : state.patientTemplate;
    patientTemplate!.sortFieldsByNameId()

    return {
        ...state,
        isEditingPatientTemplate: false,
        patientTemplate
    };
}


export function onNotifyBadResponse(state: MainContainerState, response: Response, msg: string): MainContainerState {
    const previousLog = state.errorsLog;
    return {
        ...state,
        errorsLog: previousLog.concat(`${previousLog.length}) Bad response: ${response?.statusText}`)
    }
}
export function onNotifyResponseProcessingError(state: MainContainerState, error: any): MainContainerState {
    const previousLog = state.errorsLog;
    return {
        ...state,
        errorsLog: previousLog.concat(`${previousLog.length}) ResponseProcessingError: ${error}`)
    }
}
