import { createStore } from 'redux';
import * as Actions from './actions';
import * as Reducers from './reducers';
import { TableContainerState } from '../components/table-container/table-container';

export function configureStore(initialState: TableContainerState) {
    let delayedDispatch: undefined | ((action: Actions.MyAction) => void) = undefined;

    const red = (state = initialState, action: Actions.MyAction)
        : TableContainerState => {
        let a;
        switch (action.type) {
            case Actions.ACTION_LOAD_MORE_PATIENTS:
                return Reducers.onLoadMorePatients(state, delayedDispatch);
            case Actions.ACTION_CHANGE_TAB:
                a = action as Actions.ActionChangeTab;
                return Reducers.onChangeTab(state, a.newTabNum);
            case Actions.ACTION_RECIEVE_PATIENTS:
                a = action as Actions.ActionRecievePatients;
                return Reducers.onRecievePatients(state, a.patients, a.append);
            case Actions.ACTION_ADD_PATIENT_TO_EDIT_LIST:
                a = action as Actions.ActionAddPatientToEditList;
                return Reducers.onAddPatientToEditList(state, a.patient);
            case Actions.ACTION_RECIEVE_PATIENT_FIELDS:
                a = action as Actions.ActionRecievePatientFields;
                return Reducers.onRecievePatientFields(state, a.patientTemplate);
            case Actions.ACTION_ADD_PATIENT:
                a = action as Actions.ActionAddPatient;
                return Reducers.onAdd(state, a.filledTemplate);
            case Actions.ACTION_EDIT_PATIENT:
                a = (action as Actions.ActionEditPatient);
                console.log(`reducer ${a.patientCopy.status}`);
                return Reducers.onEdit(state, a.patientCopy, a.fieldNameId, a.newValue);
            case Actions.ACTION_DELETE_PATIENT:
                a = (action as Actions.ActionDeletePatient);
                return Reducers.onDelete(state, a.patientId);
            case Actions.ACTION_SET_SEARCH_TEMPLATE:
                a = (action as Actions.ActionSetSearchTemplate);
                return Reducers.onSetSearchTemplate(state, delayedDispatch, a.newValue, a.fieldNameId);
            case Actions.ACTION_GIVE_VARIANTS:
                a = (action as Actions.ActionGiveVariants);
                return Reducers.onGiveVariants(state, a.fieldNameId, a.variants);
            case Actions.ACTION_CLEAR_SEARCH_TEMPLATE:
                a = (action as Actions.ActionSetSearchTemplate);
                return Reducers.onClearSearchTemplate(state, delayedDispatch);
            case Actions.ACTION_START_SAVING:
                a = action as Actions.ActionStartSaving;
                return Reducers.onStartSaving(state, delayedDispatch);
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

    delayedDispatch = (action: Actions.MyAction) => store.dispatch(action);

    return store;
}