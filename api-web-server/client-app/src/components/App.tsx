import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import { TableContainer } from './table-container/table-container'
import { Patient, PatientField } from "../library/patient";
import { configureStore } from '../store/my-store';
import { History } from '../library/history';

type AppProps = {

}
export type AppState = {
  patientsList: Patient[],
  patientTemplate: Patient,
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

  private createInitialState() {
    var p1: Patient = new Patient(
        [
            { name: "name", value: "vasya" },
            { name: "surname", value: "petrov" },
            { name: "patronimyc", value: "m" },
        ],
        1
    );
    var p2: Patient = new Patient(
        [
            { name: "name", value: "misha" },
            { name: "surname", value: "ivanov" },
            { name: "patronimyc", value: "p" },
        ],
        2
    );
    var patientsList: Patient[] = [p1, p2];

    var patientTemplate = new Patient(
        [
            new PatientField("name", ""),
            new PatientField("surname", ""),
            new PatientField("patronimyc", ""),
        ],
        0
    );

    return {
        patientsList,
        patientTemplate,
        editingId: 0,
        history: new History<Patient>(),
    };
}
}

export default App;
