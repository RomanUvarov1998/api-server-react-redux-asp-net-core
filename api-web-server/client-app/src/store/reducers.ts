import { Patient, FieldValue, SavingStatus } from "../library/patient";
import { Status, copyList } from "../library/history";
import { TableContainerState } from '../components/table-container/table-container'

export function onAddPatientToEditList(state: TableContainerState, patient: Patient): TableContainerState {
    let patientsList;

    if (state.patientsList.some(p => p.equals(patient))) {
        patientsList = state.patientsList;
    } else {
        patientsList = state.patientsList.concat(patient);
    }

    return {
        ...state,
        patientsList
    }
}

export function onClearList(state: TableContainerState): TableContainerState {
    let patientsList = state.patientsList.filter(p => p.status !== Status.Untouched);

    return {
        ...state,
        patientsList
    }
}

export function onRecievePatientFields(state: TableContainerState, patientTemplate: Patient): TableContainerState {
    return {
        ...state,
        patientTemplate
    }
}

export function onAdd(state: TableContainerState): TableContainerState {
    if (!state.patientTemplate) return state;
    if (state.editingPatient !== null) return state;

    const newPatient = new Patient(
        state.patientTemplate.fields.map(f => f.copy()),
        -1,
        Status.Added
    );

    state.patientsList.forEach(p => {
        if (p.id <= newPatient.id) {
            newPatient.id = p.id - 1;
        }
    });

    const patientsList = state.history.add(newPatient, state.patientsList);
    const editingPatient = newPatient.copy();

    return ({
        ...state,
        editingPatient,
        patientsList
    })
}

export function onStartEditing(state: TableContainerState, id: number): TableContainerState {
    if (state.editingPatient && state.editingPatient.id !== id)
        throw Error("reducers.ts already editing");

    const patientToEdit = state.patientsList.find(p => p.id === id);
    if (!patientToEdit) throw Error("reducers.ts patientToEdit");

    return ({
        ...state,
        editingPatient: patientToEdit.copy()
    });
}

export function onFinishEditing(state: TableContainerState, save: boolean): TableContainerState {
    let patientsList;

    if (!state.editingPatient) throw Error("reducers.ts editingPatient");

    const patientToEdit = state.patientsList
        .find(p => p.id === (state.editingPatient as Patient).id);
    if (!patientToEdit) throw Error("reducers.ts patientToEdit");

    if (save) {
        const template = (state.editingPatient as Patient).copy();
        patientsList = state.history.edit(
            patientToEdit,
            p => p.updateWhole(template),
            state.patientsList
        );
    } else {
        patientsList = state.patientsList;
    }

    return ({
        ...state,
        patientsList,
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
    const patientsList = state.history.del(
        patient => patient.id === id,
        state.patientsList
    );

    return ({
        ...state,
        patientsList
    });
}

export function onSetSearchTemplate(state: TableContainerState, newValue: FieldValue, 
    fieldNameId: number): TableContainerState {
    if (!state.patientTemplate) return state;

    const patientTemplate = state.patientTemplate.updateField(fieldNameId, newValue);
    return ({
        ...state,
        patientTemplate
    });
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
    let newList = state.history.undo(state.patientsList);
    return {
        ...state,
        patientsList: newList
    };
}

export function onRedo(state: TableContainerState): TableContainerState {
    let newList = state.history.redo(state.patientsList);
    return {
        ...state,
        patientsList: newList
    };
}

export function onStartSaving(state: TableContainerState): TableContainerState {
    const patientsList = copyList(state.patientsList)
        .map(p => {
            p.savingStatus =
                p.status === Status.Untouched ?
                    SavingStatus.Saved :
                    SavingStatus.Saving;
            return p;
        });
    return {
        ...state,
        patientsList
    };
}

export function onPatientSavedAdded(state: TableContainerState, newPatient: Patient, oldPatient: Patient): TableContainerState {
    const patientsList = state.patientsList
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
    return {
        ...state,
        patientsList
    };
}

export function onPatientSavedUpdated(state: TableContainerState, updatedPatient: Patient): TableContainerState {
    const patientsList = state.patientsList
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
    return {
        ...state,
        patientsList
    };
}

export function onPatientSavedDeleted(state: TableContainerState, deletedId: number): TableContainerState {
    const patientsList = state.patientsList
        .filter(p => p.id !== deletedId);
    return {
        ...state,
        patientsList
    };
}