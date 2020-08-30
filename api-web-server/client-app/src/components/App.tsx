import './App.css';
import React from 'react';
import { Provider } from 'react-redux';
import { TableContainer, TableContainerState } from './table-container/table-container';
import { configureStore } from '../store/my-store';
import * as Actions from '../store/actions';
import { History } from '../library/history';
import { Patient, PatientSearchTemplate } from "../library/patient";
import { myFetch } from '../library/fetchHelper';
import { Store } from 'redux';
import { TabNums } from './table/table';
import { loadPatients } from '../store/reducers';

type AppProps = {

}
export type AppState = {
  store: MyStore
}
export type MyStore = Store<TableContainerState, Actions.MyAction>;

export class App extends React.Component<AppProps, AppState, {}> {
  state: AppState;

  constructor(props: AppProps) {
    super(props);

    const tableContainerState: TableContainerState = {
      tabNum: TabNums.Searching,

      isWaitingPatientsList: true,
      isWaitingPatientFields: true,

      searchingList: [],
      patientTemplate: null,
      canLoadMore: false,
      loadCount: 10,

      editingList: [],
      editingPatient: null,
      history: new History<Patient>(),
    };
    this.state = {
      store: configureStore(tableContainerState),
    };
  }

  render(): React.ReactNode {
    return (
      <Provider store={this.state.store}>
        <TableContainer />
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
        const parsedModel = JSON.parse(value) as PatientSearchTemplate;
        const patientTemplate = PatientSearchTemplate.from(parsedModel);
        store.dispatch(Actions.recievePatientFields(patientTemplate));

        const curState = store.getState();

        loadPatients(
          action => store.dispatch(action),
          patientTemplate,
          curState.searchingList.length,
          curState.loadCount);
      }
    );
  }
}

export default App;