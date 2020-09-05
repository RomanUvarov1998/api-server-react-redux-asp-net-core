import {
    PatientVM, FieldValue,
    PatientSearchTemplateVM,
    PatientDTM,
    SavingStatus
} from "../library/patient";
import { Status } from "../library/history";
import { MainContainerState } from '../components/main-container'
import { myFetch } from "../library/fetchHelper";
import * as Actions from '../store/actions';


export function onRecievePatientFields(state: MainContainerState, patientTemplate: PatientSearchTemplateVM): MainContainerState {
    return {
        ...state,
        patientTemplate,
        isWaitingPatientFields: false
    }
}
export function onSetSearchTemplate(state: MainContainerState,
    delayedStoreDispatch: undefined | ((action: Actions.MyAction) => void),
    newValue: FieldValue, fieldNameId: number): MainContainerState {
    if (!state.patientTemplate) throw new Error("template is null");

    const patientTemplate = state.patientTemplate.updateField(fieldNameId, newValue);

    loadPatients(
        delayedStoreDispatch,
        patientTemplate,
        0,
        state.loadPortionCount);

    myFetch(
        `patients/variants?fieldNameId=${fieldNameId}&maxCount=${5}`,
        'POST',
        JSON.stringify(patientTemplate),
        value => {
            const variants = JSON.parse(value) as string[];
            if (delayedStoreDispatch) {
                delayedStoreDispatch(Actions.giveVariants(fieldNameId, variants));
            }
        }
    );

    return ({
        ...state,
        patientTemplate
    });
}
export function onGiveVariants(state: MainContainerState, fieldNameId: number,
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
    delayedStoreDispatch: undefined | ((action: Actions.MyAction) => void)
): MainContainerState {
    if (!state.patientTemplate) return state;

    const patientTemplate = state.patientTemplate.copy();
    patientTemplate.fields.forEach(f => f.value = '');

    loadPatients(
        delayedStoreDispatch,
        patientTemplate,
        0,
        state.loadPortionCount);

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
    delayedStoreDispatch: undefined | ((action: Actions.MyAction) => void)): MainContainerState {
    const patientTemplate = state.patientTemplate!.copy();

    loadPatients(
        delayedStoreDispatch,
        patientTemplate,
        state.searchingList.length,
        state.loadPortionCount);

    return {
        ...state,
        isWaitingPatientsList: true
    };
}


export function onEnterEditor(state: MainContainerState, patient: PatientVM | undefined, status: Status): MainContainerState {
    if (!state.patientTemplate) throw new Error('No patient template');
    if (state.editingPatient) throw new Error('editingPatient must be null');

    const editingPatient =
        patient ?
            patient.copy() :
            state.patientTemplate.copyToPatientVM();

    editingPatient.status = status;
    editingPatient.savingStatus = SavingStatus.NotSaved;

    return ({
        ...state,
        editingPatient
    })
}
export function onExitEditor(state: MainContainerState, patient: PatientVM | undefined,
    delayedStoreDispatch: undefined | ((action: Actions.MyAction) => void)): MainContainerState {
    if (!state.editingPatient) throw new Error('editingPatient is null');

    let editingPatient;

    if (patient) {
        editingPatient = patient.copy();
        editingPatient.savingStatus = SavingStatus.Saving;

        syncronizePatientWithServer(delayedStoreDispatch, editingPatient!);
    } else {
        editingPatient = null;
    }

    return {
        ...state,
        editingPatient
    };
}
export function onGetSavingResult(state: MainContainerState, success: boolean,
    message: string): MainContainerState {
    if (!success) {
        console.log('Error occured');
        return state;
    }

    let searchingList: PatientVM[];

    if (!state.editingPatient) throw new Error('no editing patient');

    const editingPatient = state.editingPatient!.copy();
    const editingPatientCopy: PatientVM = state.editingPatient!.copy();

    editingPatient.savingStatus = SavingStatus.Saved;
    editingPatientCopy!.savingStatus = SavingStatus.Saved;

    editingPatient.status = Status.Untouched;

    switch (editingPatientCopy.status) {
        case Status.Added:
            searchingList = state.searchingList.concat(editingPatient);
            break;
        case Status.Modified:
            searchingList = state.searchingList.map(p =>
                p.equals(editingPatient) ? editingPatient : p);
            break;
        case Status.Deleted:
            searchingList = state.searchingList.filter(p =>
                !p.equals(editingPatient));
            break;
        default: throw new Error('patient state is untouched');
    }

    return {
        ...state,
        editingPatient: editingPatientCopy,
        searchingList
    };
}
export function onConfirmSavingResult(state: MainContainerState): MainContainerState {
    return {
        ...state,
        editingPatient: null,
    };
}


export function onStartEditPatientTemplate(state: MainContainerState): MainContainerState {
    return {
        ...state,
        isEditingPatientTemplate: true
    };
}
export function onFinishEditPatientTemplate(state: MainContainerState, save: boolean, newTemplate: PatientSearchTemplateVM): MainContainerState {
    const patientTemplate = save ? newTemplate : state.patientTemplate;

    return {
        ...state,
        isEditingPatientTemplate: false,
        patientTemplate
    };
}



export function loadPatients(
    delayedStoreDispatch: undefined | ((action: Actions.MyAction) => void),
    currentTemplate: PatientSearchTemplateVM, currentListLength: number,
    currentLoadCount: number) {
    myFetch(
        `patients/list?skip=${currentListLength}&take=${currentLoadCount}`,
        'POST',
        JSON.stringify(currentTemplate),
        (value: string) => {
            const data = JSON.parse(value) as PatientVM[];
            const append = currentListLength > 0;
            const patients = data.map(el => PatientVM.from(el));
            if (delayedStoreDispatch) {
                delayedStoreDispatch(Actions.recievePatients(patients, append));
            }
        });
}

function syncronizePatientWithServer(delayedStoreDispatch: undefined | ((action: Actions.MyAction) => void),
    patient: PatientVM) {
    const patientCopy = patient.copy();

    if (patientCopy.status === Status.Untouched) throw new Error('patient is untouched');

    let action;
    let processResponseBody: (value: string) => void;
    switch (patient.status) {
        case Status.Added:
            action = 'add';
            processResponseBody = (value: string) => {
                const parsedModel = JSON.parse(value) as PatientVM;
                const addedPatient = PatientVM.from(parsedModel);

                if (delayedStoreDispatch) {
                    delayedStoreDispatch(Actions
                        .getSavingResult(true, `added '${addedPatient.toString()}'`));
                }
            };
            break;
        case Status.Modified:
            action = 'update';
            processResponseBody = (value: string) => {
                const parsedModel = JSON.parse(value) as PatientVM;
                const updatedPatient = PatientVM.from(parsedModel);

                if (delayedStoreDispatch) {
                    delayedStoreDispatch(Actions.getSavingResult(true, `updated '${updatedPatient.toString()}'`));
                }
            };
            break;
        case Status.Deleted:
            action = 'delete';
            processResponseBody = (value: string) => {
                const deletedId = JSON.parse(value) as number;

                if (delayedStoreDispatch) {
                    delayedStoreDispatch(Actions.getSavingResult(true, `deleted '${deletedId}'`));
                }
            };
            break;
        default: throw new Error(`unknown action ${action} on patient ${patientCopy}`);
    }

    myFetch(
        `patients/${action}`,
        'POST',
        JSON.stringify(PatientDTM.from(patientCopy)),
        (value: string) => processResponseBody(value)
    );
}