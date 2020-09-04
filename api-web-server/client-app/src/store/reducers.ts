import {
    PatientVM, FieldValue, PatientFieldDTM,
    PatientSearchTemplateVM,
    PatientDTM
} from "../library/patient";
import { Status } from "../library/history";
import { MainContainerState } from '../components/main-container/main-container'
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


export function onEnterEditor(state: MainContainerState, patient: PatientVM | undefined): MainContainerState {
    if (!state.patientTemplate) throw new Error('No patient template');
    if (state.editingPatient) throw new Error('editingPatient must be null');

    const editingPatient =
        patient ?
            patient.copy() :
            new PatientVM(
                state.patientTemplate.fields.map(f => new PatientFieldDTM(f.name, '', f.nameId)),
                0,
                Status.Added
            );

    return ({
        ...state,
        editingPatient
    })
}
export function onEditPatient(state: MainContainerState, fieldNameId: number,
    newValue: FieldValue): MainContainerState {
    if (!state.editingPatient) throw new Error('Editing patient not found');

    const editedField = state.editingPatient!.fields.find(f => f.nameId === fieldNameId);
    if (!editedField) throw new Error('field not found');

    const editingPatient = state.editingPatient!.updateField(fieldNameId, newValue);

    return {
        ...state,
        editingPatient
    };
}
export function onDelete(state: MainContainerState, id: number,
    delayedDispatch: undefined | ((action: Actions.MyAction) => void)): MainContainerState {
    const deletingPatient = state.searchingList.find(p => p.id === id);
    if (!deletingPatient) throw new Error('deletingPatient not found');

    const deletingPatientCopy = deletingPatient!.copy();
    deletingPatientCopy.status = Status.Deleted;
    const editingPatient = deletingPatientCopy;

    syncronizePatientWithServer(delayedDispatch, deletingPatientCopy);

    return ({
        ...state,
        editingPatient
    });
}
export function onExitEditor(state: MainContainerState, save: boolean,
    delayedStoreDispatch: undefined | ((action: Actions.MyAction) => void)): MainContainerState {
    if (save) {
        syncronizePatientWithServer(delayedStoreDispatch, state.editingPatient!.copy());
    }

    const isSyncronizingPatient = save;

    const editingPatient = save ? state.editingPatient : null;

    return {
        ...state,
        isSyncronizingPatient,
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

    const editedPatient = state.editingPatient!.copy();
    editedPatient.status = Status.Untouched;

    switch (state.editingPatient.status) {
        case Status.Added:
            searchingList = state.searchingList.concat(editedPatient);
            break;
        case Status.Modified:
            searchingList = state.searchingList.map(p =>
                p.equals(editedPatient) ? editedPatient : p);
            break;
        case Status.Deleted:
            searchingList = state.searchingList.filter(p =>
                !p.equals(editedPatient));
            break;
        default: throw new Error('patient state is untouched');
    }

    return {
        ...state,
        editingPatient: null,
        isSyncronizingPatient: false,
        searchingList
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
                    delayedStoreDispatch(Actions.getSavingResult(true, `added '${addedPatient.toString()}'`));
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