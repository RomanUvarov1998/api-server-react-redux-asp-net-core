import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import { TableContainer } from './table-container/table-container'
import { configureStore } from '../store/my-store';
import * as Actions from '../store/actions';
import { History, Status } from '../library/history';
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
      history: new History<Patient, string>(),
      errorMsg: ""
    };
  }

  private loadPatients() {
    myFetch(
      'home/patients',
      undefined,
      undefined,
      value => {
        let data = JSON.parse(value) as Patient[];
        let ps = data.map(el => toPatient(el));
        this.store.dispatch(Actions.recievePatients(ps));
      });
  }

  private loadPatientFields() {
    myFetch(
      'home/template',
      'GET',
      undefined,
      value => {
        let data = JSON.parse(value) as Patient;
        let ps = data.fields.map(el => toPatientField(el));
        let pt = new Patient(ps, "0", 0, Status.Untouched);
        this.store.dispatch(Actions.recievePatientFields(pt));

        this.loadPatients();
      }
    );
  }

  private savePatients = (listToSave: Patient[]) => {
    var editingId = this.store.getState().red.editingId;

    if (editingId) {
      this.store.dispatch(Actions.startEditing(editingId));
    }

    this.store.dispatch(Actions.startSaving());
    
    this.saveNextPatient(listToSave, 0);
  }

  private saveNextPatient(listToSave: Patient[], index: number) {
    while (index < listToSave.length && listToSave[index].status === Status.Untouched) {
      console.log(`patient ${listToSave[index].toString()} is untouched, next...`);
      index += 1;
    }

    console.log(`saving ${index} of ${listToSave.length}`);

    if (index < listToSave.length) {
      myFetch(
        'home/savepatientchanges',
        'POST',
        JSON.stringify(listToSave[index]),
        value => {
          console.log(`saved '${listToSave[index].toString()}'`);
          this.store.dispatch(Actions.saved(listToSave[index]));
          this.saveNextPatient(listToSave, index + 1);
        }
      );
    } else {
      console.log('all saved!');
      //this.loadPatients();
    }
  }
}

function myFetch(
  url: string,
  method: string | undefined = 'GET',
  body: string | undefined = undefined,
  myThen: (value: string) => void | null
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
        myThen(text);
      }
      catch (e) {
        let rootElement = document.getElementById("root");
        if (rootElement) {
          rootElement.innerHTML = `text:\n${text}\n\ne:\n${e.toString()}`;
        } else {
          console.log(text);
        }
      }
    });
}

export default App;