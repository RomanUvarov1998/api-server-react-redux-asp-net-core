import {
    PatientVM, FieldValue, SavingStatus, PatientFieldDTM,
    PatientSearchTemplateVM,
    PatientDTM
} from "../library/patient";
import { Status } from "../library/history";
import { TableContainerState } from '../components/table-container/table-container'
import { TabNums } from "../components/table/table";
import { myFetch } from "../library/fetchHelper";
import * as Actions from '../store/actions';

export function onChangeTab(state: TableContainerState, newTabNum: TabNums): TableContainerState {
    return {
        ...state,
        tabNum: newTabNum
    }
}

export function onAddPatientToEditList(state: TableContainerState, patient: PatientVM): TableContainerState {
    let editingList;

    if (state.editingList.some(p => p.equals(patient))) {
        editingList = state.editingList;
    } else {
        editingList = state.editingList.concat(patient);
    }

    return {
        ...state,
        editingList
    }
}

export function onLoadMorePatients(state: TableContainerState,
    delayedStoreDispatch: undefined | ((action: Actions.MyAction) => void)): TableContainerState {
    const patientTemplate = state.patientTemplate!.copy();

    loadPatients(
        delayedStoreDispatch,
        patientTemplate,
        state.searchingList.length,
        state.loadCount);

    return {
        ...state,
        isWaitingPatientsList: true
    };
}

export function onRecievePatients(state: TableContainerState, patients: PatientVM[],
    append: boolean): TableContainerState {
    let searchingList =
        append ?
            state.searchingList.concat(patients) :
            patients;
    let canLoadMore = patients.length === state.loadCount;

    return {
        ...state,
        canLoadMore,
        searchingList,
        isWaitingPatientsList: false
    };
}

export function onRecievePatientFields(state: TableContainerState, patientTemplate: PatientSearchTemplateVM): TableContainerState {
    return {
        ...state,
        patientTemplate,
        isWaitingPatientFields: false
    }
}

export function onAdd(state: TableContainerState, filledTemplate: PatientSearchTemplateVM | undefined): TableContainerState {
    if (!state.patientTemplate) return state;

    const fields =
        filledTemplate ?
            filledTemplate.fields.map(f => new PatientFieldDTM(f.name, f.value, f.nameId)) :
            state.patientTemplate.fields.map(f => new PatientFieldDTM(f.name, '', f.nameId));

    const newPatient = new PatientVM(
        fields,
        -1,
        Status.Added
    );

    state.editingList.forEach(p => {
        if (p.id <= newPatient.id) {
            newPatient.id = p.id - 1;
        }
    });

    const editingList = state.editingList.concat(newPatient);

    return ({
        ...state,
        editingList,
        tabNum: TabNums.Editing
    })
}

export function onEdit(state: TableContainerState, patientCopy: PatientVM, fieldNameId: number,
    newValue: FieldValue): TableContainerState {
    let editedPatient = state.editingList.find(p => p.equals(patientCopy));

    if (!editedPatient) throw new Error('Editing patient not found');

    editedPatient = editedPatient!.updateField(fieldNameId, newValue);

    const editingList = state.editingList
        .map(p => p.equals(editedPatient!) ? (editedPatient!) : p);

    return {
        ...state,
        editingList
    };
}

export function onDelete(state: TableContainerState, id: number): TableContainerState {
    const deletingPatient = state.editingList.find(p => p.id === id);

    if (!deletingPatient) throw new Error('deletingPatient not found');

    deletingPatient.status = Status.Deleted;

    const editingList = state.editingList.slice();

    return ({
        ...state,
        editingList
    });
}

