import './App.css';
import React from 'react';
import { Provider } from 'react-redux';
import { MainContainer, MainContainerState } from './main-container';
import { configureStore } from '../store/my-store';
import * as Actions from '../store/actions';
import { PatientSearchTemplateVM } from "../library/patient";
import { myFetch } from '../library/fetchHelper';
import { Store } from 'redux';
import { loadPatients } from '../store/reducers';

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
      patientTemplate: null,
      canLoadMore: false,
      loadPortionCount: 10,
      editingPatient: null
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

  componentDidMount() {
    this.loadPatientFieldsAndList(this.state.store);
  }

  private loadPatientFieldsAndList(store: MyStore) {
    myFetch(
      'patients/template',
      'GET',
      undefined,
      value => {
        const parsedModel = JSON.parse(value) as PatientSearchTemplateVM;
        const patientTemplate = PatientSearchTemplateVM.from(parsedModel);
        store.dispatch(Actions.recievePatientFields(patientTemplate));

        const curState = store.getState();

        loadPatients(
          action => store.dispatch(action),
          patientTemplate,
          curState.searchingList.length,
          curState.loadPortionCount);
      }
    );
  }
}

export default App;