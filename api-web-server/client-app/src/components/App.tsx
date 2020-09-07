import './App.css';
import React from 'react';
import { Provider } from 'react-redux';
import { MainContainer, MainContainerState } from './main-container';
import { configureStore } from '../store/my-store';
import * as Actions from '../store/actions';
import { PatientSearchTemplateVM } from "../library/patient";
import { fetchPatientTemplate } from '../library/fetchHelper';
import { Store } from 'redux';
import { fetchPatientsList } from '../library/fetchHelper';

type AppProps = {

}
export type AppState = {
  store: MyStore
}
export type MyStore = Store<MainContainerState, Actions.MyAction>;

export class App extends React.Component<AppProps, AppState, {}> {
  state: AppState;

  constructor(props: AppProps) {
    super(props);

    const tableContainerState: MainContainerState = {
      isWaitingPatientsList: true,
      isWaitingPatientFields: true,

      isEditingPatientTemplate: false,
      searchingList: [],
      patientTemplate: undefined,
      canLoadMore: false,
      loadPortionCount: 10,
      editingPatient: undefined,

      errorsLog: ''
    };
    this.state = {
      store: configureStore(tableContainerState),
    };
  }

  render(): React.ReactNode {
    return (
      <Provider store={this.state.store}>
        <MainContainer />
      </Provider>
    );
  }

  componentDidMount = () => {
    fetchPatientTemplate(
      serializedData => {
        const parsedModel = JSON.parse(serializedData) as PatientSearchTemplateVM;
        const patientTemplate = PatientSearchTemplateVM.from(parsedModel);
        this.state.store.dispatch(Actions.recievePatientFields(patientTemplate));

        const curState: MainContainerState = this.state.store.getState();

        fetchPatientsList(
          patientTemplate,
          curState.searchingList.length,
          curState.loadPortionCount,
          action => this.state.store.dispatch(action));
      },
      response => this.state.store.dispatch(Actions.notifyBadResponse(response)),
      error => this.state.store.dispatch(Actions.notifyResponseProcessingError(error)));  
  }
}

export default App;