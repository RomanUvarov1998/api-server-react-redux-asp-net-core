import { Patient, FieldValue, SavingStatus, PatientField, PatientSearchTemplate } from "../library/patient";
import { Status, copyList } from "../library/history";
import { TableContainerState } from '../components/table-container/table-container'
import { TabNums } from "../components/table/table";

export function onChangeTab(state: TableContainerState, newTabNum: TabNums): TableContainerState {
    return {
        ...state,
        tabNum: newTabNum
    }
}

export function onAddPatientToEditList(state: TableContainerState, patient: Patient): TableContainerState {
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

export function onLoadMorePatients(state: TableContainerState): TableContainerState {
    return {
        ...state,
        isWaitingPatientsList: true
    };
}

export function onRecievePatients(state: TableContainerState, patients: Patient[],
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

export function onClearList(state: TableContainerState): TableContainerState {
    let editingList = state.editingList.filter(p => p.status !== Status.Untouched);

    return {
        ...state,
        editingList
    }
}

export function onRecievePatientFields(state: TableContainerState, patientTemplate: PatientSearchTemplate): TableContainerState {
    return {
        ...state,
        patientTemplate,
        isWaitingPatientFields: false
    }
}

export function onAdd(state: TableContainerState): TableContainerState {
    if (!state.patientTemplate) return state;
    if (state.editingPatient !== null) return state;

    const newPatient = new Patient(
        state.patientTemplate.fields.map(f => new PatientField(f.name, '', f.nameId)),
        -1,
        Status.Added
    );

    state.editingList.forEach(p => {
        if (p.id <= newPatient.id) {
            newPatient.id = p.id - 1;
        }
    });

    const editingList = state.history.add(newPatient, state.editingList);
    const editingPatient = newPatient.copy();

    return ({
        ...state,
        editingPatient,
        editingList
    })
}

export function onStartEditing(state: TableContainerState, id: number): TableContainerState {
    if (state.editingPatient && state.editingPatient.id !== id)
        throw Error("reducers.ts already editing");

    const patientToEdit = state.editingList.find(p => p.id === id);
    if (!patientToEdit) throw Error("reducers.ts patientToEdit");

    return ({
        ...state,
        editingPatient: patientToEdit.copy()
    });
}

export function onFinishEditing(state: TableContainerState, save: boolean): TableContainerState {
    let editingList;

    if (!state.editingPatient) throw Error("reducers.ts editingPatient");

    const patientToEdit = state.editingList
        .find(p => p.id === (state.editingPatient as Patient).id);
    if (!patientToEdit) throw Error("reducers.ts patientToEdit");

    if (save) {
        const template = (state.editingPatient as Patient).copy();
        editingList = state.history.edit(
            patientToEdit,
            p => p.updateWhole(template),
            state.editingList
        );
    } else {
        editingList = state.editingList;
    }

    return ({
        ...state,
        editingList,
        editingPatient: null
    });
}

export function onEdit(state: TableContainerState, fieldNameId: number,
    newValue: FieldValue): TableContainerState {
    if (!state.editingPatient) throw Error("editingPatient reducers.ts");

    const editingPatient = (state.editingPatient as Patient).updateField(fieldNameId, newValue);

    return {
        ...state,
        editingPatient
    };
}

export function onDelete(state: TableContainerState, id: number): TableContainerState {
    const editingList = state.history.del(
        patient => patient.id === id,
        state.editingList
    );

    return ({
        ...state,
        editingList
    });
}

export function onSetSearchTemplate(state: TableContainerState, newValue: FieldValue,
    fieldNameId: number): TableContainerState {
    if (!state.patientTemplate) throw new Error("template is null");

    const patientTemplate = state.patientTemplate.updateField(fieldNameId, newValue);
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

export function onClearSearchTemplate(state: TableContainerState): TableContainerState {
    if (!state.patientTemplate) return state;

    const patientTemplate = state.patientTemplate.copy();
    patientTemplate.fields.forEach(f => f.value = '');
    return ({
        ...state,
        patientTemplate
    });
}

export function onUndo(state: TableContainerState): TableContainerState {
    let editingList = state.history.undo(state.editingList);
    return {
        ...state,
        editingList
    };
}

export function onRedo(state: TableContainerState): TableContainerState {
    let editingList = state.history.redo(state.editingList);
    return {
        ...state,
        editingList
    };
}

export function onStartSaving(state: TableContainerState): TableContainerState {
    const editingList = copyList(state.editingList)
        .map(p => {
            p.savingStatus =
                p.status === Status.Untouched ?
                    SavingStatus.Saved :
                    SavingStatus.Saving;
            return p;
        });
    return {
        ...state,
        editingList
    };
}

export function onPatientSavedAdded(state: TableContainerState, newPatient: Patient, oldPatient: Patient): TableContainerState {
    const editingList = state.editingList
        .map(p => {
            let newP;

            if (p.equals(oldPatient)) {
                newP = newPatient.copy();
                newP.savingStatus = SavingStatus.Saved;
                newP.status = Status.Untouched;
            } else {
                newP = p.copy();
                newP.savingStatus = p.savingStatus;
            }

            return newP;
        });

    if (!editingList.some(p => p.status !== Status.Untouched)) {
        state.history.clearHistory();
    }

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

export function onPatientSavedUpdated(state: TableContainerState, updatedPatient: Patient): TableContainerState {
    const editingList = state.editingList
        .map(p => {
            let newP;

            if (p.equals(updatedPatient)) {
                newP = updatedPatient.copy();
                newP.savingStatus = SavingStatus.Saved;
                newP.status = Status.Untouched;
            } else {
                newP = p.copy();
                newP.savingStatus = p.savingStatus;
            }

            return newP;
        });

    if (!editingList.some(p => p.status !== Status.Untouched)) {
        state.history.clearHistory();
    }

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

    if (!editingList.some(p => p.status !== Status.Untouched)) {
        state.history.clearHistory();
    }

    const searchingList = state.searchingList
        .filter(p => p.id !== deletedId);

    return {
        ...state,
        editingList,
        searchingList
    };
}