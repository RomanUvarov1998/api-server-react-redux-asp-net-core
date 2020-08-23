import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import { TableContainer } from './table-container/table-container'
import { configureStore } from '../store/my-store';
import * as Actions from '../store/actions';
import { History } from '../library/history';
import { Patient, toPatient, toPatientField } from "../library/patient";

type AppProps = {

}
export type AppState = {
  isWaitingPatientsList: boolean,
  isWaitingPatientFields: boolean,
  patientsList: Patient[],
  patientTemplate: Patient | null,
  editingId: number,
  editingPatient: Patient | null,
  history: History<Patient, string>,
  errorMsg: string
}

type PatientsChanges = {
  patientsToSave: Patient[],
  idsToDelete: number[]
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
          <TableContainer
            savePatients={this.savePatients}
            // savePatient={this.savePatient}
          />
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
      editingPatient: null,
      history: new History<Patient, string>(p => p.databaseId),
      errorMsg: ""
    };
  }

  private loadPatients() {
    myFetch<Patient[]>(
      'home/patients',
      undefined,
      undefined,
      data => {
        let ps = data.map(el => toPatient(el));
        this.store.dispatch(Actions.recievePatients(ps));
      });
  }

  private loadPatientFields() {
    myFetch<Patient>(
      'home/template',
      'GET',
      undefined,
      data => {
        let ps = data.fields.map(el => toPatientField(el));
        let pt = new Patient(ps, "0", 0);
        this.store.dispatch(Actions.recievePatientFields(pt));

        this.loadPatients();
      }
    );
  }

  private savePatients = (listToSave: Patient[], idsToDelete: number[]) => {
    var editingId = this.store.getState().red.editingId;

    if (editingId) {
      this.store.dispatch(Actions.startEditing(editingId));
    }

    this.store.dispatch(Actions.startWaiting(true, false));

    var bodyObj: PatientsChanges = {
      patientsToSave: listToSave,
      idsToDelete
    };
    var body = JSON.stringify(bodyObj);

    myFetch<Patient[]>(
      'home/savechanges',
      'POST',
      body,
      data => {
        let ps = data.map(el => toPatient(el));
        this.store.dispatch(Actions.recievePatients(ps));

        this.loadPatients();
      }
    );
  }
}

function myFetch<TData>(
  url: string,
  method: string | undefined = 'GET',
  body: string | undefined = undefined,
  myThen: (data: TData) => void
) {
  fetch(url, { method, body })
    .then(response => {
      if (!response.ok) {
        console.error(response.statusText);
      }
      return response.text();
    })
    .then(text => {
      try {
        let data = JSON.parse(text) as TData;
        myThen(data);
      }
      catch (e) {
        let rootElement = document.getElementById("root");
        if (rootElement) {
          rootElement.innerHTML = text + e.toString();
        } else {
          console.log(text);
        }
      }
    });
}

export default App;