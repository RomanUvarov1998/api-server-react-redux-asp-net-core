import './App.css';
import React from 'react';
import { Provider } from 'react-redux';
import { TableContainer, TableContainerState } from './table-container/table-container';
import { configureStore } from '../store/my-store';
import * as Actions from '../store/actions';
import { History, Status } from '../library/history';
import { Patient, toPatient, PatientSearchTemplate, toPatientSearchTemplate } from "../library/patient";
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
      <>
        <Provider store={this.state.store}>
          <TableContainer
            onSetSearchTemplate={
              (fieldNameId: number, newValue: string) =>
                this.onSetSearchTemplate(this.state.store, fieldNameId, newValue)}
            onClearTemplate={() => this.onClearTemplate(this.state.store)}
            onLoadMore={() => this.loadMore(this.state.store)}

            savePatients={(list: Patient[]) => this.savePatients(this.state.store, list)}
            clearList={() => this.clearList(this.state.store)}
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
        const parsedModel = JSON.parse(value) as PatientSearchTemplate;
        const patientTemplate = toPatientSearchTemplate(parsedModel);
        store.dispatch(Actions.recievePatientFields(patientTemplate));

        const state = store.getState();

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

    const state = store.getState();

    const patientTemplate = state.patientTemplate!.copy();
    this.loadPatients(
      store,
      patientTemplate,
      state.searchingList.length,
      state.loadCount)
  }

  private loadPatients(store: StoreType, currentTemplate: PatientSearchTemplate,
    currentListLength: number, currentLoadCount: number) {
    myFetch(
      `patients/list?skip=${currentListLength}&take=${currentLoadCount}`,
      'POST',
      JSON.stringify(currentTemplate),
      (value: string) => {
        const data = JSON.parse(value) as Patient[];
        const append = currentListLength > 0;
        const patients = data.map(el => toPatient(el));
        store.dispatch(Actions.recievePatients(patients, append));
      });
  }

  private onSetSearchTemplate(store: StoreType, fieldNameId: number, newValue: string) {
    const state = store.getState();

    if (!state.patientTemplate) throw new Error("template is null");

    const updatedTemplate = state.patientTemplate!.updateField(fieldNameId, newValue);

    store.dispatch(Actions.setSearchTemplate(fieldNameId, newValue));
    
    this.loadPatients(
      store,
      updatedTemplate,
      0,
      state.loadCount);

    myFetch(
      `patients/variants?fieldNameId=${fieldNameId}&maxCount=${5}`,
      'POST',
      JSON.stringify(updatedTemplate),
      value => {
        const variants = JSON.parse(value) as string[];
        store.dispatch(Actions.giveVariants(fieldNameId, variants));
      }
    );
  }

  private onClearTemplate(store: StoreType) {
    const state = store.getState();

    const updatedTemplate = state.patientTemplate!.copy();
    updatedTemplate.fields.forEach(f => f.value = '');

    this.state.store.dispatch(Actions.clearSearchTemplate());
    this.loadPatients(
      store,
      updatedTemplate,
      0,
      state.loadCount);
  }

  private savePatients(store: StoreType, listToSave: Patient[]) {
    const editingPatient = store.getState().editingPatient;

    if (editingPatient) {
      store.dispatch(Actions.finishEditing(true));
    }

    store.dispatch(Actions.startSaving());

    this.saveNextPatient(store, listToSave, 0);
  }

  private clearList(store: StoreType) {
    store.dispatch(Actions.clearList());
  }

  private saveNextPatient(store: StoreType, listToSave: Patient[], index: number) {
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

    const patient = listToSave[index];
    let action;
    let processResponseBody: (value: string) => void;
    switch (patient.status) {
      case Status.Added:
        action = 'add';
        processResponseBody = (value: string) => {
          const parsedModel = JSON.parse(value) as Patient;
          const addedPatient = toPatient(parsedModel);

          console.log(`added '${addedPatient.toString()}'`);

          store.dispatch(Actions.savedAdded(addedPatient, patient));
        };
        break;
      case Status.Modified:
        action = 'update';
        processResponseBody = (value: string) => {
          const parsedModel = JSON.parse(value) as Patient;
          const updatedPatient = toPatient(parsedModel);

          console.log(`updated '${updatedPatient.toString()}'`);

          store.dispatch(Actions.savedUpdated(updatedPatient));
        };
        break;
      case Status.Deleted:
        action = 'delete';
        processResponseBody = (value: string) => {
          const deletedId = JSON.parse(value) as number;

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
        this.saveNextPatient(store, listToSave, index + 1);
      }
    );
  }
}

export default App;