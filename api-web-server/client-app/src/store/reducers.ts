import { Patient, FieldValue, FieldName, PatientField, SavingStatus } from "../library/patient";
import { Status, copyList } from "../library/history";
import { AppState } from '../components/App'

export const onRecievePatients = (state: AppState, patients: Patient[]): AppState => {
    return {
        ...state,
        patientsList: patients
    }
}

export const onRecievePatientFields = (state: AppState, patientTemplate: Patient): AppState => {
    return {
        ...state,
        patientTemplate
    }
}

export const onAdd = (state: AppState): AppState => {
    if (state.editingId) return state;
    if (!state.patientTemplate) return state;

    var editingId = 1;
    var editingPatient;
    var patientsList;

    state.patientsList.forEach(p => {
        if (p.localId >= editingId) {
            editingId = p.localId + 1;
        }
    });

    var newPatient = new Patient(
        state.patientTemplate?.fields.map(
            f => new PatientField(f.name, f.value)
        ),
        "0",
        editingId,
        Status.Added
    );
    patientsList = state.history.add(newPatient, state.patientsList);
    editingPatient = newPatient.copy();

    return ({
        ...state,
        editingId,
        editingPatient,
        patientsList
    })
}

export const onStartEditing = (state: AppState, id: number): AppState => {
    if (state.editingId && state.editingId !== id) throw Error("reducers.ts already editing");

    var patientToEdit = state.patientsList.find(p => p.localId === id);
    if (!patientToEdit) throw Error("reducers.ts patientToEdit");

    return ({
        ...state,
        editingId : id,
        editingPatient: patientToEdit.copy()
    });
}

export function onFinishEditing(state: AppState, save: boolean) {
    var patientsList;

    if (!state.editingPatient) throw Error("reducers.ts editingPatient");

    var patientToEdit = state.patientsList.find(p => p.localId === state.editingId);
    if (!patientToEdit) throw Error("reducers.ts patientToEdit");

    if (save) {
        var template = (state.editingPatient as Patient).copy();
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
        editingId: 0,
        editingPatient: null
    });
}

export const onEdit = (state: AppState, fieldName: FieldName, newValue: FieldValue): AppState => {
    if (!state.editingPatient) throw Error("editingPatient reducers.ts");

    var editingPatient = (state.editingPatient as Patient).updateField(fieldName, newValue);

    return {
        ...state,
        editingPatient
    };
}

export const onDelete = (state: AppState, id: number): AppState => {
    var patientsList = state.history.del(
        patient => patient.localId === id,
        state.patientsList
    );

    return ({
        ...state,
        editingId: 0,
        patientsList
    });
}

export const onSetSearchTemplate = (state: AppState, newValue: FieldValue, fieldName: FieldName): AppState => {
    if (!state.patientTemplate) return state;

    var patientTemplate = state.patientTemplate.updateField(fieldName, newValue);
    return ({
        ...state,
        editingId: 0,
        patientTemplate
    });
}

export const onUndo = (state: AppState): AppState => {
    let newList = state.history.undo(state.patientsList);
    return {
        ...state,
        patientsList: newList
    };
}

export const onRedo = (state: AppState): AppState => {
    let newList = state.history.redo(state.patientsList);
    return {
        ...state,
        patientsList: newList
    };
}

export const onStartSaving = (state: AppState): AppState => {
    var patientsList = copyList(state.patientsList)
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

export const onSaved = (state: AppState, patient: Patient): AppState => {
    var patientsList = state.patientsList
        .filter(p => p.status !== Status.Deleted)
        .map(p => {
            var newP = p.copy();

            if (newP.equals(patient)) {
                newP.savingStatus = SavingStatus.Saved;
                newP.status = Status.Untouched;
            } else {
                newP.savingStatus = p.savingStatus;
            }

            return newP;
        });
    return {
        ...state,
        patientsList
    };
}