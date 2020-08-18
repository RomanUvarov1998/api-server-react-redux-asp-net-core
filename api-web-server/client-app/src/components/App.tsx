import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import { TableContainer } from './table-container/table-container'
import { Patient, PatientField, toPatient, toPatientField } from "../library/patient";
import { configureStore } from '../store/my-store';
import { History } from '../library/history';
import * as Actions from '../store/actions';

type AppProps = {

}
export type AppState = {
  isWaitingPatientsList: boolean,
  isWaitingPatientFields: boolean,
  patientsList: Patient[],
  patientTemplate: Patient | null,
  editingId: number,
  history: History<Patient>,
}

export class App extends React.Component<AppProps, AppState, {}> {
  state: AppState;
  store: any;

  constructor(props: AppProps) {
    super(props);

    this.state = this.createInitialState();

    this.store = configureStore(this.state);

    this.loadPatientFields();
  }

  render(): React.ReactNode {
    return (
      <div>
        <Provider store={this.store}>
          <TableContainer />
        </Provider>
      </div>
    );
  }

  private createInitialState(): AppState {
    return {
      isWaitingPatientsList: true,
      isWaitingPatientFields: true,
      patientsList: [],
      patientTemplate: null,
      editingId: 0,
      history: new History<Patient>(),
    };
  }

  private loadPatients() {
    fetch(`home/patients`)
      .then(response => {
        let rj = response.json();
        let rjp = rj as Promise<Patient[]>;
        return rjp;
      })
      .then(data => {
        let ps = data.map(el => toPatient(el));
        this.store.dispatch(Actions.recievePatients(ps));
      });
  }

  private loadPatientFields() {
    fetch(`home/template`)
      .then(response => {
        let rj = response.json();
        let rjp = rj as Promise<Patient>;
        return rjp;
      })
      .then(data => {
        let ps = data.fields.map(el => toPatientField(el));
        let pt = new Patient(ps, 0);
        this.store.dispatch(Actions.recievePatientFields(pt));
        
        this.loadPatients();
      });
  }
}

export default App;
