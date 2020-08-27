import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import { TableContainer } from './table-container/table-container'
import { configureStore } from '../store/my-store';
import * as Actions from '../store/actions';
import { History, Status } from '../library/history';
import { Patient, toPatient, toPatientField } from "../library/patient";
import { Store } from 'redux';

type AppProps = {

}
export type AppState = {
  isWaitingPatientsList: boolean,
  isWaitingPatientFields: boolean,
  patientsList: Patient[],
  patientTemplate: Patient | null,
  editingId: number,
  editingPatient: Patient | null,
  history: History<Patient>,
  errorMsg: string
}
type StoreType = Store<AppState, Actions.MyAction>;

export class App extends React.Component<AppProps, AppState, {}> {
  state: AppState;
  store: StoreType;

  constructor(props: AppProps) {
    super(props);

    this.state = {
      isWaitingPatientsList: true,
      isWaitingPatientFields: true,
      patientsList: [],
      patientTemplate: null,
      editingId: 0,
      editingPatient: null,
      history: new History<Patient>(),
      errorMsg: ""
    };

    this.store = configureStore(this.state);
  }

  render(): React.ReactNode {
    return (
      <div>
        <Provider store={this.store}>
          <TableContainer
            savePatients={(list: Patient[]) => savePatients(this.store, list)}
            // onScroll={}
          />
        </Provider>
      </div>
    );
  }
  
  componentDidMount() {
    loadPatientFields(this.store);
  }
}

function loadPatients(store: StoreType) {
  myFetch(
    'patients/list',
    undefined,
    undefined,
    value => {
      let data = JSON.parse(value) as Patient[];
      let ps = data.map(el => toPatient(el));
      store.dispatch(Actions.recievePatients(ps));
    });
}

function loadPatientFields(store: StoreType) {
  myFetch(
    'patients/template',
    'GET',
    undefined,
    value => {
      let data = JSON.parse(value) as Patient;
      let ps = data.fields.map(el => toPatientField(el));
      let pt = new Patient(ps, "0", 0, Status.Untouched);
      store.dispatch(Actions.recievePatientFields(pt));

      loadPatients(store);
    }
  );
}

function savePatients(store: StoreType, listToSave: Patient[]) {
  var editingId = store.getState().editingId;

  if (editingId) {
    store.dispatch(Actions.startEditing(editingId));
  }

  store.dispatch(Actions.startSaving());
  
  saveNextPatient(store, listToSave, 0);
}

function saveNextPatient(store: StoreType, listToSave: Patient[], index: number) {
  while (index < listToSave.length && listToSave[index].status === Status.Untouched) {
    console.log(`patient ${listToSave[index].toString()} is untouched, next...`);
    index += 1;
  }

  console.log(`saving ${index} of ${listToSave.length}`);

  if (index < listToSave.length) {
    myFetch(
      'patients/save',
      'POST',
      JSON.stringify(listToSave[index]),
      () => {
        console.log(`saved '${listToSave[index].toString()}'`);
        store.dispatch(Actions.saved(listToSave[index]));
        saveNextPatient(store, listToSave, index + 1);
      }
    );
  } else {
    console.log('all saved!');
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