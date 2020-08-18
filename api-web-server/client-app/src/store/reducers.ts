import { Patient, FieldValue, FieldName } from "../library/patient";
import { AppState } from '../components/App'

export const onWait = (state: AppState): AppState => {
    return {
        ...state,
    }
}

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

    var newLocalId = 1;
    state.patientsList.forEach(p => {
        if (p.id >= newLocalId) {
            newLocalId = p.id + 1;
        }
    });
    
    var newPatient = new Patient(
        [
            { name: "name", value: "" },
            { name: "surname", value: "" },
            { name: "patronimyc", value: "" },
        ],
        newLocalId
    );
    var patientsList = state.history.add(newPatient, state.patientsList);

    return ({
        ...state,
        editingId: newPatient.id,
        patientsList
    })
}

export const onEdit = (state: AppState, id: number, fieldName: FieldName, newValue: FieldValue): AppState => {
    let itemToEdit = state.patientsList.find(p => p.id === id);
    if (!itemToEdit) throw Error("itemToEdit reducers.ts");

    let updatedPatientsList = state.history.edit(
        itemToEdit as Patient,
        p => p.update(fieldName, newValue),
        state.patientsList
    );

    return {
        ...state,
        patientsList: updatedPatientsList
    };
}

export const onStartEditing = (state: AppState, id: number): AppState => {
    var newId = state.editingId;

    if (state.editingId !== id) {
        if (state.editingId) return state;
        newId = id;
    } else {
        newId = 0;
    }

    return ({
        ...state,
        editingId: newId
    });
}

export const onDelete = (state: AppState, id: number): AppState => {
    var patientsList = state.history.del(
        patient => patient.id === id,
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
    
    var patientTemplate = state.patientTemplate.update(fieldName, newValue);
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