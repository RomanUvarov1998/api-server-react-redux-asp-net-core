import { Patient, FieldValue, FieldName } from "../library/patient";
import { AppState } from '../components/App'

export const onAdd = (state: AppState): AppState => {
    if (state.editingId) return state;

    var newPatient = new Patient(
        [
            { name: "name", value: "" },
            { name: "surname", value: "" },
            { name: "patronimyc", value: "" },
        ],
        state.patientsList.length + 1
    );
    var patientsList = state.history.add(newPatient);

    return ({
        ...state,
        editingId: newPatient.id,
        patientsList
    })
}

export const onEdit = (state: AppState, id: number, fieldName: FieldName, newValue: FieldValue): AppState => {
    var updatedPatientsList = state.history.edit(
        patient =>
            id === patient.id ?
                patient.update(fieldName, newValue) :
                patient
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
    var patientsList = state.history.del(patient => patient.id !== id)
    
    return ({
        ...state,
        editingId: 0,
        patientsList
    });
}

export const onSetSearchTemplate = (state: AppState, newValue: FieldValue, fieldName: FieldName): AppState => {
    var patientTemplate = state.patientTemplate.update(fieldName, newValue);
    return ({
        ...state,
        editingId: 0,
        patientTemplate
    });
}

export const onUndo = (state: AppState): AppState => {
    let newList = state.history.undo();
    console.log(newList === state.patientsList);
    return {
        ...state,
        patientsList: newList
    };
}

export const onRedo = (state: AppState): AppState => {
    return {
        ...state,
        patientsList: state.history.redo()
    };
}