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
    var patientsList = state.patientsList.concat(newPatient);

    return ({
        ...state,
        editingId: newPatient.id,
        patientsList
    })
}

export const onEdit = (state: AppState, id: number, fieldName: FieldName, newValue: FieldValue): AppState => {
    var updatedPatientsList = state.patientsList.map(patient =>
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
    var patientsList = state.patientsList
        .filter(patient => patient.id !== id);

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