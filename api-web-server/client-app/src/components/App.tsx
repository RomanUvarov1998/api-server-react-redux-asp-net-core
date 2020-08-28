import React from 'react';
import { Provider } from 'react-redux';
import { Button, ButtonGroup } from 'reactstrap';
import './App.css';
import { TableContainer, TableContainerState } from './table-container/table-container';
import { SearchTable } from './search-table/search-table';
import { configureStore } from '../store/my-store';
import * as Actions from '../store/actions';
import { History, Status } from '../library/history';
import { Patient, toPatient } from "../library/patient";
import { myFetch } from '../library/fetchHelper';
import { Store } from 'redux';

type AppProps = {

}
export type AppState = {
  tableContainerState: TableContainerState,
  store: StoreType,
  showingMode: ShowingMode
}
type StoreType = Store<TableContainerState, Actions.MyAction>;

enum ShowingMode {
  Searching,
  Editing,
}

export class App extends React.Component<AppProps, AppState, {}> {
  state: AppState;

  constructor(props: AppProps) {
    super(props);

    let tableContainerState = {
      isWaitingPatientsList: true,
      isWaitingPatientFields: true,
      patientsList: [],
      patientTemplate: null,
      editingPatient: null,
      history: new History<Patient>()
    };
    this.state = {
      tableContainerState,
      store: configureStore(tableContainerState),
      showingMode: ShowingMode.Searching
    };
  }

  render(): React.ReactNode {
    let currentUI = (<p>No UI...</p>);

    switch (this.state.showingMode) {
      case ShowingMode.Searching:
        currentUI = (
          <SearchTable
            addToEditingList={patient => this.state.store.dispatch(Actions.addPatientToAdd(patient))}
          />
        );
        break;
      case ShowingMode.Editing:
        currentUI = (
          <Provider store={this.state.store}>
            <TableContainer
              savePatients={(list: Patient[]) => savePatients(this.state.store, list)}
              clearList={() => clearList(this.state.store)}
            />
          </Provider>
        );
        break;
    }

    return (
      <>
        <ButtonGroup>
          <Button onClick={() => this.setState({ showingMode: ShowingMode.Searching })}>
            Поиск
          </Button>
          <Button onClick={() => this.setState({ showingMode: ShowingMode.Editing })}>
            Редактирование
          </Button>
        </ButtonGroup>
        {currentUI}
      </>
    );
  }

  componentDidMount() {
    loadPatientFields(this.state.store);
  }
}

// function loadPatients(store: StoreType) {
//   myFetch(
//     'patients/list',
//     'GET',
//     undefined,
//     value => {
//       let data = JSON.parse(value) as Patient[];
//       let ps = data.map(el => toPatient(el));
//       // store.dispatch(Actions.addPatientToAdd(ps));
//     });
// }

function clearList(store: StoreType) {
  store.dispatch(Actions.clearList());
}

function loadPatientFields(store: StoreType) {
  myFetch(
    'patients/template',
    'GET',
    undefined,
    value => {
      let parsedModel = JSON.parse(value) as Patient;
      let patient = toPatient(parsedModel);
      store.dispatch(Actions.recievePatientFields(patient));

      // loadPatients(store);
    }
  );
}

function savePatients(store: StoreType, listToSave: Patient[]) {
  const editingPatient = store.getState().editingPatient;

  if (editingPatient) {
    store.dispatch(Actions.finishEditing(true));
  }

  store.dispatch(Actions.startSaving());

  saveNextPatient(store, listToSave, 0);
}

function saveNextPatient(store: StoreType, listToSave: Patient[], index: number) {
  while (
    index < listToSave.length &&
    listToSave[index].status === Status.Untouched
  ) {
    console.log(`patient ${listToSave[index].toString()} is untouched, next...`);
    index += 1;
  }

  if (index >= listToSave.length) {
    console.log('all saved!');
    return;
  }

  let patient = listToSave[index];
  let action;
  let processResponseBody: (value: string) => void;
  switch (patient.status) {
    case Status.Added:
      action = 'add';
      processResponseBody = (value: string) => {
        let parsedModel = JSON.parse(value) as Patient;
        let addedPatient = toPatient(parsedModel);

        console.log(`added '${addedPatient.toString()}'`);

        store.dispatch(Actions.savedAdded(addedPatient, patient));
      };
      break;
    case Status.Modified:
      action = 'update';
      processResponseBody = (value: string) => {
        let parsedModel = JSON.parse(value) as Patient;
        let updatedPatient = toPatient(parsedModel);

        console.log(`updated '${updatedPatient.toString()}'`);

        store.dispatch(Actions.savedUpdated(updatedPatient));
      };
      break;
    case Status.Deleted:
      action = 'delete';
      processResponseBody = (value: string) => {
        let deletedId = JSON.parse(value) as number;

        console.log(`deleted '${deletedId}'`);

        store.dispatch(Actions.savedDeleted(deletedId));
      };
      break;
    default: throw new Error(`unknown action ${action} on patient ${listToSave[index]}`);
  }

  myFetch(
    `patients/${action}`,
    'POST',
    JSON.stringify(listToSave[index]),
    (value: string) => {
      processResponseBody(value);
      saveNextPatient(store, listToSave, index + 1);
    }
  );
}

export default App;