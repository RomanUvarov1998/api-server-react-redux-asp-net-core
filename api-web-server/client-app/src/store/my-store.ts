import { createStore } from 'redux';
import * as Actions from './actions';
import * as Reducers from './reducers';
import { MainContainerState } from '../components/main-container';

export function configureStore(initialState: MainContainerState) {
    let delayedDispatch: undefined | ((action: Actions.MyAction) => void) = undefined;

    const red = (state = initialState, action: Actions.MyAction)
        : MainContainerState => {
        let a;
        switch (action.type) {
            case Actions.ACTION_RECIEVE_PATIENT_FIELDS:
                a = action as Actions.ActionRecievePatientFields;
                return Reducers.onRecievePatientFields(state, a.patientTemplate);
            case Actions.ACTION_SET_SEARCH_TEMPLATE:
                a = (action as Actions.ActionSetSearchTemplate);
                return Reducers.onSetSearchTemplate(state, delayedDispatch, a.newValue, a.fieldNameId);
            case Actions.ACTION_GIVE_VARIANTS:
                a = (action as Actions.ActionGiveVariants);
                return Reducers.onGiveVariants(state, a.fieldNameId, a.variants);
            case Actions.ACTION_CLEAR_SEARCH_TEMPLATE:
                a = (action as Actions.ActionSetSearchTemplate);
                return Reducers.onClearSearchTemplate(state, delayedDispatch);
            case Actions.ACTION_RECIEVE_PATIENTS:
                a = action as Actions.ActionRecievePatients;
                return Reducers.onRecievePatients(state, a.patients, a.append);
            case Actions.ACTION_LOAD_MORE_PATIENTS:
                return Reducers.onLoadMorePatients(state, delayedDispatch);



            case Actions.ACTION_ENTER_EDITOR:
                a = action as Actions.ActionEnterEditor;
                return Reducers.onEnterEditor(state, a.patient, a.status);
            case Actions.ACTION_EDIT_PATIENT:
                a = (action as Actions.ActionEditPatient);
                return Reducers.onEditPatient(state, a.fieldNameId, a.newValue);
            case Actions.ACTION_EXIT_EDITOR:
                a = (action as Actions.ActionExitEditor);
                return Reducers.onExitEditor(state, a.save, delayedDispatch);
            case Actions.ACTION_GET_SAVING_RESULT:
                a = (action as Actions.ActionGetSavingResult);
                return Reducers.onGetSavingResult(state, a.success, a.message);
            case Actions.ACTION_CONFIRM_SAVING_RESULT:
                a = (action as Actions.ActionConfirmSavingResult);
                return Reducers.onConfirmSavingResult(state);

            case Actions.ACTION_START_EDIT_PATIENT_TEMPLATE:
                a = (action as Actions.ActionStartEditPatientTemplate);
                return Reducers.onStartEditPatientTemplate(state);
            case Actions.ACTION_FINISH_EDIT_PATIENT_TEMPLATE:
                a = (action as Actions.ActionFinishEditPatientTemplate);
                return Reducers.onFinishEditPatientTemplate(state, a.save, a.newTemplate);

            default:
                return state;
        }
    };

    const store = createStore(red);

    delayedDispatch = (action: Actions.MyAction) => store.dispatch(action);

    return store;
}