export function onSetSearchTemplate(state: TableContainerState,
    delayedStoreDispatch: undefined | ((action: Actions.MyAction) => void),
    newValue: FieldValue, fieldNameId: number): TableContainerState {
    if (!state.patientTemplate) throw new Error("template is null");

    const patientTemplate = state.patientTemplate.updateField(fieldNameId, newValue);

    loadPatients(
        delayedStoreDispatch,
        patientTemplate,
        0,
        state.loadCount);

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

export function onGiveVariants(state: TableContainerState, fieldNameId: number,
    variants: string[]): TableContainerState {
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

export function onClearSearchTemplate(state: TableContainerState,
    delayedStoreDispatch: undefined | ((action: Actions.MyAction) => void)
): TableContainerState {
    if (!state.patientTemplate) return state;

    const patientTemplate = state.patientTemplate.copy();
    patientTemplate.fields.forEach(f => f.value = '');

    loadPatients(
        delayedStoreDispatch,
        patientTemplate,
        0,
        state.loadCount);

    return ({
        ...state,
        patientTemplate
    });
}

export function onStartSaving(state: TableContainerState,
    delayedStoreDispatch: undefined | ((action: Actions.MyAction) => void)
): TableContainerState {
    const editingList = state.editingList.map(p => {
            p.savingStatus =
                p.status === Status.Untouched ?
                    SavingStatus.Saved :
                    SavingStatus.Saving;
            return p;
        });

    saveNextPatient(delayedStoreDispatch, state.editingList, 0);

    return {
        ...state,
        editingList
    };
}

export function onPatientSavedAdded(state: TableContainerState, newPatient: PatientVM, oldPatient: PatientVM): TableContainerState {
    const editingList = state.editingList
        .filter(p => !p.equals(oldPatient));

    newPatient.status = Status.Untouched;
    const searchingList = state.searchingList
        .map(p =>
            p.equals(oldPatient) ?
                newPatient :
                p);

    return {
        ...state,
        editingList,
        searchingList
    };
}

export function onPatientSavedUpdated(state: TableContainerState, updatedPatient: PatientVM): TableContainerState {
    const editingList = state.editingList
        .filter(p => !p.equals(updatedPatient));

    updatedPatient.status = Status.Untouched;
    const searchingList = state.searchingList
        .map(p =>
            p.equals(updatedPatient) ?
                updatedPatient :
                p);

    return {
        ...state,
        editingList,
        searchingList
    };
}

export function onPatientSavedDeleted(state: TableContainerState, deletedId: number): TableContainerState {
    const editingList = state.editingList
        .filter(p => p.id !== deletedId);

    const searchingList = state.searchingList
        .filter(p => p.id !== deletedId);

    return {
        ...state,
        editingList,
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

function saveNextPatient(
    delayedStoreDispatch: undefined | ((action: Actions.MyAction) => void),
    listToSave: PatientVM[], index: number) {
    while (
        index < listToSave.length &&
        listToSave[index].status === Status.Untouched
    ) {
        console.log(`patient ${listToSave[index].toString()} is untouched, next...`);
        index += 1;
    }

    if (index >= listToSave.length) {
        console.log('all saved!');
        return;
    }

    const patient = listToSave[index];
    let action;
    let processResponseBody: (value: string) => void;
    switch (patient.status) {
        case Status.Added:
            action = 'add';
            processResponseBody = (value: string) => {
                const parsedModel = JSON.parse(value) as PatientVM;
                const addedPatient = PatientVM.from(parsedModel);

                console.log(`added '${addedPatient.toString()}'`);
                if (delayedStoreDispatch) {
                    delayedStoreDispatch(Actions.savedAdded(addedPatient, patient));
                }
            };
            break;
        case Status.Modified:
            action = 'update';
            processResponseBody = (value: string) => {
                const parsedModel = JSON.parse(value) as PatientVM;
                const updatedPatient = PatientVM.from(parsedModel);

                console.log(`updated '${updatedPatient.toString()}'`);

                if (delayedStoreDispatch) {
                    delayedStoreDispatch(Actions.savedUpdated(updatedPatient));
                }
            };
            break;
        case Status.Deleted:
            action = 'delete';
            processResponseBody = (value: string) => {
                const deletedId = JSON.parse(value) as number;

                console.log(`deleted '${deletedId}'`);
                if (delayedStoreDispatch) {
                    delayedStoreDispatch(Actions.savedDeleted(deletedId));
                }
            };
            break;
        default: throw new Error(`unknown action ${action} on patient ${listToSave[index]}`);
    }

    myFetch(
        `patients/${action}`,
        'POST',
        JSON.stringify(PatientDTM.from(listToSave[index])),
        (value: string) => {
            processResponseBody(value);
            saveNextPatient(delayedStoreDispatch, listToSave, index + 1);
        }
    );
}