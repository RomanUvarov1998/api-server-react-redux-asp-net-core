import { createStore, combineReducers } from 'redux'
import * as Actions from './actions';
import { Patient, PatientField } from '../library/patient'
import * as Reducers from './reducers';
import { AppState } from '../components/App'

export function createInitialState() {
    var p1: Patient = new Patient(
        [
            { name: "name", value: "vasya" },
            { name: "surname", value: "petrov" },
            { name: "patronimyc", value: "m" },
        ],
        1
    );
    var p2: Patient = new Patient(
        [
            { name: "name", value: "misha" },
            { name: "surname", value: "ivanov" },
            { name: "patronimyc", value: "p" },
        ],
        2
    );
    var patientsList: Patient[] = [p1, p2];

    var patientTemplate = new Patient(
        [
            new PatientField("name", ""),
            new PatientField("surname", ""),
            new PatientField("patronimyc", ""),
        ],
        0
    );

    return {
        patientsList,
        patientTemplate,
        editingId: 0
    };
}

export function configureStore(initialState: AppState) {
    const red = (state = initialState, action: Actions.MyAction): AppState => {
        let a;
        switch (action.type) {
            case Actions.ACTION_ADD_PATIENT:
                return Reducers.onAdd(
                    state
                );
            case Actions.ACTION_START_EDIT_PATIENT:
                a = action as Actions.ActionStartEditingPatient;
                return Reducers.onStartEditing(
                    state,
                    a.patientId
                );
            case Actions.ACTION_EDIT_PATIENT:
                a = (action as Actions.ActionEditPatient);
                return Reducers.onEdit(
                    state,
                    a.patientId,
                    a.fieldName,
                    a.newValue
                );
            case Actions.ACTION_DELETE_PATIENT:
                a = (action as Actions.ActionDeletePatient);
                return Reducers.onDelete(
                    state,
                    a.patientId
                );
            case Actions.ACTION_SET_SEARCH_TEMPLATE:
                a = (action as Actions.ActionSetSearchTemplate);
                return Reducers.onSetSearchTemplate(
                    state,
                    a.fieldName,
                    a.newValue
                );
            default:
                return state;
        }
    };

    const reducers = combineReducers({
        red,
    });

    const store = createStore(reducers, {});

    return store;
}