import { Patient, FieldValue, FieldName, PatientField } from "../library/patient";
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
        editingId
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
    var editingId;
    var editingPatient;
    var patientsList;

    var patientToEdit = state.patientsList.find(p => p.localId === id);
    if (!patientToEdit) throw Error("reducers.ts pat");

    if (state.editingId === 0) { // start edit patient
        editingId = id;
        editingPatient = patientToEdit.copy();
        patientsList = state.patientsList;
    } else { // save patient
        editingId = 0;
        if (!state.editingPatient) throw Error("reducers.ts editingPatient");

        if (!(state.editingPatient as Patient).equalsByFields(patientToEdit)) {
            var template = (state.editingPatient as Patient).copy();
            patientsList = state.history.edit(
                patientToEdit,
                p => p.updateWhole(template),
                state.patientsList
            );
        } else {
            patientsList = state.patientsList;
        }

        editingPatient = null;
    }

    return ({
        ...state,
        patientsList,
        editingId,
        editingPatient
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

export const onSave = (state: AppState): AppState => {
    return {
        ...state
    };
}