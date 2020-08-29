import { createStore } from 'redux'
import * as Actions from './actions';
import * as Reducers from './reducers';
import { TableContainerState } from '../components/table-container/table-container'

export function configureStore(initialState: TableContainerState) {
    const red = (state = initialState, action: Actions.MyAction)
        : TableContainerState => {
        let a;
        switch (action.type) {
            case Actions.ACTION_START_WAITING:
                a = action as Actions.ActionStartWaiting;
                return {
                    ...state,
                    isWaitingPatientFields: a.waitPatientFields
                };
            case Actions.ACTION_LOAD_MORE_PATIENTS:
                return Reducers.onLoadMorePatients(state);
            case Actions.ACTION_CHANGE_TAB:
                a = action as Actions.ActionChangeTab;
                return Reducers.onChangeTab(state, a.newTabNum);
            case Actions.ACTION_RECIEVE_PATIENTS:
                a = action as Actions.ActionRecievePatients;
                return Reducers.onRecievePatients(state, a.patients, a.append);
            case Actions.ACTION_ADD_PATIENT_TO_EDIT_LIST:
                a = action as Actions.ActionAddPatientToEditList;
                return Reducers.onAddPatientToEditList(state, a.patient);
            case Actions.ACTION_CLEAR_LIST:
                a = action as Actions.ActionClearList;
                return Reducers.onClearList(state);
            case Actions.ACTION_RECIEVE_PATIENT_FIELDS:
                a = action as Actions.ActionRecievePatientFields;
                return Reducers.onRecievePatientFields(state, a.patientTemplate);
            case Actions.ACTION_ADD_PATIENT:
                return Reducers.onAdd(state);
            case Actions.ACTION_START_EDIT_PATIENT:
                a = action as Actions.ActionStartEditingPatient;
                return Reducers.onStartEditing(state, a.patientId);
            case Actions.ACTION_FINISH_EDIT_PATIENT:
                a = action as Actions.ActionFinishEditingPatient;
                return Reducers.onFinishEditing(state, a.save);
            case Actions.ACTION_EDIT_PATIENT:
                a = (action as Actions.ActionEditPatient);
                return Reducers.onEdit(state, a.fieldNameId, a.newValue);
            case Actions.ACTION_DELETE_PATIENT:
                a = (action as Actions.ActionDeletePatient);
                return Reducers.onDelete(state, a.patientId);
            case Actions.ACTION_SET_SEARCH_TEMPLATE:
                a = (action as Actions.ActionSetSearchTemplate);
                return Reducers.onSetSearchTemplate(state, a.newValue, a.fieldNameId);
            case Actions.ACTION_CLEAR_SEARCH_TEMPLATE:
                a = (action as Actions.ActionSetSearchTemplate);
                return Reducers.onClearSearchTemplate(state);
            case Actions.ACTION_UNDO:
                a = action as Actions.ActionUndo;
                return Reducers.onUndo(state);
            case Actions.ACTION_REDO:
                a = action as Actions.ActionUndo;
                return Reducers.onRedo(state);
            case Actions.ACTION_START_SAVING:
                a = action as Actions.ActionStartSaving;
                return Reducers.onStartSaving(state);
            case Actions.ACTION_SAVED_ADDED:
                a = action as Actions.ActionSavedAdded;
                return Reducers.onPatientSavedAdded(state, a.newPatient, a.oldPatient);
            case Actions.ACTION_SAVED_UPDATED:
                a = action as Actions.ActionSavedUpdated;
                return Reducers.onPatientSavedUpdated(state, a.updatedPatient);
            case Actions.ACTION_SAVED_DELETED:
                a = action as Actions.ActionSavedDeleted;
                return Reducers.onPatientSavedDeleted(state, a.deletedId);
            default:
                return state;
        }
    };

    const store = createStore(red);

    return store;
}