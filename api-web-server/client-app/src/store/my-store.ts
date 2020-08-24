import { createStore, combineReducers } from 'redux'
import * as Actions from './actions';
import * as Reducers from './reducers';
import { AppState } from '../components/App'

export function configureStore(initialState: AppState) {
    const red = (state = initialState, action: { type: string }): AppState => {
        let a;
        switch (action.type) {
            case Actions.ACTION_START_WAITING:
                a = action as Actions.ActionStartWaiting;
                return {
                    ...state,
                    isWaitingPatientFields: a.waitPatientFields,
                    isWaitingPatientsList: a.waitPatients
                };
            case Actions.ACTION_RECIEVE_PATIENTS:
                a = action as Actions.ActionRecievePatients;
                return Reducers.onRecievePatients(
                    {
                        ...state,
                        isWaitingPatientsList: false
                    },
                    a.patients
                );
            case Actions.ACTION_RECIEVE_PATIENT_FIELDS:
                a = action as Actions.ActionRecievePatientFields;
                return Reducers.onRecievePatientFields(
                    {
                        ...state,
                        isWaitingPatientFields: false
                    },
                    a.patientTemplate
                );
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
            case Actions.ACTION_FINISH_EDIT_PATIENT:
                a = action as Actions.ActionFinishEditingPatient;
                return Reducers.onFinishEditing(
                    state,
                    a.save
                );
            case Actions.ACTION_EDIT_PATIENT:
                a = (action as Actions.ActionEditPatient);
                return Reducers.onEdit(
                    state,
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
            case Actions.ACTION_UNDO:
                a = action as Actions.ActionUndo;
                return Reducers.onUndo(state);
            case Actions.ACTION_REDO:
                a = action as Actions.ActionUndo;
                return Reducers.onRedo(state);
            case Actions.ACTION_START_SAVING:
                a = action as Actions.ActionStartSaving;
                return Reducers.onStartSaving(state);
            case Actions.ACTION_SAVED:
                a = action as Actions.ActionSaved;
                return Reducers.onSaved(state, a.patient);
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