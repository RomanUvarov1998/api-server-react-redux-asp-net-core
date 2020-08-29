import './App.css';
import React from 'react';
import { Provider } from 'react-redux';
import { TableContainer, TableContainerState } from './table-container/table-container';
import { configureStore } from '../store/my-store';
import * as Actions from '../store/actions';
import { History, Status } from '../library/history';
import { Patient, toPatient } from "../library/patient";
import { myFetch } from '../library/fetchHelper';
import { Store } from 'redux';
import { TabNums } from './table/table';

type AppProps = {

}
export type AppState = {
  store: StoreType
}
type StoreType = Store<TableContainerState, Actions.MyAction>;

export class App extends React.Component<AppProps, AppState, {}> {
  state: AppState;

  constructor(props: AppProps) {
    super(props);

    let tableContainerState: TableContainerState = {
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
      <>
        <Provider store={this.state.store}>
          <TableContainer
            onSetSearchTemplate={
              (fieldNameId: number, newValue: string) =>
                this.onSetSearchTemplate(this.state.store, fieldNameId, newValue)}
            onClearTemplate={() => this.onClearTemplate(this.state.store)}
            onLoadMore={() => this.loadMore(this.state.store)}

            savePatients={(list: Patient[]) => savePatients(this.state.store, list)}
            clearList={() => clearList(this.state.store)}
          />
        </Provider>
      </>
    );
  }

  componentDidMount() {
    this.loadPatientFields(this.state.store);
  }

  private loadPatientFields(store: StoreType) {
    myFetch(
      'patients/template',
      'GET',
      undefined,
      value => {
        let parsedModel = JSON.parse(value) as Patient;
        let patientTemplate = toPatient(parsedModel);
        store.dispatch(Actions.recievePatientFields(patientTemplate));

        let state = store.getState();

        this.loadPatients(
          store,
          patientTemplate,
          state.searchingList.length,
          state.loadCount);
      }
    );
  }

  private loadMore(store: StoreType) {
    this.state.store.dispatch(Actions.loadMorePatients());

    let state = store.getState();

    let patientTemplate = state.patientTemplate!.copy();
    this.loadPatients(
      store,
      patientTemplate,
      state.searchingList.length,
      state.loadCount)
  }

  private loadPatients(store: StoreType, currentTemplate: Patient,
    currentListLength: number, currentLoadCount: number) {
    myFetch(
      `patients/list?skip=${currentListLength}&take=${currentLoadCount}`,
      'POST',
      JSON.stringify(currentTemplate),
      (value: string) => {
        let data = JSON.parse(value) as Patient[];
        let append = currentListLength > 0;
        let patients = data.map(el => toPatient(el));
        store.dispatch(Actions.recievePatients(patients, append));
      });
  }

  private onSetSearchTemplate(store: StoreType, fieldNameId: number, newValue: string) {
    let state = store.getState();

    if (!state.patientTemplate) throw new Error("template is null");

    let updatedTemplate = state.patientTemplate!.updateField(fieldNameId, newValue);

    store.dispatch(Actions.setSearchTemplate(fieldNameId, newValue));
    this.loadPatients(
      store,
      updatedTemplate,
      0,
      state.loadCount);
  }

  private onClearTemplate(store: StoreType) {
    let state = store.getState();

    this.state.store.dispatch(Actions.clearSearchTemplate());
    this.loadPatients(
      store,
      state.patientTemplate!,
      0,
      state.loadCount);
  }
}

function clearList(store: StoreType) {
  store.dispatch(Actions.clearList());
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