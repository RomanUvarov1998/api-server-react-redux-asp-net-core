import { createStore, Store } from 'redux';
import * as Actions from './actions';
import * as Reducers from './reducers';
import { MainContainerState } from '../components/main-container';

export function configureStore(initialState: MainContainerState) {
    let store: Store<MainContainerState, Actions.MyAction>;

    const red = (state = initialState, action: Actions.MyAction)
        : MainContainerState => {
        let a;
        switch (action.type) {
            case Actions.ACTION_RECIEVE_PATIENT_FIELDS:
                a = action as Actions.ActionRecievePatientFields;
                return Reducers.onRecievePatientFields(state, a.patientTemplate);
            case Actions.ACTION_SET_SEARCH_TEMPLATE:
                a = (action as Actions.ActionSetSearchTemplate);
                return Reducers.onSetSearchTemplate(state, a.newValue,
                    a.fieldNameId,
                    action => store.dispatch(action));
            case Actions.ACTION_GIVE_VARIANTS:
                a = (action as Actions.ActionGiveVariants);
                return Reducers.onGiveVariants(state, a.fieldNameId, a.variants);
            case Actions.ACTION_CLEAR_SEARCH_TEMPLATE:
                a = (action as Actions.ActionSetSearchTemplate);
                return Reducers.onClearSearchTemplate(state,
                    action => store.dispatch(action));
            case Actions.ACTION_RECIEVE_PATIENTS:
                a = action as Actions.ActionRecievePatients;
                return Reducers.onRecievePatients(state, a.patients, a.append);
            case Actions.ACTION_LOAD_MORE_PATIENTS:
                return Reducers.onLoadMorePatients(state,
                    action => store.dispatch(action));

            case Actions.ACTION_ENTER_PATIENT_EDITOR:
                a = action as Actions.ActionEnterPatientEditor;
                return Reducers.onEnterEditor(state, a.patient);
            case Actions.ACTION_EXIT_PATIENT_EDITOR:
                a = (action as Actions.ActionExitPatientEditor);
                return Reducers.onExitEditor(state, a.patientAndAction);

            case Actions.ACTION_START_EDIT_PATIENT_TEMPLATE:
                a = (action as Actions.ActionStartEditPatientTemplate);
                return Reducers.onStartEditPatientTemplate(state);
            case Actions.ACTION_FINISH_EDIT_PATIENT_TEMPLATE:
                a = (action as Actions.ActionFinishEditPatientTemplate);
                return Reducers.onFinishEditPatientTemplate(state, a.newTemplate);

            case Actions.ACTION_NOTIFY_BAD_RESPONSE:
                a = (action as Actions.ActionNotifyBadResponse);
                return Reducers.onNotifyBadResponse(state, a.response, a.msg);
            case Actions.ACTION_NOTIFY_RESPONSE_PROCESSING_ERROR:
                a = (action as Actions.ActionNotifyResponseProcessingError);
                return Reducers.onNotifyResponseProcessingError(state, a.error);

            default:
                return state;
        }
    };

    store = createStore(red);

    return store;
}